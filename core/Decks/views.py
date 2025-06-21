import json
import requests
import os
from core.settings import *
from bson import ObjectId
from datetime import datetime

from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.utils.timezone import make_aware

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.shared_modules.mongodb_utils import *

from bson import ObjectId

class GetCardsChapter(APIView):
    """
    GET /api/decks/getCardsChapter
    Takes user_id, id_chapitre, id_deck
    Returns list all cards in the chapter
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre, and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find all cards in the chapter for the given deck
        cards = find_documents_all(
            "DB_Decks",
            "Cards",
            query={
                "id_chapitre": ObjectId(id_chapitre),
                "id_deck": ObjectId(id_deck)
            }
        )

        return Response(
            cards,
            status=status.HTTP_200_OK
        )
    

class GetCardsFromID(APIView):
    """
    Get /api/decks/getCardsFromID
    Takes card_ids one or multiple times in the request
    Returns list of cards with the given IDs
    """
    def get(self, request):
        card_ids = request.GET.getlist('card_ids')
        if not card_ids:
            return Response(
                {"error": "card_ids parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        #print("card ids : ",card_ids)
        # Convert card_ids to ObjectId
        card_ids = [ObjectId(card_id) for card_id in card_ids]
        # Find all cards with the given IDs
        cards = find_documents_all(
            "DB_Decks",
            "Cards",
            query={"_id": {"$in": card_ids}}
        )
        return Response(
            cards,
            status=status.HTTP_200_OK
        )

class GetDeckNames(APIView):
    """
    GET /api/decks/GetDeckNames
    Takes: user_id
    Returns: List(deck_name)
    """
    def get(self, request):
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ObjectId(id_user)
        except Exception as e:
            return Response({"error": "id_user is not a valid ObjectId"}, status=status.HTTP_400_BAD_REQUEST)
        
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
    GET /api/decks/addCards
    Takes: List(card)
    Returns: nothing
    """
    def post(self, request):
        cartes = request.data.get('cartes', [])  
        # Cards have been validated in Main call, so we assume they are valid

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
    
class DeleteCards(APIView):
    """
    GET /api/decks/deleteCards
    Takes: user_id, list(card_id)
    Returns: validation message
    """
    def get(self, request):
        id_user = request.GET.get('user_id')
        card_ids_json = request.GET.get('card_ids')

        if not card_ids_json or not id_user:
            return Response(
                {"error": "user_id and card_ids parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            print(f"DeleteCards received parameters: user_id={id_user}, card_ids={card_ids_json}")
            card_ids = json.loads(card_ids_json)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format for card_ids."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete each card from the database
        for card_id in card_ids:
            delete_document(
                "DB_Decks",
                "Cards",
                query={"_id": ObjectId(card_id)}
            )

        # Remove cards from planning through API
        response = requests.get(
            f"{PLANNING_BASE_URL}/unScheduleCards",
            params={
                'user_id': id_user,
                'card_ids': json.dumps(card_ids)
            }
        )
        if response.status_code != 200:
            return Response(
                {"error": "Failed to unschedule cards.", 
                 "details": response},
                status=response.status_code
            ) 

        return Response(
            {"message": "Cards deleted successfully."},
            status=status.HTTP_200_OK
        )
    
class DeleteCardsChapter(APIView):
    """
    GET /api/decks/deleteCardsChapter
    Takes: user_id, id_chapitre
    Returns: validation message
    """
    def get(self, request):
        id_user = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')

        if not id_user or not id_chapitre:
            return Response(
                {"error": "user_id and id_chapitre parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find all card IDs in the chapter
        card_ids = find_documents_fields(
            "DB_Decks",
            "Cards",
            query={"id_chapitre": ObjectId(id_chapitre)},
            fields=["_id"]
        )

        # Delete all cards in the chapter through deleteCards
        response = requests.get(
            f"{DECKS_BASE_URL}/deleteCards",
            params={
                'user_id': id_user,
                'card_ids': json.dumps([str(card['_id']) for card in card_ids])
            }
        )
        if response.status_code != 200:
            return Response(
                {"error": "Failed to delete cards associated with the chapter.", 
                 "details": response},
                status=response.status_code
            )
        
        return Response(
            {"message": "Cards in chapter deleted successfully."},
            status=status.HTTP_200_OK
        )
    
class DeleteDeck(APIView):
    """
    GET /api/decks/deleteDeck
    Takes: user_id, id_deck
    Returns: validation message
    """
    def get(self, request):
        id_user = request.GET.get('user_id')
        id_deck = request.GET.get('id_deck')

        if not id_user or not id_deck:
            return Response(
                {"error": "user_id and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        card_ids = find_documents_fields(
            "DB_Decks",
            "Cards",
            query={"id_deck": ObjectId(id_deck)},
            fields=["_id"]
        )

        # Delete the deck from the database
        delete_document(
            "DB_Decks",
            "Decks",
            query={"_id": ObjectId(id_deck), "id_user": ObjectId(id_user)}
        )
        print(f"Deck with ID {id_deck} deleted for user {id_user}")

        # Remove all cards individually through deleteCards
        response = requests.get(
            f"{DECKS_BASE_URL}/deleteCards",
            params={
                'user_id': id_user,
                'card_ids': json.dumps([str(card['_id']) for card in card_ids])
            }
        )
        if response.status_code != 200:
            return Response(
                {"error": "Failed to delete cards associated with the deck.", 
                 "details": response},
                status=response.status_code
            )

        return Response(
            {"message": "Deck deleted successfully."},
            status=status.HTTP_200_OK
        )
    
class CreateDeck(APIView):
    """
    GET /api/decks/createDeck
    Takes: user_id, nom_deck, tags
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

        today = make_aware(datetime.now())
        document = {
                    "id_user": id_user,
                    "nom_deck": nom_deck,
                    "tags": tags,
                    "date_creation":today
                    }
        id_deck=insert_document("DB_Decks", "Decks", document)

        return Response({"id_deck": str(id_deck)}, status=status.HTTP_200_OK)
        

