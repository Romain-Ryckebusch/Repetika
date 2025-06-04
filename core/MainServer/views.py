

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
            "http://localhost:8000/api/learning_session/get-cartes/",
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
from PyPDF2 import PdfMerger
from PyPDF2 import PdfReader, PdfWriter

#from .models import UploadedFile
#from .serializers import UploadedFileSerializer

from bson import ObjectId

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

        return Response(
            response.json(),
            status=response.status_code
        )
    
#