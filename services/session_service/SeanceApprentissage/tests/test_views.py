import json
from unittest.mock import patch, MagicMock

from bson import ObjectId
from rest_framework import status
from rest_framework.test import APITestCase


GET_CARTES_URL = "/api/learning-session/get-cartes/"
SEND_PLANIFICATION_URL = "/api/learning-session/send-planification/"


class GetCartesTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(GET_CARTES_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("SeanceApprentissage.views.requests.get")
    def test_planning_service_failure_returns_500(self, mock_requests_get):
        user_id = str(ObjectId())

        planning_resp = MagicMock(status_code=500)
        mock_requests_get.return_value = planning_resp

        response = self.client.get(GET_CARTES_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        self.assertTrue(called_url.endswith("/planning/cardsToday"))

    @patch("SeanceApprentissage.views.requests.get")
    def test_no_cards_today_returns_empty_list(self, mock_requests_get):
        user_id = str(ObjectId())

        planning_resp = MagicMock(status_code=200)
        planning_resp.json.return_value = []
        mock_requests_get.return_value = planning_resp

        response = self.client.get(
            GET_CARTES_URL,
            {"user_id": user_id, "deck_id": "anydeck"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        mock_requests_get.assert_called_once()

    @patch("SeanceApprentissage.views.requests.get")
    def test_decks_service_failure_returns_500(self, mock_requests_get):
        user_id = str(ObjectId())
        deck_id = "deck1"

        cards_today = [{"id_card": str(ObjectId())}]

        planning_resp = MagicMock(status_code=200)
        planning_resp.json.return_value = cards_today

        decks_resp = MagicMock(status_code=500)

        mock_requests_get.side_effect = [planning_resp, decks_resp]

        response = self.client.get(
            GET_CARTES_URL,
            {"user_id": user_id, "deck_id": deck_id},
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)
        self.assertEqual(mock_requests_get.call_count, 2)

    @patch("SeanceApprentissage.views.requests.get")
    def test_success_filters_cards_by_deck_id(self, mock_requests_get):
        user_id = str(ObjectId())
        deck_id = "deck1"

        card_id_1 = str(ObjectId())
        card_id_2 = str(ObjectId())

        planning_resp = MagicMock(status_code=200)
        planning_resp.json.return_value = [
            {"id_card": card_id_1},
            {"id_card": card_id_2},
        ]

        decks_resp = MagicMock(status_code=200)
        decks_resp.json.return_value = [
            {"id_card": card_id_1, "id_deck": deck_id, "front": "Q1"},
            {"id_card": card_id_2, "id_deck": "other", "front": "Q2"},
        ]

        mock_requests_get.side_effect = [planning_resp, decks_resp]

        response = self.client.get(
            GET_CARTES_URL,
            {"user_id": user_id, "deck_id": deck_id},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            [
                {"id_card": card_id_1, "id_deck": deck_id, "front": "Q1"},
            ],
        )

        self.assertEqual(mock_requests_get.call_count, 2)
        # Verify second call goes to decks/getCardsFromID with the correct ids
        decks_call = mock_requests_get.call_args_list[1]
        decks_url = decks_call[0][0]
        self.assertTrue(decks_url.endswith("/decks/getCardsFromID"))
        decks_params = decks_call[1]["params"]
        self.assertEqual(sorted(decks_params["card_ids"]), sorted([card_id_1, card_id_2]))


class SendPlanificationTests(APITestCase):
    def test_missing_metadata_returns_400(self):
        response = self.client.post(SEND_PLANIFICATION_URL, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("SeanceApprentissage.views.requests.get")
    @patch("SeanceApprentissage.views.find_documents_fields")
    @patch("SeanceApprentissage.views.insert_document")
    def test_success_stores_incomplete_and_calls_planning(
        self, mock_insert_document, mock_find_documents_fields, mock_requests_get
    ):
        user_id = str(ObjectId())
        results = {
            str(ObjectId()): 1,  # incomplete -> insert into IncompleteReviews
            str(ObjectId()): 0,  # correct-from-first-try -> check IncompleteReviews
            str(ObjectId()): 2,  # correct-after-errors
        }

        # For the card with result == 0, pretend there is no existing incomplete entry
        mock_find_documents_fields.return_value = []

        schedule_resp = MagicMock(status_code=200)
        mock_requests_get.return_value = schedule_resp

        metadata = {"user_id": user_id, "results": results}

        response = self.client.post(
            SEND_PLANIFICATION_URL,
            {"metadata": json.dumps(metadata)},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Ok")

        # One insert for the incomplete card
        mock_insert_document.assert_called_once()
        insert_args, insert_kwargs = mock_insert_document.call_args
        self.assertEqual(insert_args[0], "DB_Session")
        self.assertEqual(insert_args[1], "IncompleteReviews")
        inserted_doc = insert_args[2]
        self.assertIsInstance(inserted_doc["id_user"], ObjectId)
        self.assertEqual(str(inserted_doc["id_user"]), user_id)
        self.assertIsInstance(inserted_doc["id_card"], ObjectId)

        mock_find_documents_fields.assert_called_once()

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        self.assertTrue(called_url.endswith("/planning/scheduleNextReviews"))
        params = mock_requests_get.call_args[1]["params"]
        self.assertEqual(params["user_id"], user_id)
        # Ensure we send back the same results mapping
        self.assertEqual(json.loads(params["results"]), results)

    @patch("SeanceApprentissage.views.requests.get")
    @patch("SeanceApprentissage.views.insert_document")
    @patch("SeanceApprentissage.views.find_documents_fields")
    def test_planning_error_returns_400(
        self, mock_find_documents_fields, mock_insert_document, mock_requests_get
    ):
        user_id = str(ObjectId())
        results = {str(ObjectId()): 1}

        mock_find_documents_fields.return_value = []
        schedule_resp = MagicMock(status_code=500)
        mock_requests_get.return_value = schedule_resp

        metadata = {"user_id": user_id, "results": results}

        response = self.client.post(
            SEND_PLANIFICATION_URL,
            {"metadata": json.dumps(metadata)},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        mock_requests_get.assert_called_once()

