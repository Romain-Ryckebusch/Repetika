import json
import requests

from django.http import HttpResponse, JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView


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

        response = requests.post(
            "http://planification:8000/api/sauvegarder-revision/",  #à modifier quand planification sera fini
            json={"user_id": user_id, "results": results})
        
        if response.status_code == 200:
            print("Success SendPlanification")