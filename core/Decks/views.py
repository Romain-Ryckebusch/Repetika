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

from PyPDF2 import PdfMerger
from PyPDF2 import PdfReader, PdfWriter

#from .models import UploadedFile
#from .serializers import UploadedFileSerializer

from bson import ObjectId

class GetCardsChapter(APIView):
    """
    GET /api/Decks/getCardsChapter
    Takes user_id, id_chapitre, id_deck
    Returns list all cards in the chapter
    """
    def get(self, request):
        user_id = request.GET.get('user_id') # TODO : Check whether to use this data, we could do the confirmation check before in another function (to see whether the user can indeed see the cards in that deck)
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
    Get /api/Decks/getCardsFromID
    Takes List of card IDs
    Returns list of cards with the given IDs
    """
    def get(self, request):
        card_ids = request.GET.getlist('card_ids')
        if not card_ids:
            return Response(
                {"error": "card_ids parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        print("card ids : ",card_ids)
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
    