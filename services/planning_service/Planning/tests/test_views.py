import json
from datetime import datetime
from unittest.mock import patch, MagicMock

from bson import ObjectId
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.test import APITestCase


FIRST_PLAN_CHAPTER_URL = "/api/planning/firstPlanChapter"
SCHEDULE_NEXT_REVIEWS_URL = "/api/planning/scheduleNextReviews"
CARDS_TODAY_URL = "/api/planning/cardsToday"
CARDS_REVIEWED_TODAY_URL = "/api/planning/cardsReviewedToday"
UNSCHEDULE_CARDS_URL = "/api/planning/unScheduleCards"


class FirstPlanChapterTests(APITestCase):
    def test_missing_params_returns_400(self):
        response = self.client.get(FIRST_PLAN_CHAPTER_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_adds_all_cards_to_planning(self):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        cards_from_decks = [
            {"_id": str(ObjectId())},
            {"_id": str(ObjectId())},
        ]

        # Mock decks GET
        decks_resp = MagicMock(status_code=200)
        decks_resp.json.return_value = cards_from_decks

        with patch("Planning.views.requests.get", return_value=decks_resp) as mock_get, \
             patch("Planning.views.insert_document") as mock_insert, \
             patch("Planning.views.Scheduler") as mock_scheduler_cls, \
             patch("Planning.views.Card") as mock_card_cls:

            card_mock = MagicMock()
            card_mock.due = make_aware(datetime.now())
            card_mock.difficulty = 0.5
            card_mock.stability = 3.0
            mock_card_cls.return_value = card_mock

            scheduler_mock = MagicMock()
            scheduler_mock.review_card.return_value = (card_mock, MagicMock())
            mock_scheduler_cls.return_value = scheduler_mock

            response = self.client.get(
                FIRST_PLAN_CHAPTER_URL,
                {
                    "user_id": user_id,
                    "id_chapitre": id_chapitre,
                    "id_deck": id_deck,
                },
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "All cards added to the planning successfully.")
        self.assertEqual(mock_insert.call_count, len(cards_from_decks))
        mock_get.assert_called_once()


class ScheduleNextReviewsTests(APITestCase):
    def test_missing_params_returns_400(self):
        response = self.client.get(SCHEDULE_NEXT_REVIEWS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_json_returns_400(self):
        user_id = str(ObjectId())
        response = self.client.get(
            SCHEDULE_NEXT_REVIEWS_URL,
            {"user_id": user_id, "results": "not-json"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_only_incomplete_results_returns_400(self):
        user_id = str(ObjectId())
        # 1 = "incomplete" => filtered out
        results = {str(ObjectId()): 1}
        response = self.client.get(
            SCHEDULE_NEXT_REVIEWS_URL,
            {"user_id": user_id, "results": json.dumps(results)},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_schedules_and_updates(self):
        user_id = str(ObjectId())
        card_correct = str(ObjectId())
        card_incorrect = str(ObjectId())
        card_incomplete = str(ObjectId())

        # 0 = incorrect, 2 = correct, 1 = incomplete (filtered out)
        results = {
            card_incorrect: 0,
            card_correct: 2,
            card_incomplete: 1,
        }

        with patch("Planning.views.insert_document") as mock_insert, \
             patch("Planning.views.update_document") as mock_update, \
             patch("Planning.views.ScheduleNextReviews.scheduleCard") as mock_schedule_card:

            card_mock = MagicMock()
            card_mock.due = make_aware(datetime.now())
            card_mock.difficulty = 0.5
            card_mock.stability = 3.0
            mock_schedule_card.return_value = card_mock

            response = self.client.get(
                SCHEDULE_NEXT_REVIEWS_URL,
                {"user_id": user_id, "results": json.dumps(results)},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # incomplete result should be filtered out
        self.assertEqual(mock_insert.call_count, 2)
        self.assertEqual(mock_update.call_count, 2)
        self.assertEqual(mock_schedule_card.call_count, 2)


class CardsTodayTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(CARDS_TODAY_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_returns_planned_cards(self):
        user_id = str(ObjectId())
        cards = [
            {
                "id_card": str(ObjectId()),
                "date_planned": make_aware(datetime(2024, 1, 1)),
                "id_chapitre": str(ObjectId()),
            }
        ]

        with patch("Planning.views.find_documents_fields", return_value=cards) as mock_find:
            response = self.client.get(CARDS_TODAY_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, cards)
        mock_find.assert_called_once()


class CardsReviewedTodayTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(CARDS_REVIEWED_TODAY_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_returns_cards_with_course_ids(self):
        user_id = str(ObjectId())
        card_id = str(ObjectId())
        chap_id = str(ObjectId())
        course_id = str(ObjectId())

        history_docs = [
            {"id_card": card_id},
        ]

        with patch("Planning.views.find_documents_fields", return_value=history_docs) as mock_find, \
             patch("Planning.views.requests.get") as mock_requests_get:

            # First call to decks/getCardsFromID
            decks_resp = MagicMock(status_code=200)
            decks_resp.json.return_value = [
                {"_id": card_id, "id_chapitre": chap_id},
            ]
            # Second call to cours/getCourseIDFromChapterID
            cours_resp = MagicMock(status_code=200)
            cours_resp.json.return_value = {chap_id: course_id}

            mock_requests_get.side_effect = [decks_resp, cours_resp]

            response = self.client.get(
                CARDS_REVIEWED_TODAY_URL,
                {"user_id": user_id},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            [{"_id": card_id, "id_cours": course_id}],
        )
        self.assertEqual(mock_requests_get.call_count, 2)
        mock_find.assert_called_once()


class UnScheduleCardsTests(APITestCase):
    def test_missing_params_returns_400(self):
        response = self.client.get(UNSCHEDULE_CARDS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_json_returns_400(self):
        user_id = str(ObjectId())
        response = self.client.get(
            UNSCHEDULE_CARDS_URL,
            {"user_id": user_id, "card_ids": "not-json"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_deletes_from_planning_and_history(self):
        user_id = str(ObjectId())
        card_ids = [str(ObjectId()), str(ObjectId())]

        with patch("Planning.views.delete_document") as mock_delete:
            response = self.client.get(
                UNSCHEDULE_CARDS_URL,
                {"user_id": user_id, "card_ids": json.dumps(card_ids)},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Cards un-scheduled successfully.")
        # Called once per card for Planning, once per card for History => 2 * len(card_ids)
        self.assertEqual(mock_delete.call_count, 2 * len(card_ids))

