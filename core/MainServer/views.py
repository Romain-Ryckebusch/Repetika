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