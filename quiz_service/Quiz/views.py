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
    

class CompleteQuiz(APIView):
    """
    GET /api/Quiz/completeQuiz
    Takes user_id, id_chapitre, id_deck
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id and id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove the completed quiz entry from the database
        query = {
            "id_user": ObjectId(user_id),
            "id_chapitre": ObjectId(id_chapitre),
            "id_deck": ObjectId(id_deck)
        }
        number_entries_deleted = delete_document(
            "DB_Quiz",
            "Quiz",
            query
        )

        response = requests.get(PLANNING_BASE_URL + "/firstPlanChapter", params={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to schedule cards for the chapter. Status code: " + str(response.status_code)+ " message : " + response.text},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            print(response.json())

        return Response(
            {"number_entries_deleted": number_entries_deleted},
            status=status.HTTP_200_OK
        )
    

class GetQuiz(APIView):
    """GET /api/Quiz/getQuiz
    Takes user_id, id_chapitre, id_deck
    Returns list of cards (quiz data)
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(DECKS_BASE_URL + "/getCardsChapter", params={
            "user_id": user_id,
            "id_chapitre": id_chapitre,
            "id_deck": id_deck
        })

        return Response(
            response.json(),
            status=status.HTTP_200_OK
        )
    
class RemoveQuiz(APIView):
    """
    GET /api/Quiz/removeQuiz
    Takes user_id, id_chapitre, id_deck
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        query = {
            "id_user": ObjectId(user_id),
            "id_chapitre": ObjectId(id_chapitre),
            "id_deck": ObjectId(id_deck)
        }
        number_entries_deleted = delete_document(
            "DB_Quiz",
            "Quiz",
            query
        )

        return Response(
            {"number_entries_deleted": number_entries_deleted},
            status=status.HTTP_200_OK
        )
    
class DoesQuizExist(APIView):
    """
    GET /api/Quiz/doesQuizExist
    Takes user_id, id_chapitre, id_deck
    Returns bool
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        query = {
            "id_user": ObjectId(user_id),
            "id_chapitre": ObjectId(id_chapitre),
            "id_deck": ObjectId(id_deck)
        }

        number_entries_deleted = len(find_documents_all(
            "DB_Quiz",
            "Quiz",
            query
        ))

        return Response(
            {"isQuizExisting": number_entries_deleted>0},
            status=status.HTTP_200_OK
        )