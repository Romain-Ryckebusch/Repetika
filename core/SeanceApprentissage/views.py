import json
import requests

from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework import status



class GetCartes(APIView):
    """
    Revision deck [1] Appel à Decks pour obtenir la liste des cartes correspondant aux critères (deck et chapitres ciblés si applicable); Appel à Planification à
    partir de la liste des ID des cartes concernées pour ne garder que celles à apprendre aujourd'hui ; Envoi de cette liste de cartes à Main ;
    """
    def get(self, request):
        """
        Takes: ID utilisateur + Nom Deck [+ chapitres] 
        return: Liste cartes
        
        """
        #list_id=from planning
        user_id = request.GET.get('user_id')
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
        










        #list_cartes=from decks














        return Response({'message': 'Use POST to upload a file.'})



class SendPlanification(APIView):
    """
    Revision deck [2] Réception des résultats de la révision de main (couples {id: réponse}) ; Envoi de ces résultats à Planification
    """
    def post(self, request):
        """
        Takes: ID utilisateur + Liste résultats
        metadata={
                    "user_id":"name",
                    "results"= {
                        "id1": réponse1,
                        "id2": réponse2], ...
                        }
                }
        return: nothing
        
        """
        metadata=request.data.get('metadata')
        if not metadata:
            return Response({"error": "Missing user_id or results"}, status=status.HTTP_400_BAD_REQUEST)
        
        metadata_json = json.loads(metadata)
        user_id=metadata_json['user_id']
        results=metadata_json['results']

        response = requests.get(
            #"http://planification:8000/api/Planning/scheduleNextReviews/",
            "http://localhost:8000/api/planning/scheduleNextReviews/",
            params={
                "user_id": user_id,
                "results": json.dumps(results)
            }
)
        
        if response.status_code == 200:
            return Response({"message": "Ok"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Erreur dans: api/Planning/scheduleNextReviews/"}, status=status.HTTP_400_BAD_REQUEST)