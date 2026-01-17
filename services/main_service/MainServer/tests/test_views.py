import io
import json
import os
import zipfile
from unittest.mock import patch, MagicMock

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from MainServer import views as main_views


START_SESSION_URL = "/api/main/start-session"
UPDATE_SESSION_URL = "/api/main/update-session"
GET_DECK_NAMES_URL = "/api/main/getDeckNames"
CREATE_DECK_URL = "/api/main/createDeck"
CREATE_CARDS_URL = "/api/main/createCards"
GET_ACCESSIBLE_COURSES_URL = "/api/main/getAccessibleCourses"
GET_COURSE_CHAPTERS_URL = "/api/main/getCourseChapters"
UPLOAD_PDF_URL = "/api/main/ajout-cours"
GET_FULL_PDF_FILE_URL = "/api/main/getFullPDF_file"
GET_FULL_PDF_URL_URL = "/api/main/getFullPDF_url"
GET_PDF_URL = "/api/main/getPDF"
COMPLETE_QUIZ_URL = "/api/main/completeQuiz"
DOES_QUIZ_EXIST_URL = "/api/main/doesQuizExist"
SHOW_ALL_SHARED_COURSES_URL = "/api/main/showAllSharedCourses"
ADD_TO_SUBSCRIBERS_URL = "/api/main/addToSubscribers"
CARDS_REVIEWED_TODAY_URL = "/api/main/cardsReviewedToday"
REGISTER_URL = "/api/main/register"
LOGIN_URL = "/api/main/login"
LOGOUT_URL = "/api/main/logout"
DELETE_ACCOUNT_URL = "/api/main/deleteAccount"
UPDATE_PROFILE_URL = "/api/main/updateProfile"
GET_INFOS_URL = "/api/main/getInfos/"


class SessionRevisionTests(APITestCase):
    @patch("MainServer.views.requests.get")
    def test_start_session_success(self, mock_get):
        user_id = "user123"
        deck_id = "deck456"

        cards = [
            {"id_card": "c1", "front": "Q1", "back": "A1"},
            {"id_card": "c2", "front": "Q2", "back": "A2"},
        ]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = cards
        mock_get.return_value = mock_resp

        response = self.client.get(
            START_SESSION_URL,
            {"user_id": user_id, "deck_id": deck_id},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, cards)
        mock_get.assert_called_once()

    def test_start_session_missing_params_returns_400(self):
        response = self.client.get(START_SESSION_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_update_session_success(self, mock_post):
        user_id = "user123"
        results = {"card1": 2, "card2": 0}
        metadata = {"user_id": user_id, "results": results}

        mock_resp = MagicMock(status_code=200)
        mock_post.return_value = mock_resp

        response = self.client.post(UPDATE_SESSION_URL, {"metadata": metadata}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Success SendPlanification")
        mock_post.assert_called_once()

    def test_update_session_missing_metadata_returns_400(self):
        response = self.client.post(UPDATE_SESSION_URL, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_update_session_failure_propagates_error(self, mock_post):
        metadata = {"user_id": "u", "results": {}}
        mock_resp = MagicMock(status_code=500)
        mock_post.return_value = mock_resp

        response = self.client.post(UPDATE_SESSION_URL, {"metadata": metadata}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)


class CoursesTests(APITestCase):
    @patch("MainServer.views.requests.get")
    def test_get_accessible_courses_success(self, mock_get):
        user_id = "user123"
        courses = [{"id_cours": "c1"}, {"id_cours": "c2"}]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = courses
        mock_get.return_value = mock_resp

        response = self.client.get(GET_ACCESSIBLE_COURSES_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, courses)

    def test_get_accessible_courses_missing_user_returns_400(self):
        response = self.client.get(GET_ACCESSIBLE_COURSES_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_accessible_courses_remote_error(self, mock_get):
        user_id = "user123"
        mock_resp = MagicMock(status_code=500, text="error")
        mock_get.return_value = mock_resp

        response = self.client.get(GET_ACCESSIBLE_COURSES_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_course_chapters_success(self, mock_get):
        user_id = "user123"
        id_course = "course1"
        chapters = [{"id_chapitre": "ch1"}]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = chapters
        mock_get.return_value = mock_resp

        response = self.client.get(
            GET_COURSE_CHAPTERS_URL,
            {"user_id": user_id, "id_course": id_course},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, chapters)

    def test_get_course_chapters_missing_params_returns_400(self):
        response = self.client.get(GET_COURSE_CHAPTERS_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)


class DecksTests(APITestCase):
    def test_get_deck_names_missing_id_user_returns_400(self):
        response = self.client.get(GET_DECK_NAMES_URL)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_deck_names_success(self, mock_get):
        id_user = "user123"
        decks = [{"nom_deck": "Deck 1"}]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = decks
        mock_get.return_value = mock_resp

        response = self.client.get(GET_DECK_NAMES_URL, {"id_user": id_user})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, decks)

    def test_create_deck_missing_user_returns_400(self):
        response = self.client.get(CREATE_DECK_URL)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_create_deck_success_with_defaults(self, mock_get):
        # Ensure DECK_BASE_URL exists to avoid NameError in the view
        setattr(main_views, "DECK_BASE_URL", "http://decks-service:8000/api/decks")

        id_user = "user123"
        payload = {"id_deck": "deck1"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_get.return_value = mock_resp

        response = self.client.get(CREATE_DECK_URL, {"user_id": id_user})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)
        mock_get.assert_called_once()

    def test_create_cards_missing_cartes_returns_400(self):
        response = self.client.post(CREATE_CARDS_URL, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_create_cards_missing_required_field_returns_400(self):
        cartes = [{"id_deck": "d", "id_chapitre": "c", "front": "Q"}]  # missing back
        response = self.client.post(CREATE_CARDS_URL, {"cartes": cartes}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_create_cards_success(self, mock_post):
        cartes = [
            {"id_deck": "d1", "id_chapitre": "c1", "front": "Q1", "back": "A1"},
            {"id_deck": "d1", "id_chapitre": "c1", "front": "Q2", "back": "A2"},
        ]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = {"message": "ok"}
        mock_post.return_value = mock_resp

        response = self.client.post(CREATE_CARDS_URL, {"cartes": cartes}, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "ok"})
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertIn("cartes", kwargs["json"])
        self.assertEqual(kwargs["json"]["cartes"], cartes)


class QuizTests(APITestCase):
    def test_complete_quiz_missing_params_returns_400(self):
        response = self.client.get(COMPLETE_QUIZ_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_complete_quiz_success(self, mock_get):
        user_id = "user123"
        id_chapitre = "chap1"
        id_deck = "deck1"

        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = {"ok": True}
        mock_get.return_value = mock_resp

        response = self.client.get(
            COMPLETE_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Quiz completed successfully.")

    @patch("MainServer.views.requests.get")
    def test_complete_quiz_remote_error(self, mock_get):
        user_id = "user123"
        id_chapitre = "chap1"
        id_deck = "deck1"

        mock_resp = MagicMock(status_code=500)
        mock_resp.json.return_value = {"detail": "err"}
        mock_get.return_value = mock_resp

        response = self.client.get(
            COMPLETE_QUIZ_URL,
            {"user_id": user_id, "id_chapitre": id_chapitre, "id_deck": id_deck},
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)

    def test_does_quiz_exist_missing_params_returns_400(self):
        response = self.client.get(DOES_QUIZ_EXIST_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_does_quiz_exist_success(self, mock_get):
        payload = {"isQuizExisting": True}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_get.return_value = mock_resp

        response = self.client.get(
            DOES_QUIZ_EXIST_URL,
            {"user_id": "u", "id_chapitre": "c", "id_deck": "d"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)


class PdfEndpointsTests(APITestCase):
    def test_upload_pdf_missing_file_returns_400(self):
        response = self.client.post(UPLOAD_PDF_URL, {}, format="multipart")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_upload_pdf_invalid_metadata_returns_400(self):
        pdf_bytes = b"%PDF-1.4\n%Fake\n"
        uploaded = SimpleUploadedFile("test.pdf", pdf_bytes, content_type="application/pdf")

        response = self.client.post(
            UPLOAD_PDF_URL,
            {"pdf": uploaded, "metadata": "not-json"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_upload_pdf_success(self, mock_post):
        pdf_bytes = b"%PDF-1.4\n%Fake\n"
        uploaded = SimpleUploadedFile("test.pdf", pdf_bytes, content_type="application/pdf")
        metadata = {"course_name": "Test"}

        payload = {"id_cours": "c1"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            UPLOAD_PDF_URL,
            {"pdf": uploaded, "metadata": json.dumps(metadata)},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)
        mock_post.assert_called_once()

    @patch("MainServer.views.requests.get")
    def test_get_full_pdf_file_success(self, mock_get):
        user_id = "u1"
        id_course = "c1"
        pdf_content = b"%PDF-1.4\n%Fake\n"

        mock_resp = MagicMock(status_code=200, content=pdf_content, headers={})
        mock_get.return_value = mock_resp

        response = self.client.get(
            GET_FULL_PDF_FILE_URL,
            {"user_id": user_id, "id_course": id_course},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("Content-Disposition", response)
        body = b"".join(response.streaming_content)
        self.assertEqual(body, pdf_content)

    def test_get_full_pdf_file_missing_params_returns_400(self):
        response = self.client.get(GET_FULL_PDF_FILE_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_full_pdf_url_success(self, mock_get):
        user_id = "u1"
        id_course = "c1"
        pdf_content = b"%PDF-1.4\n%Fake\n"

        mock_resp = MagicMock(status_code=200, content=pdf_content, headers={})
        mock_get.return_value = mock_resp

        response = self.client.get(
            GET_FULL_PDF_URL_URL,
            {"user_id": user_id, "id_course": id_course},
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertIn("pdf_url", data)
        self.assertTrue(data["pdf_url"].startswith("http://testserver/pdfs/"))
        self.assertTrue(data["pdf_url"].endswith(".pdf"))

    def test_get_full_pdf_url_missing_params_returns_400(self):
        response = self.client.get(GET_FULL_PDF_URL_URL, {"user_id": "u"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_pdf_success_with_zip(self, mock_get):
        user_id = "u1"
        id_course = "c1"

        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as zf:
            zf.writestr("chap1.pdf", b"pdf1")
            zf.writestr("chap2.pdf", b"pdf2")
        zip_bytes = buffer.getvalue()

        mock_resp = MagicMock(status_code=200, content=zip_bytes, headers={})
        mock_get.return_value = mock_resp

        response = self.client.get(
            GET_PDF_URL,
            {"user_id": user_id, "id_course": id_course},
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertIn("pdf_urls", data)
        self.assertEqual(len(data["pdf_urls"]), 2)
        for url in data["pdf_urls"]:

            self.assertTrue(url.startswith("http://testserver/pdfs/"))
            self.assertTrue(url.endswith(".pdf"))

    @patch("MainServer.views.requests.get")
    def test_get_pdf_bad_zip_returns_500(self, mock_get):
        user_id = "u1"
        id_course = "c1"

        mock_resp = MagicMock(status_code=200, content=b"not a zip", headers={})
        mock_get.return_value = mock_resp

        response = self.client.get(
            GET_PDF_URL,
            {"user_id": user_id, "id_course": id_course},
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)


class SharedCoursesAndPlanningTests(APITestCase):
    @patch("MainServer.views.requests.get")
    def test_show_all_shared_courses_success(self, mock_get):
        payload = [{"course_id": "c1"}]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_get.return_value = mock_resp

        response = self.client.get(SHOW_ALL_SHARED_COURSES_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

    @patch("MainServer.views.requests.get")
    def test_add_to_subscribers_missing_params_returns_400(self, mock_get):
        response = self.client.get(ADD_TO_SUBSCRIBERS_URL)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_add_to_subscribers_success(self, mock_get):
        mock_resp = MagicMock(status_code=200)
        mock_get.return_value = mock_resp

        response = self.client.get(
            ADD_TO_SUBSCRIBERS_URL,
            {"id_user": "u", "course_name": "c", "author_id": "a"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Success AddToSubscribers")

    @patch("MainServer.views.requests.get")
    def test_cards_reviewed_today_missing_user_returns_400(self, mock_get):
        response = self.client.get(CARDS_REVIEWED_TODAY_URL)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_cards_reviewed_today_success(self, mock_get):
        payload = [{"id_card": "c1", "id_cours": "course1"}]
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_get.return_value = mock_resp

        response = self.client.get(CARDS_REVIEWED_TODAY_URL, {"user_id": "u"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)


class AuthTests(APITestCase):
    def test_login_missing_params_returns_400(self):
        response = self.client.post(LOGIN_URL, {"username": "u"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_login_success(self, mock_post):
        payload = {"token": "abc"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            LOGIN_URL,
            {"username": "u", "password": "p"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

    def test_logout_missing_refresh_returns_400(self):
        response = self.client.post(LOGOUT_URL, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_logout_success(self, mock_post):
        payload = {"detail": "ok"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            LOGOUT_URL,
            {"refresh": "tok"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

    def test_register_missing_credentials_returns_400(self):
        response = self.client.post(REGISTER_URL, {"username": "u"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_register_remote_error_returns_400(self, mock_post):
        mock_resp = MagicMock(status_code=400)
        mock_resp.json.return_value = {"detail": "err"}
        mock_post.return_value = mock_resp

        response = self.client.post(
            REGISTER_URL,
            {"username": "u", "password": "p"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertIn("detail", response.data)

    @patch("MainServer.views.requests.post")
    def test_register_success(self, mock_post):
        payload = {"id_user": "u1"}
        mock_resp = MagicMock(status_code=201)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            REGISTER_URL,
            {"username": "u", "password": "p"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, payload)

    @patch("MainServer.views.requests.post")
    def test_register_invalid_json_in_remote_response(self, mock_post):
        mock_resp = MagicMock(status_code=201)
        mock_resp.json.side_effect = ValueError("bad json")
        mock_post.return_value = mock_resp

        response = self.client.post(
            REGISTER_URL,
            {"username": "u", "password": "p"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_delete_account_missing_user_returns_400(self):
        response = self.client.post(DELETE_ACCOUNT_URL, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_delete_account_success(self, mock_post):
        payload = {"detail": "deleted"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            DELETE_ACCOUNT_URL,
            {"user_id": "u"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

    def test_update_profile_missing_user_returns_400(self):
        response = self.client.post(UPDATE_PROFILE_URL, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.post")
    def test_update_profile_success(self, mock_post):
        payload = {"detail": "updated"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_post.return_value = mock_resp

        response = self.client.post(
            UPDATE_PROFILE_URL,
            {"user_id": "u", "username": "new"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

    def test_get_infos_missing_id_user_returns_400(self):
        response = self.client.get(GET_INFOS_URL)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    @patch("MainServer.views.requests.get")
    def test_get_infos_success(self, mock_get):
        payload = {"username": "u"}
        mock_resp = MagicMock(status_code=200)
        mock_resp.json.return_value = payload
        mock_get.return_value = mock_resp

        response = self.client.get(GET_INFOS_URL, {"id_user": "u"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, payload)

