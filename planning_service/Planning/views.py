import json
import requests
import os
from datetime import datetime
from core.settings import *

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

from bson import ObjectId



class FirstPlanChapter(APIView):
    """
    GET /api/Planning/firstPlanChapter
    Takes user_id, id_chapitre, id_deck
    Adds all the cards of the chapter to the planning
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        id_chapitre = request.GET.get('id_chapitre')
        id_deck = request.GET.get('id_deck')
        print(f"FirstPlanChapter received parameters: user_id={user_id}, id_chapitre={id_chapitre}, id_deck={id_deck}")

        if not user_id or not id_chapitre or not id_deck:
            return Response(
                {"error": "user_id, id_chapitre and id_deck parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Find all cards in the chapter for the given deck
        response = requests.get(f"{DECKS_BASE_URL}/getCardsChapter", params={"id_chapitre": id_chapitre, "id_deck": id_deck, "user_id": user_id})
        if response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve cards from the chapter."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        cards = response.json()
        cards_id = [str(card["_id"]) for card in cards]  # Extract IDs from the cards obtained
        
        if not cards:
            return Response(
                {"error": "No cards found for the specified chapter."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Add each card to the planning
        scheduler = Scheduler(
            learning_steps=(),
            relearning_steps=(),
        )
        scheduled_card = Card()
        scheduled_card, review_log = scheduler.review_card(scheduled_card, Rating.Good)
        scheduled_card.due = make_aware(datetime.now())


        for card_id in cards_id:
            document = {
                "id_user": ObjectId(user_id),
                "id_card": ObjectId(card_id),
                "date_planned": scheduled_card.due,
                "difficulty": scheduled_card.difficulty,
                "stability": scheduled_card.stability,
            }
            insert_document("DB_Planning", "Planning", document)

        return Response(
            {"message": "All cards added to the planning successfully."},
            status=status.HTTP_200_OK
        )
    

class ScheduleNextReviews(APIView):
    """
    GET /api/Planning/scheduleNextReviews
    Takes user_id, list JSON {id_card : result}
    Schedules the next review for each card based on the result
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        results_json = request.GET.get('results')
        RESULT_INCORRECT = 0
        RESULT_INCOMPLETE = 1
        RESULT_CORRECT = 2

        if not user_id or not results_json:
            return Response(
                {"error": "user_id and results parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            results = json.loads(results_json)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format for results."},
                status=status.HTTP_400_BAD_REQUEST
            )

        print(f"ScheduleNextReviews received parameters: user_id={user_id}, results={results}")
        
        
        results = {k: v for k, v in results.items() if v in [RESULT_INCORRECT, RESULT_CORRECT]} # Remove "incomplete" results since we wait for a definite result before storing and using them
        if not results:
            return Response(
                {"error": "No valid results provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        # Add these cards to the history
        for id_card, result in results.items():
            document = {
                "id_user": ObjectId(user_id),
                "id_card": ObjectId(id_card),
                "result": result,
                "date_reviewed": timezone.now(),  # Round down to the nearest day
            }
            insert_document("DB_Planning", "History", document)

        # Schedule next reviews for each card
        for id_card, result in results.items():
            card = Card(card_id = id_card)
            rating = Rating.Good if result == RESULT_CORRECT else Rating.Again
            
            # Schedule the card
            try:
                card = self.scheduleCard(card, rating, user_id)
            except Exception as e:
                return Response(
                    {"error": f"Failed to schedule card {id_card}: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Update Planning to contain the new values (new due date, stability, and difficulty)
            update_document(
                "DB_Planning",
                "Planning",
                query={"id_user": ObjectId(user_id), "id_card": ObjectId(id_card)},
                update_values={"date_planned": card.due, "difficulty": card.difficulty, "stability":card.stability}
            )


        return Response(
            {"message": "Next reviews scheduled successfully."},
            status=status.HTTP_200_OK
        )
    
    def scheduleCard(self, card, rating, user_id):
        scheduler = Scheduler(
            learning_steps=(),
            relearning_steps=(),  # Learning and relearning phases are directly managed by the app
        )
        
        # Get last review from history
        last_review_history = find_documents_fields(
            "DB_Planning",
            "History",
            query={"id_user": ObjectId(user_id), "id_card": ObjectId(card.card_id)},
            fields=["date_reviewed", "result"],
            sort=[("date_reviewed", -1)],
        )
        last_review = make_aware(last_review_history[1]["date_reviewed"]) if len(last_review_history)>1 else None
        print("last review : ",last_review)

        # Get current planning data for this card
        planning_data = find_documents_fields(
            "DB_Planning",
            "Planning",
            query={"id_user": ObjectId(user_id), "id_card": ObjectId(card.card_id)},
            fields=["date_planned", "stability", "difficulty"],
        )[0]
        card = Card(
            stability = planning_data["stability"],
            difficulty = planning_data["difficulty"],
            due = make_aware(planning_data["date_planned"]),
            last_review = last_review
        ) # Create a card with all the current data     
        card, review_log = scheduler.review_card(card, rating) # Ask the scheduler to update the card, changing all its components           
        return card
    

class CardsToday(APIView):
    """
    GET /api/Planning/cardsToday
    Takes user_id
    Returns all cards planned for today or before
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        today = make_aware(datetime.now())#+timedelta(days=1)
        today = datetime.combine(today, datetime.max.time())  # date à 23:59:59
        
        cartes_a_reviser = find_documents_fields(
            "DB_Planning",
            "Planning",
            query={
                "id_user": ObjectId(user_id),
                "date_planned": {"$lte": today}
            },
            fields=["id_card", "date_planned", "id_chapitre"]
        )
        
        return Response(cartes_a_reviser, status=status.HTTP_200_OK)
    
class CardsReviewedToday(APIView):
    """
    GET /api/planning/cardsReviewedToday
    Takes user_id
    Returns all cards reviewed today and their id_cours
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        today = make_aware(datetime.now())
        today = datetime.combine(today, datetime.min.time())  # date à 00:00:00

        cards = find_documents_fields(
            "DB_Planning",
            "History",
            query={
                "id_user": ObjectId(user_id),
                "date_reviewed": {"$gte": today}
            },
            fields=["id_card"]
        )

        #on a les id des cartes et on cherche le chapitre associé à chaque carte
        response = requests.get(
            "http://localhost:8000/api/decks/getCardsFromID",
            params={"card_ids": [card["id_card"] for card in cards]}
        )
        
        if response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve cards from decks."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )     
        cards= response.json()

        #on a les id des cartes et des chapitres et on cherche le cours associé à chaque carte
        response2 = requests.get(
            "http://localhost:8000/api/cours/getCourseIDFromChapterID",
            params={"chapter_ids": [card["id_chapitre"] for card in cards]}
        )

        if response2.status_code != 200:
            return Response(
                {"error": "Failed to getCourseIDFromChapterID."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
        dictionnaire= response2.json()
        result=[]
        for card in cards:
            new_card={"_id":card["_id"]}
            new_card["id_cours"]=dictionnaire[card["id_chapitre"]]
            result.append(new_card)

        return Response(result, status=status.HTTP_200_OK)

class UnScheduleCards(APIView):
    """
    GET /api/Planning/unScheduleCards
    Takes user_id, list of card IDs
    Un-schedules the cards by removing their entries from the planning (planning and history tables in the database)
    Returns success message
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        card_ids_json = request.GET.get('card_ids')

        if not user_id or not card_ids_json:
            return Response(
                {"error": "user_id and card_ids parameters are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            card_ids = json.loads(card_ids_json)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON format for card_ids."},
                status=status.HTTP_400_BAD_REQUEST
            )

        print(f"UnScheduleCards received parameters: user_id={user_id}, card_ids={card_ids}")

        # Remove each card from the planning
        for card_id in card_ids:
            delete_document(
                "DB_Planning",
                "Planning",
                query={"id_user": ObjectId(user_id), "id_card": ObjectId(card_id)}
            )

        # Remove each card history
        for card_id in card_ids:
            delete_document(
                "DB_Planning",
                "History",
                query={"id_user": ObjectId(user_id), "id_card": ObjectId(card_id)}
            )

        return Response(
            {"message": "Cards un-scheduled successfully."},
            status=status.HTTP_200_OK
        )
