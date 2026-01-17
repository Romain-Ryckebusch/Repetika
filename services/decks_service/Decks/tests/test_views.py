import json
from unittest.mock import patch, MagicMock

from bson import ObjectId
from rest_framework import status
from rest_framework.test import APITestCase


GET_CARDS_CHAPTER_URL = "/api/decks/getCardsChapter"
GET_CARDS_FROM_ID_URL = "/api/decks/getCardsFromID"
GET_DECK_NAMES_URL = "/api/decks/getDeckNames"
ADD_CARDS_URL = "/api/decks/addCards"
DELETE_CARDS_URL = "/api/decks/deleteCards"
DELETE_CARDS_CHAPTER_URL = "/api/decks/deleteCardsChapter"
DELETE_DECK_URL = "/api/decks/deleteDeck"
CREATE_DECK_URL = "/api/decks/createDeck"


class GetCardsChapterTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(GET_CARDS_CHAPTER_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.find_documents_all")
    def test_valid_parameters_returns_cards(self, mock_find_documents_all):
        id_user = "user123"
        id_chapitre = str(ObjectId())
        id_deck = str(ObjectId())

        expected_cards = [
            {"_id": str(ObjectId()), "front": "Q1", "back": "A1"},
            {"_id": str(ObjectId()), "front": "Q2", "back": "A2"},
        ]
        mock_find_documents_all.return_value = expected_cards

        response = self.client.get(
            GET_CARDS_CHAPTER_URL,
            {
                "user_id": id_user,
                "id_chapitre": id_chapitre,
                "id_deck": id_deck,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_cards)

        mock_find_documents_all.assert_called_once()
        args, kwargs = mock_find_documents_all.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Cards")
        query = kwargs["query"]
        self.assertEqual(query["id_chapitre"], ObjectId(id_chapitre))
        self.assertEqual(query["id_deck"], ObjectId(id_deck))


class GetCardsFromIDTests(APITestCase):
    def test_missing_card_ids_returns_400(self):
        response = self.client.get(GET_CARDS_FROM_ID_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.find_documents_all")
    def test_valid_card_ids_returns_cards(self, mock_find_documents_all):
        id1 = str(ObjectId())
        id2 = str(ObjectId())

        expected_cards = [
            {"_id": id1, "front": "Q1", "back": "A1"},
            {"_id": id2, "front": "Q2", "back": "A2"},
        ]
        mock_find_documents_all.return_value = expected_cards

        response = self.client.get(
            GET_CARDS_FROM_ID_URL,
            {"card_ids": [id1, id2]},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_cards)

        mock_find_documents_all.assert_called_once()
        args, kwargs = mock_find_documents_all.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Cards")
        query = kwargs["query"]
        self.assertIn("_id", query)
        in_ids = query["_id"]["$in"]
        self.assertEqual(sorted(str(x) for x in in_ids), sorted([id1, id2]))


class GetDeckNamesTests(APITestCase):
    def test_missing_id_user_returns_400(self):
        response = self.client.get(GET_DECK_NAMES_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_object_id_user_returns_400(self):
        response = self.client.get(GET_DECK_NAMES_URL, {"id_user": "not-an-objectid"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.find_documents_fields")
    def test_valid_request_returns_deck_names(self, mock_find_documents_fields):
        id_user = str(ObjectId())
        expected = [{"nom_deck": "Deck A"}, {"nom_deck": "Deck B"}]
        mock_find_documents_fields.return_value = expected

        response = self.client.get(GET_DECK_NAMES_URL, {"id_user": id_user})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected)

        mock_find_documents_fields.assert_called_once()
        args, kwargs = mock_find_documents_fields.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Decks")
        self.assertEqual(kwargs["query"], {"id_user": ObjectId(id_user)})
        self.assertEqual(kwargs["fields"], ["nom_deck"])


class AddCardsTests(APITestCase):
    @patch("Decks.views.insert_document")
    def test_no_cartes_returns_200_and_does_not_insert(self, mock_insert_document):
        response = self.client.post(ADD_CARDS_URL, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_insert_document.assert_not_called()

    @patch("Decks.views.insert_document")
    def test_cartes_inserted_with_objectids(self, mock_insert_document):
        cartes = [
            {
                "id_deck": str(ObjectId()),
                "id_chapitre": str(ObjectId()),
                "front": "Q1",
                "back": "A1",
            },
            {
                "id_deck": str(ObjectId()),
                "id_chapitre": str(ObjectId()),
                "front": "Q2",
                "back": "A2",
            },
        ]

        response = self.client.post(
            ADD_CARDS_URL, {"cartes": cartes}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(mock_insert_document.call_count, len(cartes))

        for idx, call in enumerate(mock_insert_document.call_args_list):
            args, kwargs = call
            self.assertEqual(args[0], "DB_Decks")
            self.assertEqual(args[1], "Cards")
            doc = kwargs["document"]
            self.assertIsInstance(doc["id_deck"], ObjectId)
            self.assertIsInstance(doc["id_chapitre"], ObjectId)
            self.assertEqual(str(doc["id_deck"]), cartes[idx]["id_deck"])
            self.assertEqual(str(doc["id_chapitre"]), cartes[idx]["id_chapitre"])
            self.assertEqual(doc["front"], cartes[idx]["front"])
            self.assertEqual(doc["back"], cartes[idx]["back"])


class DeleteCardsTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DELETE_CARDS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_json_for_card_ids_returns_400(self):
        response = self.client.get(
            DELETE_CARDS_URL,
            {"user_id": "user1", "card_ids": "not-json"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.requests.get")
    @patch("Decks.views.delete_document")
    def test_successful_deletion_deletes_cards_and_unschedules(
        self, mock_delete_document, mock_requests_get
    ):
        mock_requests_get.return_value = MagicMock(status_code=200)

        id_user = "user123"
        card_ids = [str(ObjectId()), str(ObjectId())]
        card_ids_json = json.dumps(card_ids)

        response = self.client.get(
            DELETE_CARDS_URL,
            {"user_id": id_user, "card_ids": card_ids_json},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Cards deleted successfully.")
        self.assertEqual(mock_delete_document.call_count, len(card_ids))

        # Each call should delete one card in DB_Decks.Cards
        for idx, call in enumerate(mock_delete_document.call_args_list):
            args, kwargs = call
            self.assertEqual(args[0], "DB_Decks")
            self.assertEqual(args[1], "Cards")
            query = kwargs["query"]
            self.assertEqual(query["_id"], ObjectId(card_ids[idx]))

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        called_params = mock_requests_get.call_args[1]["params"]
        self.assertTrue(called_url.endswith("/unScheduleCards"))
        self.assertEqual(called_params["user_id"], id_user)
        self.assertEqual(json.loads(called_params["card_ids"]), card_ids)

    @patch("Decks.views.requests.get")
    @patch("Decks.views.delete_document")
    def test_unschedule_failure_propagates_error(
        self, mock_delete_document, mock_requests_get
    ):
        mock_requests_get.return_value = MagicMock(status_code=500)

        id_user = "user123"
        card_ids = [str(ObjectId())]
        card_ids_json = json.dumps(card_ids)

        response = self.client.get(
            DELETE_CARDS_URL,
            {"user_id": id_user, "card_ids": card_ids_json},
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)
        mock_delete_document.assert_called_once()
        mock_requests_get.assert_called_once()


class DeleteCardsChapterTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DELETE_CARDS_CHAPTER_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.requests.get")
    @patch("Decks.views.find_documents_fields")
    def test_deletes_all_cards_in_chapter(
        self, mock_find_documents_fields, mock_requests_get
    ):
        mock_requests_get.return_value = MagicMock(status_code=200)

        id_user = "user123"
        id_chapitre = str(ObjectId())
        card_ids = [ObjectId(), ObjectId()]
        mock_find_documents_fields.return_value = [{"_id": cid} for cid in card_ids]

        response = self.client.get(
            DELETE_CARDS_CHAPTER_URL,
            {"user_id": id_user, "id_chapitre": id_chapitre},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Cards in chapter deleted successfully."
        )

        mock_find_documents_fields.assert_called_once()
        args, kwargs = mock_find_documents_fields.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Cards")
        self.assertEqual(kwargs["query"]["id_chapitre"], ObjectId(id_chapitre))
        self.assertEqual(kwargs["fields"], ["_id"])

        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        called_params = mock_requests_get.call_args[1]["params"]
        self.assertTrue(called_url.endswith("/deleteCards"))
        self.assertEqual(called_params["user_id"], id_user)

        sent_card_ids = json.loads(called_params["card_ids"])
        self.assertEqual(sorted(sent_card_ids), sorted([str(c) for c in card_ids]))


class DeleteDeckTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DELETE_DECK_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.requests.get")
    @patch("Decks.views.delete_document")
    @patch("Decks.views.find_documents_fields")
    def test_delete_deck_and_related_cards(
        self, mock_find_documents_fields, mock_delete_document, mock_requests_get
    ):
        mock_requests_get.return_value = MagicMock(status_code=200)

        id_user = str(ObjectId())
        id_deck = str(ObjectId())
        card_ids = ["card1", "card2"]
        mock_find_documents_fields.return_value = [{"_id": cid} for cid in card_ids]

        response = self.client.get(
            DELETE_DECK_URL,
            {"user_id": id_user, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Deck deleted successfully.")

        # First call to find_documents_fields: get card IDs for the deck
        mock_find_documents_fields.assert_called_once()
        args, kwargs = mock_find_documents_fields.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Cards")
        self.assertEqual(kwargs["query"]["id_deck"], ObjectId(id_deck))
        self.assertEqual(kwargs["fields"], ["_id"])

        # delete_document used to delete the Deck itself
        mock_delete_document.assert_called_once()
        args, kwargs = mock_delete_document.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Decks")
        query = kwargs["query"]
        self.assertEqual(query["_id"], ObjectId(id_deck))
        self.assertEqual(query["id_user"], ObjectId(id_user))

        # Requests to deleteCards for all card IDs
        mock_requests_get.assert_called_once()
        called_url = mock_requests_get.call_args[0][0]
        called_params = mock_requests_get.call_args[1]["params"]
        self.assertTrue(called_url.endswith("/deleteCards"))
        self.assertEqual(called_params["user_id"], id_user)
        self.assertEqual(
            sorted(json.loads(called_params["card_ids"])),
            sorted([str(cid) for cid in card_ids]),
        )

    @patch("Decks.views.requests.get")
    @patch("Decks.views.delete_document")
    @patch("Decks.views.find_documents_fields")
    def test_delete_deck_error_when_delete_cards_fails(
        self, mock_find_documents_fields, mock_delete_document, mock_requests_get
    ):
        mock_requests_get.return_value = MagicMock(status_code=500)
        mock_find_documents_fields.return_value = [{"_id": "card1"}]

        id_user = str(ObjectId())
        id_deck = str(ObjectId())

        response = self.client.get(
            DELETE_DECK_URL,
            {"user_id": id_user, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)
        mock_find_documents_fields.assert_called_once()
        mock_delete_document.assert_called_once()
        mock_requests_get.assert_called_once()


class CreateDeckTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(CREATE_DECK_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Decks.views.insert_document")
    def test_create_deck_with_defaults(self, mock_insert_document):
        inserted_id = ObjectId()
        mock_insert_document.return_value = inserted_id

        id_user = str(ObjectId())

        response = self.client.get(CREATE_DECK_URL, {"user_id": id_user})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id_deck"], str(inserted_id))

        mock_insert_document.assert_called_once()
        args, kwargs = mock_insert_document.call_args
        self.assertEqual(args[0], "DB_Decks")
        self.assertEqual(args[1], "Decks")
        document = kwargs["document"]
        self.assertEqual(document["id_user"], id_user)
        self.assertEqual(document["nom_deck"], "default_name")
        self.assertEqual(document["tags"], [])
        self.assertIn("date_creation", document)
        self.assertTrue(getattr(document["date_creation"], "tzinfo", None) is not None)

    @patch("Decks.views.insert_document")
    def test_create_deck_with_provided_name_and_tags(self, mock_insert_document):
        inserted_id = "deck123"
        mock_insert_document.return_value = inserted_id

        id_user = "user1"
        nom_deck = "My Deck"
        tags = '["tag1", "tag2"]'  # current implementation keeps this as string

        response = self.client.get(
            CREATE_DECK_URL,
            {"user_id": id_user, "nom_deck": nom_deck, "tags": tags},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id_deck"], str(inserted_id))

        mock_insert_document.assert_called_once()
        args, kwargs = mock_insert_document.call_args
        document = kwargs["document"]
        self.assertEqual(document["id_user"], id_user)
        self.assertEqual(document["nom_deck"], nom_deck)
        self.assertEqual(document["tags"], tags)
        self.assertIn("date_creation", document)
