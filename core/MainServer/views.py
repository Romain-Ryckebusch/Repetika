"""
lancer une séance de révision : Séance d'apprentissage
ajouter des cartes à un deck : Decks ev Quiz



"""

import json
import requests
import os

from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.utils.timezone import make_aware

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
        Takes: ID utilisateur (user_id) + le deck (name_deck)

        return: Liste cartes
        
        """

        user_id = request.GET.get('user_id')
        name_deck = request.GET.get('name_deck')

        if not user_id or not name_deck:
            return Response(
                {"error": "user_id and name_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            results = json.loads(name_deck)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format for results."},
                status=status.HTTP_400_BAD_REQUEST
            )

        print(f"Received parameters: user_id={user_id}, results={results}")



        response = requests.get(
            #"http://planification:8000/api/sauvegarder-revision/",  #à modifier avec docker
            "http://localhost:8000/api/SéanceApprentisssage/get-cartes/",
            params={"user_id": user_id, "name_deck": results})
        
        if response.status_code == 200:
            return response
            #print("Success SendPlanification")
        else:
            return Response(
                {"error": "Failed to SendPlanification"},
                status=status.HTTP_400_BAD_REQUEST
            )

class updateSéanceRévision(APIView):
    """
    en prenant note pour chaque carte de si elle est répondue correctement ou non (en cas de réponse incorrecte, elle reste dans le roulement jusqu'à ce que la réponse soit correcte) puis envoie ces informations à "Planification" pour sauvegarder la progression et update les prochaines dates de révision de ces cartes
    """
    def post(self, request):
        """
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