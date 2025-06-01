import json
import requests
import os

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

class GetLockedChapters(APIView):
    """
    GET /api/Quiz/getLockedChapters
    Takes user_id
    Returns List of locked chapters id
    """
    def get(self, request):
        # Quiz call to find out the number of unblocked chapters for each course; 
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        chapter_dict = find_documents_fields(
            "DB_Quiz",
            "Quiz",
            query={"id_user": ObjectId(user_id)},
            fields=["id_chapitre"]
        ) # Get all the id of chapters whose quiz has not yet been completed by the user
        # Convert the dict to a list
        chapter_list = []
        for chapter in chapter_dict:
            chapter_list.append(chapter["id_chapitre"])

        return Response(
            chapter_list,
            status=status.HTTP_200_OK
        )
