import requests
from core.settings import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.shared_modules.mongodb_utils import *

from bson import ObjectId


class GetDeckNames(APIView):
    """
    GET /api/CreerCartes/GetDeckNames
    Takes: user_id
    Returns: List(deck_name)
    """
    def get(self, request):
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            find_documents_fields( 
                collection_name="Decks",
                database_name="DB_Decks",
                query={"id_user": ObjectId(id_user)},
                fields=["nom_deck"],
            ),
            status=status.HTTP_200_OK)
    

class addCards(APIView):
    """
    GET /api/CreerCartes/addCards
    Takes: List(card)
    Returns: nothing
    """
    def post(self, request):
        cartes = request.data.get('cartes', [])  # On attend une liste de cartes dans le body
        if not cartes:
            return Response({"error": "Aucune carte à enregistrer"}, status=status.HTTP_400_BAD_REQUEST) 

        # Check if all parameters are provided
        required_fields = ['id_deck', 'id_chapitre', 'front', 'back']
        for carte in cartes:
            if not all(field in carte for field in required_fields):
                return Response({"error": f"Carte {carte} is missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        for carte in cartes:
            carte['id_deck'] = ObjectId(carte['id_deck'])
            carte['id_chapitre'] = ObjectId(carte['id_chapitre'])
        
            # Insert the card into the database
            insert_document(
                collection_name="Cards",
                database_name="DB_Decks",
                document=carte
            )
        
        return Response(status=status.HTTP_200_OK)