from django.utils.timezone import make_aware

import json
import requests
import os
from core.settings import *

from django.http import HttpResponse, JsonResponse
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.shared_modules.mongodb_utils import *

from fsrs import Scheduler, Card, Rating, ReviewLog
from PyPDF2 import PdfMerger
from PyPDF2 import PdfReader, PdfWriter

#from .models import UploadedFile
#from .serializers import UploadedFileSerializer

from bson import ObjectId

COURS_BASE_URL="http://localhost:8000/api/cours" 
PLANNING_BASE_URL="http://localhost:8000/api/planning"
DECK_BASE_URL="http://localhost:8000/api/decks"


class DébutSéanceRévision(APIView):
    """
    L'utilisateur veut lancer une séance de révision à propos des cartes d'un deck.
    """
    def get(self, request):
        """
        GET /start-session (eventellement ajouter /api si on modif urls dans core)
        Takes: ID utilisateur (user_id) + le deck (deck_id)
        return: Liste cartes
        
        """

        user_id = request.GET.get('user_id')
        deck_id = request.GET.get('deck_id')

        if not user_id or not deck_id:
            return Response(
                {"error": "user_id and deck_id parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(
            #"http://planification:8000/api/sauvegarder-revision/",  #à modifier avec docker
            "http://localhost:8000/api/learning-session/get-cartes/",
            params={"user_id": user_id, "deck_id": deck_id})
        
        if response.status_code != 200:
            return Response(
                {"error": "Failed to get-cartes"},
                status=status.HTTP_400_BAD_REQUEST
            )
        cards= response.json()
        return Response(
            cards,
            status=status.HTTP_200_OK
        )

class updateSéanceRévision(APIView):
    """
    en prenant note pour chaque carte de si elle est répondue correctement ou non (en cas de réponse incorrecte, elle reste dans le roulement jusqu'à ce que la réponse soit correcte) puis envoie ces informations à "Planification" pour sauvegarder la progression et update les prochaines dates de révision de ces cartes
    result vaut 0 si bon du premier coup, 1 si faux d'abord et pas encore bon au moment de sauvegarder les résultats, et 2 si bon après une ou plusieurs erreurs
    """
    def post(self, request):
        """
        POST /update-session            
        Takes: Takes: ID utilisateur + Liste résultats
        metadata={
                    "user_id":"name",
                    "results"= {
                        "id1": réponse1,
                        "id2": réponse2, ...
                        }
                }

        return: success message
        
        """

        metadata=request.data.get('metadata')
        if not metadata:
            return Response({"error": "Missing user_id or results"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            "http://localhost:8000/api/learning-session/send-planification/",
            data={'metadata': metadata}
        )
        
        if response.status_code == 200:
            return Response(
                {"message": "Success SendPlanification"},
                status=status.HTTP_200_OK
        )


        else:
            return Response(
                {"error": "Failed to SendPlanification"},
                status=status.HTTP_400_BAD_REQUEST
            )




# General functions :

class GetAccessibleCourses(APIView):
    """
    GET /GetAccessibleCourses
    Takes user_id
    Returns list of accessible (owned + subscribed) courses for the user (id_cours, nom_cours, date_creation)
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.get(COURS_BASE_URL + "/getAccessibleCourses", params={"user_id": user_id})
        if response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve accessible courses."},
                status=response.status_code
            )

        return Response(
            response.json(),
            status=response.status_code
        )
    


class GetCourseChapters(APIView):
    """
    GET /GetCourseChapters
    Takes user_id, id_course
    Returns list of chapters in the course (id_chapitre, nom_chapitre, date_creation)
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_course = request.GET.get('id_course')

        if not user_id or not id_course:
            return Response({"error": "user_id and id_course are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.get(COURS_BASE_URL + "/getCourseChapters", params={"user_id": user_id, "id_course": id_course})

        return Response(
            response.json(),
            status=response.status_code
        )

class GetDeckNames(APIView):
    """
    GET /GetDeckNames
    Takes user_id, id_chapitre, id_deck
    Returns list all cards in the chapter
    """
    def get(self, request):

        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.get(DECKS_BASE_URL + "/getDeckNames", params={"id_user": id_user})

        return Response(
            response.json(),
            status=response.status_code
        )

class CreateDeck(APIView):
    """
    GET /createDeck
    Takes: user_id, nom_deck, tags          # nom_deck and tags are optional 
    Returns: id_deck
    """
    def get(self, request):
        id_user = request.GET.get('user_id')
        nom_deck = request.GET.get('nom_deck')
        tags = request.GET.get('tags')

        if not id_user:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not tags:
            tags=[]
        if not nom_deck:
            nom_deck="default_name"
        
        response = requests.get(DECK_BASE_URL + "/createDeck", params={
                "user_id": id_user,
                "nom_deck":nom_deck,
                "tags":tags
            })
        if response.status_code == 200:
            return Response(
                response.json(),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                response.json(),
                status=status.HTTP_400_BAD_REQUEST
        )
    
# design-services.md : Création cartes

class CreateCards(APIView):
    """
    POST /CreateCards
    Takes: List(card)
    Returns: nothing
    """
    def post(self, request):
        cartes = request.data.get('cartes', [])  # We expect a list of cards in the request body
        if not cartes:
            return Response({"error": "No card to add."}, status=status.HTTP_400_BAD_REQUEST) 

        # Check if all parameters are provided
        required_fields = ['id_deck', 'id_chapitre', 'front', 'back']
        for carte in cartes:
            if not all(field in carte for field in required_fields):
                return Response({"error": f"Card {carte} is missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        
         # TODO Check if id_deck and id_chapitre are valid ObjectId

        response = requests.post(DECKS_BASE_URL + "/addCards", json={"cartes": cartes})

        return Response(
            response,
            status=response.status_code
        )

# design-services.md : Quiz de validation

class CompleteQuiz(APIView):
    """
    POST /CompleteQuiz
    Takes: user_id, id_chapitre, id_deck
    Returns: nothing
    """
    def post(self, request):
        user_id = request.data.get('user_id')
        id_chapitre = request.data.get('id_chapitre')
        id_deck = request.data.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.post(DECKS_BASE_URL + "/completeQuiz", json={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })

class DeleteCourse(APIView):

    def get(self, request):
        """
        GET /DeleteCourse
        Takes: id_user, id_course
        Returns: success message
        """
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        id_course = request.GET.get('id_course')
        if not id_course:
            return Response({"error": "id_course parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
         

        # Réception de l'information sur la nature du cours (public ou privé) ainsi que de la liste des noms des chapitres ; 
        response = requests.get(
            COURS_BASE_URL + "/deleteCourse", 
            params={
                "id_user": id_user,
                "id_course": id_course
                }
            )
        if response.status_code != 200:
            return Response(
                response.json(),
                status=status.HTTP_400_BAD_REQUEST
            )
        

        # Envoi de ces informations à Quiz pour suppression ; 
        # TODO: Uncomment when Quiz service is ready
                        
        #response = requests.get(
        #    QUIZ_BASE_URL + "/deleteCourse", 
        #    params={
        #        "id_user": id_user,
        #        "id_course": id_course
        #        }
        #    )
        #if response.status_code != 200:
        #    return Response(
        #        {"error": "Failed to delete course from quiz"},
        #        status=status.HTTP_400_BAD_REQUEST
        #    )


        # Envoi de ces informations à Decks pour obtenir la liste des id des cartes concernées ([privé] et supprimer ces lignes de la BDD) ; 
        response = requests.get(
            DECKS_BASE_URL + "/deleteCourse", 
            params={
                "id_user": id_user,
                "id_course": id_course
                }
            )
        if response.status_code != 200:
            return Response(
                response.json(),
                status=status.HTTP_400_BAD_REQUEST
            )

        # Envoi de cette liste d'id à Planification
        # Planification
        #
        #response = requests.get(
        #    PLANNING_BASE_URL + "/deleteCourse", 
        #    params={
        #        "id_user": id_user,
        #        "id_course_list": id_course_list
        #        }
        #    )
        #if response.status_code != 200:
        #    return Response(
        #        response.json(),
        #        status=status.HTTP_400_BAD_REQUEST
        #    )

        return Response(
            response.json(),
            status=response.status_code
        )
    
# design-services.md : Suppression cours

class DeleteCourse(APIView):
    """
    GET /DeleteCourse
    Takes: user_id, id_chapitre, id_deck
    Returns: success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(COURS_BASE_URL + "/deleteCourse", params={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to delete course.", "details": response.json()},
                status=response.status_code
            )
        return Response(
            {"message": "Course deleted successfully."},
            status=status.HTTP_200_OK
        )
    

# design-services.md : Quiz de validation 

class CompleteQuiz(APIView):
    """
    GET /completeQuiz
    Takes user_id, id_chapitre, id_deck
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(QUIZ_BASE_URL + "/completeQuiz", params={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to complete quiz.", "details": response.json()},
                status=response.status_code
            )
        return Response(
            {"message": "Quiz completed successfully."},
            status=status.HTTP_200_OK
        )

class DoesQuizExist(APIView):
    """
    GET /api/Quiz/doesQuizExist
    Takes user_id, id_chapitre, id_deck
    Returns bool
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(QUIZ_BASE_URL + "/doesQuizExist", params={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to complete quiz.", "details": response.json()},
                status=response.status_code
            )
        return Response(
            response.json(),
            status=status.HTTP_200_OK
        )

    
class UploadPDF(APIView):
    """
    POST /api/ajout-cours/
    All fields of metadata and metadata itself are optional 
    takes: pdf,
           metadata={                                   
                    "course_name":"name",
                    "chapters": [
                        ["name_chapter1", length1],
                        ["name_chapter1", length2], ...
                        ],
                    "author_id":ObjectId('id'),         #remplacer id par un id valide ex: 68386a41ac5083de66afd675
                    "name_author":"name_author"
                    "id_deck":ObjectId('id')
                    "matiere":"Informatique"
                    "public":false                      #or true
                    }

    return: success message
    """
    parser_classes = [MultiPartParser]
    def get(self, request):
        return Response({'message': 'Use POST to upload a file.'})

    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf')
        metadata = request.data.get('metadata')

        if not pdf_file:
            return Response({"error": "Missing PDF"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not metadata:
            metadata_json={}
        else:
            try:
                metadata_json = json.loads(metadata)
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON in metadata"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            "http://localhost:8000/api/cours/ajout-cours", 
            files={'pdf': pdf_file,}, 
            data={'metadata': json.dumps(metadata_json)}
        )
    
        if response.status_code == 200:
            return Response(
                {"message": "Success UploadPDF"},
                status=status.HTTP_200_OK
            )

        else:
            return Response(
            {"error": "Failed to UploadPDF"},
            status=status.HTTP_400_BAD_REQUEST
            )           

       
class ShowAllSharedCourses(APIView):
    """
    GET /showAllSharedCourses
    Takes: nothing
    Returns: List of public shared courses
    """
    def get(self, request):
        response = requests.get(COURS_BASE_URL + "/showAllSharedCourses")
        if response.status_code == 200:
            return Response(
                response.json(),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                response.json(),
                status=status.HTTP_400_BAD_REQUEST
        )

class AddToSubscribers(APIView):
    """
    GET /addToSubscribers
    Takes: id_user, course_name, author_id
    Returns: nothing
    """
    def get(self, request):
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        course_name = request.GET.get('course_name')
        if not course_name:
            return Response({"error": "course_name parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        author_id = request.GET.get('author_id')
        if not author_id:
            return Response({"error": "author_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)           

        response = requests.get(COURS_BASE_URL + "/addToSubscribers", params={
                "id_user": id_user,
                "course_name": course_name,
                "author_id": author_id
            })
        if response.status_code == 200:
            return Response(
                {"message": "Success AddToSubscribers"},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Failed AddToSubscribers"},
                status=status.HTTP_400_BAD_REQUEST
        )

class CardsReviewedToday(APIView):
    """
    GET /cardsReviewedToday
    Takes user_id
    Returns all cards reviewed today and their id_cours
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response = requests.get(PLANNING_BASE_URL + "/cardsReviewedToday", params={
                "user_id": user_id
            })
        if response.status_code == 200:
            return Response(
                response.json(),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                response.json(),
                status=status.HTTP_400_BAD_REQUEST
        )
        


# AUTHENTIFICATION ROUTES

class UserLogin(APIView):
    """
    POST /UserLogin
    Takes: username, password
    Returns: JSON response with user data or error message
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            AUTH_BASE_URL + "/login/",
            data={"username": username, "password": password}
        )

        return Response(response.json(), status=response.status_code)


class UserLogout(APIView):
    """
    POST /UserLogout
    Takes: refresh token
    Returns: success message or error message
    """
    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            AUTH_BASE_URL + "/logout/",
            data={"refresh": refresh_token}
        )

        return Response(response.json(), status=response.status_code)
    
class UserRegister(APIView):
    """
    POST /UserRegister
    Takes: username, password, email, avatar_url, preferences_json
    Returns: success message or error message
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        avatar_url = request.data.get('avatar_url', '')
        preferences_json = request.data.get('preferences_json', '{}')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            AUTH_BASE_URL + "/register/",
            data={
                "username": username,
                "password": password,
                "email": email,
                "avatar_url": avatar_url,
                "preferences_json": preferences_json
            }
        )

        return Response(response.json(), status=response.status_code)
    
class UserDelete(APIView):
    """
    POST /UserDeleteAccount
    Takes: user_id
    Returns: success message or error message
    """
    def post(self, request):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            AUTH_BASE_URL + "/deleteAccount/",
            data={"user_id": user_id}
        )

        return Response(response.json(), status=response.status_code)
    
class UserUpdateProfile(APIView):
    """
    POST /UserUpdateProfile
    Takes: user_id, username, email, avatar_url, preferences_json
    Returns: success message or error message
    """
    def post(self, request):
        user_id = request.data.get('user_id')
        username = request.data.get('username')
        email = request.data.get('email', '')
        avatar_url = request.data.get('avatar_url', '')
        preferences_json = request.data.get('preferences_json', '{}')

        if not user_id:
            return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = requests.post(
            AUTH_BASE_URL + "/update/",
            data={
                "user_id": user_id,
                "username": username,
                "email": email,
                "avatar_url": avatar_url,
                "preferences_json": preferences_json
            }
        )

        return Response(response.json(), status=response.status_code)