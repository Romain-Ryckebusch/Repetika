import json
import requests

from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from bson import ObjectId

from core.shared_modules.mongodb_utils import *



class GetCartes(APIView):
    """
    GET /api/learning_session/get-cartes
    Takes: ID utilisateur(user_id) + Nom Deck (deck_id)
    return: Liste cartes du deck à réviser aujourd'hui
    """

    def get(self, request):
        #on appelle planing pour obtenir la liste des cartes à réviser aujourd'hui
        user_id = request.GET.get('user_id')
        deck_id = request.GET.get('deck_id')

        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(
            #"http://planification:8000/api/sauvegarder-revision/",  #à modifier avec docker
            "http://localhost:8000/api/planning/cardsToday",
            
            params={"user_id": user_id})
        
        if response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve cards from planning."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        """
        return Response(
                {"error": "test"},
                status=status.HTTP_400_BAD_REQUEST
            )"""
        print(response)
        #results_json = request.GET.get('results')
        cardsID_json = response.json()
        


        #on appelle deck pour obtenir la liste des cartes à partir de la liste des id des cartes
        if cardsID_json==[]:
            return Response(
                cardsID_json,
                status=status.HTTP_200_OK
        )
            #pour tester: commenter le return et décomenter la ligne suivante:
            cardsID_json = [ObjectId("683b84c948bed3e43b775ca5")]
            #cardsID_json = ["683b84c948bed3e43b775ca5"]


        
        response2 = requests.get(
            "http://localhost:8000/api/decks/getCardsFromID",
            params={"card_ids": [card["id_card"] for card in cardsID_json]}
        )
        

        
        if response2.status_code != 200:
            return Response(
                {"error": "Failed to retrieve cards from decks."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        cards= response2.json()

        #on filtre par deck, à supprimer si on veux toutes les cartes à reviser
        filtred_cards=[]
        for card in cards:
            if card["id_deck"] == deck_id:
                filtred_cards.append(card)

        return Response(
            filtred_cards,
            status=status.HTTP_200_OK
        )



class SendPlanification(APIView):
    """
    Revision deck [2] Réception des résultats de la révision de main (couples {id: réponse}) ; Envoi de ces résultats à Planification
    """
    def post(self, request):
        """
        POST /api/learning_session/send-planification/
        Takes: ID utilisateur + Liste résultats
        metadata={
                    "user_id":"name",
                    "results"= {
                        "id1": réponse1,
                        "id2": réponse2, ...
                        }
                }
        return: nothing
        
        """
        metadata=request.data.get('metadata')
        if not metadata:
            return Response({"error": "Missing metadata"}, status=status.HTTP_400_BAD_REQUEST)
        
        metadata_json = json.loads(metadata)
        user_id=metadata_json['user_id']
        results=metadata_json['results']
        


        cards_to_schedule={}
        for id_card, result in results.items():
            #result vaut 0 si bon du premier coup, 1 si faux d'abord et pas encore bon au moment de sauvegarder les résultats, et 2 si bon après une ou plusieurs erreurs
            if result==1:#on enregistre dans "IncompleteReviews" pour une prochaine session
                document = {
                "id_user": ObjectId(user_id),
                "id_card": ObjectId(id_card),
                }
                insert_document("DB_Session", "IncompleteReviews", document)


            if result==0:#on verifie si la carte est déjà dans "IncompleteReviews" 
                carte = find_documents_fields(
                    "DB_Session",
                    "IncompleteReviews",
                    query={
                        "id_user": ObjectId(user_id),
                        "id_card": ObjectId(id_card)
                    },
                    fields=["id_card"]
                )
                if carte:
                    cards_to_schedule["id_card"]=2
                else:
                    cards_to_schedule["id_card"]=0
            if result==2:
                cards_to_schedule["id_card"]=2


        response = requests.get(
            #"http://planification:8000/api/Planning/scheduleNextReviews/",
            "http://localhost:8000/api/planning/scheduleNextReviews",
            params={
                "user_id": user_id,
                "results": json.dumps(results)
            }
        )
        

        
        if response.status_code == 200:
            return Response({"message": "Ok"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Erreur dans: api/Planning/scheduleNextReviews/"}, status=status.HTTP_400_BAD_REQUEST)
