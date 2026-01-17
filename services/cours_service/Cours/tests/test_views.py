from datetime import datetime
import json
import os
from io import BytesIO
from unittest.mock import patch, MagicMock

from bson import ObjectId
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.test import APITestCase


GET_CHAPTER_URL = "/api/cours/getChapter"
GET_COURSE_CHAPTERS_URL = "/api/cours/getCourseChapters"
GET_PDF_URL = "/api/cours/getPDF"
UPLOAD_PDF_URL = "/api/cours/ajout-cours"
GET_ACCESSIBLE_COURSES_URL = "/api/cours/getAccessibleCourses"
DELETE_CHAPTER_URL = "/api/cours/deleteChapter"
DELETE_COURSE_URL = "/api/cours/deleteCourse"
SHARE_COURSE_URL = "/api/cours/shareCourse"
SHOW_ALL_SHARED_COURSES_URL = "/api/cours/showAllSharedCourses"
ADD_TO_SUBSCRIBERS_URL = "/api/cours/addToSubscribers"
GET_COURSE_ID_FROM_CHAPTER_ID_URL = "/api/cours/getCourseIDFromChapterID"


class GetChapterTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(GET_CHAPTER_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_valid_user_returns_courses(self):
        user_id = str(ObjectId())
        locked_chapter_ids = [str(ObjectId())]

        mock_quiz_response = MagicMock(status_code=200)
        mock_quiz_response.json.return_value = locked_chapter_ids

        course_id = str(ObjectId())
        locked_count = 2
        total_chapters_for_course = 5
        course_name = "My Course"

        with patch("Cours.views.requests.get", return_value=mock_quiz_response) as mock_get, \
             patch("Cours.views.count_documents_grouped") as mock_count_grouped, \
             patch("Cours.views.count_documents") as mock_count, \
             patch("Cours.views.find_documents_fields") as mock_find_fields:

            mock_count_grouped.return_value = {course_id: locked_count}

            # 1st call: get course name from course_id
            # 2nd call: list of user-owned courses
            mock_find_fields.side_effect = [
                [{"nom_cours": course_name}],
                [{"_id": course_id, "nom_cours": course_name}],
            ]
            mock_count.return_value = total_chapters_for_course

            response = self.client.get(GET_CHAPTER_URL, {"user_id": user_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        item = response.data[0]
        self.assertEqual(item["course_name"], course_name)
        self.assertEqual(item["total_chapters"], total_chapters_for_course)
        self.assertEqual(
            item["unlocked_chapters"],
            total_chapters_for_course - locked_count,
        )
        mock_get.assert_called_once()


class GetCourseChaptersTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(GET_COURSE_CHAPTERS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_missing_id_course_returns_400(self):
        user_id = str(ObjectId())
        response = self.client.get(GET_COURSE_CHAPTERS_URL, {"user_id": user_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_valid_request_returns_sorted_chapters_with_flags(self):
        user_id = str(ObjectId())
        id_course = str(ObjectId())
        id_deck = str(ObjectId())

        chapters = [
            {
                "_id": ObjectId(),
                "nom_chapitre": "Chap 2",
                "position": 1,
                "chemin_pdf": "chap2.pdf",
            },
            {
                "_id": ObjectId(),
                "nom_chapitre": "Chap 1",
                "position": 0,
                "chemin_pdf": "chap1.pdf",
            },
        ]

        # For each chapter + one extra for the final recomputation
        quiz_responses = []
        for _ in range(len(chapters) + 1):
            r = MagicMock()
            # simulate "quiz does NOT exist" => isQuizExisting=False => is_finished=True
            r.json.return_value = {"isQuizExisting": False}
            quiz_responses.append(r)

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.requests.get") as mock_requests_get:

            # 1st call: chapters list
            # 2nd call: course -> id_deck
            mock_find_fields.side_effect = [
                chapters.copy(),
                [{"id_deck": id_deck}],
            ]
            mock_requests_get.side_effect = quiz_responses

            response = self.client.get(
                GET_COURSE_CHAPTERS_URL,
                {"user_id": user_id, "id_course": id_course},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        # Should be sorted by position 0, then 1
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["position"], 0)
        self.assertTrue(data[0]["is_unlocked"])
        # Next one unlocked because previous is_finished is True
        self.assertTrue(data[1]["is_unlocked"])


class GetPDFTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        # Missing user_id
        response = self.client.get(GET_PDF_URL, {"id_course": str(ObjectId())})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Missing id_course
        response = self.client.get(GET_PDF_URL, {"user_id": str(ObjectId())})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_200_from_getCourseChapters_returns_400(self):
        user_id = str(ObjectId())
        id_course = str(ObjectId())

        bad_response = MagicMock(status_code=500)

        with patch("Cours.views.requests.get", return_value=bad_response):
            response = self.client.get(
                GET_PDF_URL,
                {"user_id": user_id, "id_course": id_course},
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_creates_zip_of_unlocked_pdfs(self):
        user_id = str(ObjectId())
        id_course = str(ObjectId())

        # Create two fake pdf files
        os.makedirs("cours_pdf", exist_ok=True)
        pdf1_path = "cours_pdf/chap1.pdf"
        pdf2_path = "cours_pdf/chap2.pdf"
        with open(pdf1_path, "wb") as f:
            f.write(b"%PDF-1.4\n%Fake1\n")
        with open(pdf2_path, "wb") as f:
            f.write(b"%PDF-1.4\n%Fake2\n")

        chapters = [
            {
                "id_chapitre": str(ObjectId()),
                "nom_chapitre": "Chap 1",
                "position": 0,
                "is_unlocked": True,
                "chemin_pdf": pdf1_path,
            },
            {
                "id_chapitre": str(ObjectId()),
                "nom_chapitre": "Chap 2",
                "position": 1,
                "is_unlocked": False,  # locked => should be skipped
                "chemin_pdf": pdf2_path,
            },
        ]

        mock_courses_response = MagicMock(status_code=200)
        mock_courses_response.json.return_value = chapters

        with patch("Cours.views.requests.get", return_value=mock_courses_response):
            response = self.client.get(
                GET_PDF_URL,
                {"user_id": user_id, "id_course": id_course},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Content-Type should be a zip (may vary slightly by Django version)
        self.assertIn("application/zip", response["Content-Type"])
        self.assertIn("Content-Disposition", response)


class UploadPDFTests(APITestCase):
    def test_missing_pdf_returns_400(self):
        response = self.client.post(UPLOAD_PDF_URL, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_metadata_json_returns_400(self):
        pdf_bytes = b"%PDF-1.4\n%Fake\n"
        uploaded = SimpleUploadedFile("test.pdf", pdf_bytes, content_type="application/pdf")

        response = self.client.post(
            UPLOAD_PDF_URL,
            {"pdf": uploaded, "metadata": "not-json"},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("Cours.views.PdfWriter")
    @patch("Cours.views.PdfReader")
    @patch("Cours.views.insert_document")
    def test_upload_simple_pdf_creates_course_and_chapter(
        self,
        mock_insert_document,
        mock_pdf_reader,
        mock_pdf_writer,
    ):
        # Mock PDF reader/writer so we don't depend on real PDF structure
        reader_instance = MagicMock()
        # 1 page is enough
        reader_instance.pages = [object()]
        mock_pdf_reader.return_value = reader_instance
        writer_instance = MagicMock()
        mock_pdf_writer.return_value = writer_instance

        # insert_document returns course_id then chapter_id
        course_id = ObjectId()
        chapter_id = ObjectId()
        mock_insert_document.side_effect = [course_id, chapter_id]

        pdf_bytes = b"%PDF-1.4\n%Fake\n"
        uploaded = SimpleUploadedFile("test.pdf", pdf_bytes, content_type="application/pdf")

        id_deck = str(ObjectId())
        metadata = {
            "course_name": "Test Course",
            "author_id": str(ObjectId()),
            "user_id": str(ObjectId()),
            "name_author": "Author Name",
            "id_deck": id_deck,
            "matiere": "Math",
            "public": True,
            # No "chapters" => single chapter with whole PDF
        }

        response = self.client.post(
            UPLOAD_PDF_URL,
            {"pdf": uploaded, "metadata": json.dumps(metadata)},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id_cours"], str(course_id))
        self.assertEqual(response.data["id_chapitres"], [str(chapter_id)])
        self.assertEqual(response.data["id_deck"], id_deck)
        self.assertEqual(mock_insert_document.call_count, 2)


class GetAccessibleCoursesTests(APITestCase):
    def test_missing_user_id_returns_400(self):
        response = self.client.get(GET_ACCESSIBLE_COURSES_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_success_combines_owned_and_subscribed_and_sets_cards_today(self):
        user_id = str(ObjectId())
        owned_course_id = str(ObjectId())
        subscribed_only_course_id = str(ObjectId())

        owned_courses = [
            {
                "_id": owned_course_id,
                "nom_cours": "Owned",
                "date_creation": make_aware(datetime(2024, 1, 1)),
                "id_deck": "deck-owned",
            }
        ]
        subscribed_courses = [
            {"id_cours": subscribed_only_course_id},
        ]

        # Cards today from planning service
        cards_today_data = [
            {"id_card": str(ObjectId())},
        ]

        # Each card has an id_chapitre after /getCardsFromID
        chapitre_id = str(ObjectId())
        cards_from_decks = [
            {
                "id_card": cards_today_data[0]["id_card"],
                "id_chapitre": chapitre_id,
            }
        ]

        # Chapitre -> cours mapping
        chapters = [
            {"_id": chapitre_id, "id_cours": owned_course_id},
        ]

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.requests.get") as mock_requests_get:

            # 1: owned_courses, 2: subscribed_courses, 3: chapters for card mapping
            mock_find_fields.side_effect = [
                owned_courses,
                subscribed_courses,
                chapters,
            ]

            resp_planning = MagicMock(status_code=200)
            resp_planning.json.return_value = cards_today_data
            resp_decks = MagicMock(status_code=200)
            resp_decks.json.return_value = cards_from_decks

            mock_requests_get.side_effect = [resp_planning, resp_decks]

            response = self.client.get(
                GET_ACCESSIBLE_COURSES_URL,
                {"user_id": user_id},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data

        # One owned + one subscribed-only
        self.assertEqual(len(data), 2)

        owned = next(c for c in data if c["owned"])
        subscribed_only = next(c for c in data if c["subscribed"])

        self.assertEqual(owned["id_cours"], owned_course_id)
        self.assertEqual(owned["cards_today"], 1)

        self.assertEqual(subscribed_only["id_cours"], subscribed_only_course_id)
        self.assertEqual(subscribed_only["cards_today"], 0)


class DeleteChapterTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DELETE_CHAPTER_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

        response = self.client.get(
            DELETE_CHAPTER_URL,
            {"user_id": str(ObjectId())},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_chapter_not_found_returns_404(self):
        user_id = str(ObjectId())
        id_chapter = str(ObjectId())

        with patch("Cours.views.find_documents_fields", return_value=[]):
            response = self.client.get(
                DELETE_CHAPTER_URL,
                {"user_id": user_id, "id_chapter": id_chapter},
            )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_success_deletes_chapter_cards_and_quiz(self):
        user_id = str(ObjectId())
        id_chapter = str(ObjectId())
        id_course = str(ObjectId())
        id_deck = str(ObjectId())

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.delete_document") as mock_delete_document, \
             patch("Cours.views.requests.get") as mock_requests_get:

            # 1st call: chapter exists
            # 2nd call: id_cours for the chapter
            # 3rd call: course -> id_deck
            mock_find_fields.side_effect = [
                [{"_id": id_chapter, "id_cours": id_course}],
                [{"id_cours": id_course}],
                [{"id_deck": id_deck}],
            ]
            # delete_document for the chapter
            mock_delete_document.return_value = 1

            resp_delete_cards = MagicMock(status_code=200)
            resp_remove_quiz = MagicMock(status_code=200)
            mock_requests_get.side_effect = [resp_delete_cards, resp_remove_quiz]

            response = self.client.get(
                DELETE_CHAPTER_URL,
                {"user_id": user_id, "id_chapter": id_chapter},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # First external call to decks, second to quiz
        self.assertEqual(mock_requests_get.call_count, 2)


class DeleteCourseTests(APITestCase):
    def test_missing_parameters_returns_400(self):
        response = self.client.get(DELETE_COURSE_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

        response = self.client.get(
            DELETE_COURSE_URL,
            {"user_id": str(ObjectId())},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_course_not_found_returns_404(self):
        user_id = str(ObjectId())
        id_lesson = str(ObjectId())

        with patch("Cours.views.find_documents_fields", return_value=[]):
            response = self.client.get(
                DELETE_COURSE_URL,
                {"user_id": user_id, "id_lesson": id_lesson},
            )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_success_deletes_course_related_data(self):
        user_id = str(ObjectId())
        id_lesson = str(ObjectId())
        id_deck = str(ObjectId())
        chapter_id = str(ObjectId())

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.delete_document") as mock_delete_document, \
             patch("Cours.views.requests.get") as mock_requests_get:

            # 1: course (with deck id)
            # 2: list of chapters for course
            mock_find_fields.side_effect = [
                [{"_id": id_lesson, "nom_cours": "Course", "id_deck": id_deck}],
                [{"_id": chapter_id}],
            ]

            # deleteDocument is called several times; last call must return 1
            mock_delete_document.side_effect = [1, 1, 1, 1, 1]

            # external requests: one per chapter (deleteChapter), then deleteDeck
            resp_delete_chapter = MagicMock(status_code=200)
            resp_delete_deck = MagicMock(status_code=200)
            mock_requests_get.side_effect = [resp_delete_chapter, resp_delete_deck]

            response = self.client.get(
                DELETE_COURSE_URL,
                {"user_id": user_id, "id_lesson": id_lesson},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(mock_requests_get.call_count, 2)


class ShareAndShowCoursesTests(APITestCase):
    def test_share_missing_params_returns_400(self):
        response = self.client.get(SHARE_COURSE_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_share_course_success(self):
        user_id = str(ObjectId())
        id_course = str(ObjectId())
        metadata = {"tags": ["tag1"], "description": "desc"}

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.update_document", return_value=1) as mock_update, \
             patch("Cours.views.insert_document") as mock_insert:

            # course exists, not public yet
            mock_find_fields.return_value = [
                {"_id": id_course, "nom_cours": "Course", "public": False}
            ]

            response = self.client.get(
                SHARE_COURSE_URL,
                {
                    "user_id": user_id,
                    "id_course": id_course,
                    "metadata": json.dumps(metadata),
                },
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_update.assert_called_once()
        mock_insert.assert_called_once()

    def test_show_all_shared_courses_aggregates_metadata(self):
        course_id = str(ObjectId())
        author_id = str(ObjectId())
        user1 = str(ObjectId())
        user2 = str(ObjectId())
        pub_date = make_aware(datetime(2024, 1, 1))

        public_courses = [
            {"_id": course_id, "nom_cours": "Shared", "id_auteur": author_id},
        ]
        metadata_courses = [
            {
                "id_cours": course_id,
                "id_auteur": author_id,
                "date_publication": pub_date,
                "tags": ["tag"],
                "description": "desc",
                "members": 10,
                "likes_count": 2,
                "comments_count": 1,
            }
        ]
        community_info = [
            {"id_cours": course_id, "likes_count": 5, "comments_count": 3}
        ]
        subscribers = [
            {"id_cours": course_id, "id_user": user1},
            {"id_cours": course_id, "id_user": user2},
        ]
        author_docs = [{"username": "Alice"}]

        with patch("Cours.views.find_documents_fields") as mock_find_fields:
            mock_find_fields.side_effect = [
                public_courses,
                metadata_courses,
                community_info,
                subscribers,
                author_docs,
            ]

            response = self.client.get(SHOW_ALL_SHARED_COURSES_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        course_info = response.data[0]
        self.assertEqual(course_info["course_id"], course_id)
        self.assertEqual(course_info["author_name"], "Alice")
        self.assertEqual(course_info["subscribers_count"], 2)


class AddToSubscribersTests(APITestCase):
    def test_missing_params_returns_400(self):
        response = self.client.get(ADD_TO_SUBSCRIBERS_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_success_adds_subscriber(self):
        id_user = str(ObjectId())
        course_name = "PublicCourse"
        author_id = str(ObjectId())

        with patch("Cours.views.find_documents_fields") as mock_find_fields, \
             patch("Cours.views.insert_document") as mock_insert:

            # 1: find course by name+public
            # 2: check if subscription exists
            mock_find_fields.side_effect = [
                [{"_id": str(ObjectId())}],  # course
                [],  # no existing subscription
            ]

            response = self.client.get(
                ADD_TO_SUBSCRIBERS_URL,
                {
                    "id_user": id_user,
                    "course_name": course_name,
                    "author_id": author_id,
                },
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_insert.assert_called_once()


class GetCourseIDFromChapterIDTests(APITestCase):
    def test_missing_chapter_ids_returns_400(self):
        response = self.client.get(GET_COURSE_ID_FROM_CHAPTER_ID_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_returns_mapping(self):
        chap1 = str(ObjectId())
        chap2 = str(ObjectId())
        course1 = str(ObjectId())
        course2 = str(ObjectId())

        with patch("Cours.views.find_documents_fields") as mock_find_fields:
            mock_find_fields.return_value = [
                {"_id": chap1, "id_cours": course1},
                {"_id": chap2, "id_cours": course2},
            ]

            response = self.client.get(
                GET_COURSE_ID_FROM_CHAPTER_ID_URL,
                {"chapter_ids": [chap1, chap2]},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {chap1: course1, chap2: course2},
        )
