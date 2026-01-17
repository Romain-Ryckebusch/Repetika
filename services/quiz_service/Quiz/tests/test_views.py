from unittest.mock import patch, MagicMock

from bson import ObjectId
from rest_framework import status
from rest_framework.test import APITestCase


GET_LOCKED_CHAPTERS_URL = "/api/quiz/getLockedChapters/"
COMPLETE_QUIZ_URL = "/api/quiz/completeQuiz/"
GET_QUIZ_URL = "/api/quiz/getQuiz/"
REMOVE_QUIZ_URL = "/api/quiz/removeQuiz/"
DOES_QUIZ_EXIST_URL = "/api/quiz/doesQuizExist/"


class GetLockedChaptersTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(GET_LOCKED_CHAPTERS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Quiz.views.find_documents_fields")
    def test_valid_user_returns_chapter_ids(self, mock_find_documents_fields):
        user_id = str(ObjectId())
        chapters = [
            {"id_chapitre": "chap1"},
            {"id_chapitre": "chap2"},
        ]
        mock_find_documents_fields.return_value = chapters

        response = self.client.get(GET_LOCKED_CHAPTERS_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ["chap1", "chap2"])

        mock_find_documents_fields.assert_called_once()
        args, kwargs = mock_find_documents_fields.call_args
        self.assertEqual(args[0], "DB_Quiz")
        self.assertEqual(args[1], "Quiz")
        query = kwargs["query"]
        self.assertIsInstance(query["id_user"], ObjectId)
        self.assertEqual(str(query["id_user"]), user_id)
        self.assertEqual(kwargs["fields"], ["id_chapitre"])


class CompleteQuizTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        user_id = str(ObjectId())
        # Only user_id provided, missing id_chapitre and id_deck
        response = self.client.get(COMPLETE_QUIZ_URL, {"user_id": user_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Quiz.views.requests.get")
    @patch("Quiz.views.delete_document")
    def test_planning_failure_returns_500(
        self, mock_delete_document, mock_requests_get
    ):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        mock_delete_document.return_value = 1
        mock_response = MagicMock(status_code=500, text="error")
        mock_requests_get.return_value = mock_response

        response = self.client.get(
            COMPLETE_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)
        mock_delete_document.assert_called_once()
        mock_requests_get.assert_called_once()

    @patch("Quiz.views.requests.get")
    @patch("Quiz.views.delete_document")
    def test_success_deletes_quiz_and_schedules_cards(
        self, mock_delete_document, mock_requests_get
    ):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        mock_delete_document.return_value = 2
        mock_response = MagicMock(status_code=200)
        mock_response.json.return_value = {"message": "scheduled"}
        mock_requests_get.return_value = mock_response

        response = self.client.get(
            COMPLETE_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["number_entries_deleted"], 2)

        mock_delete_document.assert_called_once()
        args, kwargs = mock_delete_document.call_args
        self.assertEqual(args[0], "DB_Quiz")
        self.assertEqual(args[1], "Quiz")
        query = args[2]
        self.assertEqual(str(query["id_user"]), user_id)
        self.assertEqual(str(query["id_chapitre"]), id_chapitre)
        self.assertEqual(str(query["id_deck"]), id_deck)

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        self.assertTrue(called_url.endswith("/firstPlanChapter"))
        called_params = mock_requests_get.call_args[1]["params"]
        self.assertEqual(called_params["user_id"], user_id)
        self.assertEqual(called_params["id_chapitre"], id_chapitre)
        self.assertEqual(called_params["id_deck"], id_deck)


class GetQuizTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        # No params
        response = self.client.get(GET_QUIZ_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

        # Only user_id
        response = self.client.get(GET_QUIZ_URL, {"user_id": str(ObjectId())})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Quiz.views.requests.get")
    def test_success_proxies_cards_from_decks_service(self, mock_requests_get):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        cards = [
            {"_id": "card1", "front": "Q1", "back": "A1"},
            {"_id": "card2", "front": "Q2", "back": "A2"},
        ]
        mock_response = MagicMock(status_code=200)
        mock_response.json.return_value = cards
        mock_requests_get.return_value = mock_response

        response = self.client.get(
            GET_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, cards)

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        self.assertTrue(called_url.endswith("/getCardsChapter"))
        called_params = mock_requests_get.call_args[1]["params"]
        self.assertEqual(called_params["user_id"], user_id)
        self.assertEqual(called_params["id_chapitre"], id_chapitre)
        self.assertEqual(called_params["id_deck"], id_deck)


class RemoveQuizTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(REMOVE_QUIZ_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Quiz.views.delete_document")
    def test_success_deletes_quiz_entries(self, mock_delete_document):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        mock_delete_document.return_value = 3

        response = self.client.get(
            REMOVE_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["number_entries_deleted"], 3)

        mock_delete_document.assert_called_once()
        args, kwargs = mock_delete_document.call_args
        self.assertEqual(args[0], "DB_Quiz")
        self.assertEqual(args[1], "Quiz")
        query = args[2]
        self.assertEqual(str(query["id_user"]), user_id)
        self.assertEqual(str(query["id_chapitre"]), id_chapitre)
        self.assertEqual(str(query["id_deck"]), id_deck)


class DoesQuizExistTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DOES_QUIZ_EXIST_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Quiz.views.find_documents_all")
    def test_returns_true_when_entries_exist(self, mock_find_documents_all):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        mock_find_documents_all.return_value = [
            {"_id": "entry1"},
        ]

        response = self.client.get(
            DOES_QUIZ_EXIST_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["isQuizExisting"], True)

        mock_find_documents_all.assert_called_once()
        args, kwargs = mock_find_documents_all.call_args
        self.assertEqual(args[0], "DB_Quiz")
        self.assertEqual(args[1], "Quiz")
        query = args[2]
        self.assertEqual(str(query["id_user"]), user_id)
        self.assertEqual(str(query["id_chapitre"]), id_chapitre)
        self.assertEqual(str(query["id_deck"]), id_deck)

    @patch("Quiz.views.find_documents_all")
    def test_returns_false_when_no_entries(self, mock_find_documents_all):
        user_id = str(ObjectId())
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        mock_find_documents_all.return_value = []

        response = self.client.get(
            DOES_QUIZ_EXIST_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["isQuizExisting"], False)

        mock_find_documents_all.assert_called_once()

