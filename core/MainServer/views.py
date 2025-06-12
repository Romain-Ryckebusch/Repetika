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
    """
    def post(self, request):
        """
        POST /update-session            (eventellement ajouter /api si on modif urls dans core)
        Takes: Takes: ID utilisateur + Liste résultats
        metadata={
                    "user_id":"name",
                    "results"= {
                        "id1": réponse1,
                        "id2": réponse2], ...
                        }
                }

        return: success message
        
        """

        metadata=request.data.get('metadata')
        if not metadata:
            return Response({"error": "Missing user_id or results"}, status=status.HTTP_400_BAD_REQUEST)
        
        metadata_json = json.loads(metadata)
        user_id=metadata_json['user_id']
        results=metadata_json['results']

        response = requests.post(
            "http://localhost:8000/api/learning_session/send-planification/",
            json={
                "metadata": {
                    "user_id": user_id,
                    "results": results
                }
            }
        )
        
        if response.status_code == 200:
            print("Success SendPlanification")
            #status=status.HTTP_200_OK
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

        response = requests.get(DECKS_BASE_URL + "/completeQuiz", params={
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



    
class UploadPDF(APIView):
    """
    POST /api/ajout-cours/
    takes: pdf,
           metadata={
                    "course_name":"name",
                    "chapters": [
                        ["name_chapter1", length1],
                        ["name_chapter1", length2], ...
                        ]
                    }

    return: success message
    """
    parser_classes = [MultiPartParser]
    def get(self, request):
        return Response({'message': 'Use POST to upload a file.'})

    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf')
        metadata = request.data.get('metadata')

        if not pdf_file or not metadata:
            return Response({"error": "Missing PDF or metadata"}, status=status.HTTP_400_BAD_REQUEST)
        
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
                {"message": "Success SendPlanification"},
                status=status.HTTP_200_OK
            )

        else:
            return Response(
            {"error": "Failed to UploadPDF"},
            status=status.HTTP_400_BAD_REQUEST
            )           
        
