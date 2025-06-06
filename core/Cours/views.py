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

from bson import ObjectId

class GetChapter(APIView):
    """
    GET /api/LireCours/getChapter
    Takes user_id
    Returns List (Course name + no. of chapters unlocked + no. of chapters total)
    """
    def get(self, request):
        # Quiz call to find out the number of unblocked chapters for each course; 
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        #  Get the list of locked chapters id
        response = requests.get(QUIZ_BASE_URL + '/getLockedChapters', params={'user_id': user_id})

        # Check if the request was successful (HTTP status 200)
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
        else:
            print("Failed to retrieve data. Status code:", response.status_code)
            print("Response:", response.text)

        data = [ObjectId(chapter_id) for chapter_id in data]  # Convert string IDs to ObjectId

        quiz_data_id = count_documents_grouped(
            "DB_Cours",
            "Chapitres",
            query={"_id": {"$in": data}},  # Use the list of locked chapter IDs
            group_by_field="id_cours"  # Group by course ID to count chapters per course
        ) # Get the number of locked chapters for each course id

        quiz_data = {}
        for course_id, locked_chapters_count in quiz_data_id.items():
            course_name = find_documents_fields(
                "DB_Cours",
                "Cours",
                query={"_id": ObjectId(course_id)},
                fields=["nom_cours"]
            )[0]["nom_cours"]  # Get the course name from the course ID
            quiz_data[course_name] = locked_chapters_count  # Store the count of locked chapters for each course
        

        user_lessons = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"id_auteur": ObjectId(user_id)},
            fields=["_id", "nom_cours"] # We request the name and id of every course owned by the user
        )
        total_chapters = {}
        for lesson in user_lessons:
            id_lesson = lesson["_id"]
            course_name = lesson["nom_cours"]
            chapter_count = count_documents(
                "DB_Cours",
                "Chapitres",
                query={"id_cours": ObjectId(id_lesson)} # Count the number of chapters for this course
            )
            total_chapters[course_name] = chapter_count # Add the course name and its total number of chapters to the dictionary        
            
        outlist = []
        for course_name, total_chapters in total_chapters.items(): # If a chapter is in quiz_data, it is locked
            locked_chapters = quiz_data.get(course_name, 0)
            unlocked_chapters = total_chapters - locked_chapters # For each course, we determine the number of unlocked chapters
            outlist.append({
                "course_name": course_name,
                "unlocked_chapters": unlocked_chapters,
                "total_chapters": total_chapters
            }) # We add all necessary information to the output list

        return Response(
            outlist,
            status=status.HTTP_200_OK
        )

class GetPDF(APIView):
    """
    GET /api/LireCours/getPDF
    Takes user_id, course_name
    Returns pdf combined course
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        course_name = request.GET.get('course_name')
        if not course_name:
            return Response(
                {"error": "course_name parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Call the Quiz API endpoint to determine which chapters are unlocked; 
        # Use course_name ! For now we will assume the course name is "Mathématiques"
        # Basically, a chapter is a pair (course name; chapter name)
        unlocked_chapters = [{"Mathématiques" : "Complexes"}, {"Mathématiques" : "Fonctions de transfert"}]

        # Using the DB, identify the paths of the pdfs concerned (and their order). 
        pdf_paths = []
        for chapter in unlocked_chapters:
            course_name = list(chapter.keys())[0]
            chapter_name = chapter[course_name]
            pdf_paths.append(f"files/{course_name}/{chapter_name}.pdf")

            #pdf_paths.append(f"./local_tests/{course_name}/{chapter_name}.pdf")

        merger = PdfMerger()
        
        # Get the pdfs from the paths;
        for pdf_path in pdf_paths:
            # merge the pdfs in the indicated order; 
            merger.append(pdf_path)

        # Save the merged pdf to a temporary file
        # merged_pdf_path = "./local_tests/merged_course.pdf"  # <-- working local test 🥳
        merged_pdf_path = "path/to/merged_course.pdf"
        merger.write(merged_pdf_path)
        merger.close()

        # @todo download the file and send it directly (instead of the path)
        remote_response = requests.get(merged_pdf_path, stream=True)

        # Check if the download was successful
        if remote_response.status_code != 200:
            return Response({"error": "Unable to get PDF file."}, status=400)
        
        # Read PDF content
        pdf_content = remote_response.content
        
        # Prepare the HTTP response with the PDF content
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="document.pdf"'
        return response


class UploadAPIView(APIView):
    """
    POST /api/ajout-cours/
    takes: pdf,
           metadata={
                    "course_name":"name",
                    "chapters": [
                        ["name_chapter1", length1],
                        ["name_chapter1", length2], ...
                        ]
                    }

    return: nothing
    """
    parser_classes = [MultiPartParser]
    def get(self, request):
        return Response({'message': 'Use POST to upload a file.'})

    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf')
        metadata = request.data.get('metadata')
        list_pdf=[]

        if not pdf_file or not metadata:
            return Response({"error": "Missing PDF or metadata"}, status=status.HTTP_400_BAD_REQUEST)
        

        try:           
            metadata_json = json.loads(metadata)
            print(metadata_json)
            
            if 'chapters' not in metadata_json or not metadata_json['chapters']:
                list_pdf=[pdf_file]


            else:
                list_chapter=metadata_json['chapters']
                reader = PdfReader(pdf_file)
                total_pages = len(reader.pages)
                current=0
                
                for (title,length) in list_chapter:
                    writer = PdfWriter()
                    end_page = current + length - 1
                    
                    if end_page >= total_pages:
                        end_page = total_pages - 1
                    start_page=current
                    
                    for page_num in range(start_page, end_page + 1):
                        writer.add_page(reader.pages[page_num])
                        current+=1
                    with open(title+".pdf", "wb") as f_out:
                        writer.write(f_out)
                    list_pdf.append(title+".pdf")



        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON in metadata"}, status=status.HTTP_400_BAD_REQUEST)


        #permet d'envoyer à la bdd et d'informer que l'envoi c'est bien passé
        #uploaded_file = UploadedFile.objects.create(file=pdf_file, metadata=metadata_json)
        #serializer = UploadedFileSerializer(uploaded_file)
        #return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({"message": "Success"}, status=status.HTTP_200_OK)


class DeleteChapter(APIView):
    """
    GET /api/cours/DeleteChapter
    Takes: user_id, id_chapter
    Returns: nothing
    """
    def get(self, request):

        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        id_chapter = request.GET.get('id_chapter')
        if not id_chapter:
            return Response({"error": "id_chapter parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the chapter exists
        chapter = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"_id": ObjectId(id_chapter)},
            fields=["_id", "id_cours"]
        )
        if not chapter:
            return Response({"error": "Chapter not found"}, status=status.HTTP_404_NOT_FOUND)
        chapter = chapter[0]

        # Get the course ID associated with the chapter
        id_course = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"_id": ObjectId(id_chapter)},
            fields=["id_cours"]
        )[0]["id_cours"]
        print("id_course : ", id_course)
        
        # Delete the chapter
        delete_count = delete_document(
            "DB_Cours",
            "Chapitres",
            query={"_id": ObjectId(id_chapter)}
        )
        if delete_count == 0:
            return Response({"error": "Failed to delete chapter."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Delete the cards associated with the chapter
        response = requests.get(
            DECKS_BASE_URL + "/deleteCardsChapter",
            params={
                "user_id": user_id,
                "id_chapitre": id_chapter
            }
        )
        if response.status_code != 200:
            return Response({"error": "Failed to delete cards associated with the chapter. details: " + response.text}, status=response.status_code)
        
        # Get the deck ID from the course
        id_deck = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_course)},
            fields=["id_deck"]
        )
        if not id_deck:
            return Response({"error": "Deck not found for the chapter."}, status=status.HTTP_404_NOT_FOUND)
        id_deck = id_deck[0]["id_deck"]

        # Delete the quiz associated with the chapter (if not done yet)
        print("id_deck : ", id_deck, "id_chapter : ", id_chapter, "user_id : ", user_id) # TODO : correct this part, quiz deletion doesn't seem to work as expected
        response = requests.get(
            QUIZ_BASE_URL + "/removeQuiz",
            params={
                "user_id": user_id,
                "id_chapitre": id_chapter,
                "id_deck": id_deck
            }
        )
        
        if response.status_code != 200:
            return Response({"error": "Failed to delete quiz associated with the chapter. details: " + response.text}, status=response.status_code)

        return Response(status=status.HTTP_200_OK)


class DeleteCourse(APIView):
    """
    GET /api/cours/DeleteCourse
    Takes: user_id, id_lesson
    Returns: lesson_type, chapter names listed
    """
    def get(self, request):

        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        id_lesson = request.GET.get('id_lesson')
        if not id_lesson:
            return Response({"error": "id_lesson parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        # Check if the course exists and is owned by the user
        course = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_lesson), "id_auteur": ObjectId(user_id)},
            fields=["_id", "nom_cours"]
        )
        if not course:
            return Response({"error": "Course not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)
        course = course[0]
        # Delete the course
        delete_count = delete_document(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_lesson), "id_auteur": ObjectId(user_id)}
        )
        if delete_count == 0:
            return Response({"error": "Failed to delete course."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


        # TODO : check that chapter deletion and deck deletion work as expected

        # Delete the chapters associated with the course using DeleteChapter
        chapters = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"id_cours": ObjectId(id_lesson)},
            fields=["_id"]
        )
        if not chapters:
            return Response({"error": "No chapters found for the course."}, status=status.HTTP_404_NOT_FOUND)
        for chapter in chapters:
            id_chapter = chapter["_id"]
            response = requests.get(
                COURS_BASE_URL + "/deleteChapter",
                params={
                    "user_id": user_id,
                    "id_chapter": str(id_chapter)  # Convert ObjectId to string for the request
                }
            )
            if response.status_code != 200:
                return Response(
                    {"error": "Failed to delete chapter associated with the course. details: " + response.text},
                    status=response.status_code
                )

        # Delete the course's deck
        response = requests.get(
            DECKS_BASE_URL + "/deleteDeck",
            params={
                "user_id": user_id,
                "id_deck": str(course.get("id_deck"))  # Convert ObjectId to string for the request
            }
        )
        if response.status_code != 200:
            return Response(
                {"error": "Failed to delete deck associated with the course. details: " + response.text},
                status=response.status_code
            )


        # Delete the metadata associated with the course
        delete_document(
            "DB_Cours",
            "MetadataCoursPublic",
            query={"id_cours": ObjectId(id_lesson)}
        )
        # Delete the subscribers associated with the course
        delete_document(
            "DB_Cours",
            "Subscribers",
            query={"id_cours": ObjectId(id_lesson)}
        )
        # Delete the likes and comments associated with the course
        delete_document(
            "DB_Cours",
            "Likes",
            query={"id_cours": ObjectId(id_lesson)}
        )
        delete_document(
            "DB_Cours",
            "Comments",
            query={"id_cours": ObjectId(id_lesson)}
        )

        

class ShareCourse(APIView):
    """
    GET /api/cours/ShareCourse
    Takes: user_id, id_course, metadata (JSON)
    Returns: nothing
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        id_course = request.GET.get('id_course')
        if not id_course:
            return Response({"error": "id_course parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        metadata = request.GET.get('metadata')
        if not metadata:
            return Response({"error": "metadata parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the course exists and is owned by the user
        course = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_course), "id_auteur": ObjectId(user_id)},
            fields=["_id", "nom_cours", "public"]
        )
        if not course:
            return Response({"error": "Course not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)
        course = course[0]
        # Check if the course is already public
        if course.get("public", False):
            return Response({"error": "Course is already public."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        # Update the course to make it public
        update = update_document(
            "DB_Cours",
            "Cours",
            {"_id": ObjectId(id_course)},
            {"public": True},  # Set the course to public
        )

        if update == 0:
            return Response({"error": "Failed to update course."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Add all the metadata (including a foreign key to the corresponding ‘Course’) to the ‘Metadata public course’ table.
        metadata_json = json.loads(metadata)
        if not isinstance(metadata_json, dict):
            return Response({"error": "Invalid metadata format. Expected a JSON object."}, status=status.HTTP_400_BAD_REQUEST)
        
        insert_document(
            "DB_Cours",
            "MetadataCoursPublic",
            {
                "id_cours": ObjectId(id_course),
                "id_auteur": ObjectId(user_id),
                "date_publication": timezone.now(), 

                # this information must then be extracted from the body of the request
                "tags": metadata_json.get("tags", []),  # retrieves tags from metadata, default to empty list
                "description": metadata_json.get("description", ""),  # retrieves description from metadata, default to empty string
                "members": 0, # Starting value, will be updated as people subscribe to the course
                "likes_count": 0, # idem
                "comments_count": 0, # idem
            }
        )

        return Response(status=status.HTTP_200_OK) 


class ShowAllSharedCourses(APIView):
    """
    GET /api/cours/showAllSharedCourses
    Takes: nothing
    Returns: List of public shared courses
    """

    def get(self, request):
        
        # Courses looks up the names of all public courses (and their authors) in its main DB; 
        public_courses = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"public": True},  # Only public courses
            fields=["_id", "nom_cours", "id_auteur"]
        )
        # It then goes to 'Metadata' to determine the metadata for each course; 
        metadata_courses = find_documents_fields(
            "DB_Cours",
            "MetadataCoursPublic",
            query={},
            fields=["id_cours", "id_auteur", "date_publication", "tags", "description", "members", "likes_count", "comments_count"]
            # NB : "tags", "description", "members", "likes_count", "comments_count" DON'T EXIST yet in the DB.
        )
        # To obtain the number of likes and comments for each course; 
        community_info = find_documents_fields(
            "DB_Cours",
            "InfosCommunautaires", # Doesn't exist yet
            query={},
            fields=["id_cours", "likes_count", "comments_count"]
        )
        # To 'Souscriveur' to determine the number of subscribers for each course; 
        subscribers = find_documents_fields(
            "DB_Cours",
            "Souscriveur",
            query={},
            fields=["id_cours", "id_user"]
        )
        # Sends back all informations to Main
        courses_info = []
        for course in public_courses:
            course_id = course["_id"]
            course_name = course["nom_cours"]
            author_id = course["id_auteur"]

            # Find metadata for the course
            metadata = next((m for m in metadata_courses if m["id_cours"] == course_id), None)
            metadata = metadata if metadata is not None else {}

            # Find community info for the course
            community = next((c for c in community_info if c["id_cours"] == course_id), None)
            community = community if community is not None else {}

            # Find subscribers for the course
            course_subscribers = [s for s in subscribers if s["id_cours"] == course_id]
            subscribers_count = len(course_subscribers)

            # Get the author's name
            author = find_documents_fields(
                "DB_Users",
                "Users", #TODO
                query={"_id": ObjectId(author_id)},
                fields=["username"]
            )
            if author:
                author_name = author[0]["username"]
            else:
                author_name = None # TEMP
            #else:
            #    return Response(
            #        {"error": "The author of the course does not exist. What's going on?"},
            #        status=status.HTTP_404_NOT_FOUND
            #    )

            # Prepare the course information
            course_info = {
                "course_id": str(course_id),
                "course_name": course_name,
                "author_id": str(author_id),
                "author_name": author_name if author_name else "#TODO",
                "date_publication": metadata.get("date_publication", None).isoformat() if metadata.get("date_publication") else None,
                "tags": metadata.get("tags", None),
                "description": metadata.get("description", None),
                "members": metadata.get("members", 0),
                "likes_count": community.get("likes_count", 0) if community else 0,
                "comments_count": community.get("comments_count", 0) if community else 0,
                "subscribers_count": subscribers_count if subscribers_count else 0
            }
            courses_info.append(course_info)
        
        return Response(
            courses_info,
            status=status.HTTP_200_OK
        )

class AddToSubscribers(APIView):
    """
    GET /api/cours/addToSubscribers
    Course adds the user's name to the 'Subscriber' table, associating their name with the course ID.
    Fellow devs, don't forget to check the example provided.

    Takes: id_user, course_name, author_id
    Returns: nothing
    """

    def get(self, request):
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        course_name = request.GET.get('course_name')
        if not course_name:
            return Response({"error": "course_name parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        author_id = request.GET.get('author_id')
        if not author_id:
            return Response({"error": "author_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        

        # Check if the course exists and is public
        course = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"nom_cours": course_name, "public": True},
            fields=["_id"]
        )
        if not course:
            return Response({"error": "Course not found or is not public."}, status=status.HTTP_404_NOT_FOUND)
        

        course = course[0]
        course_id = course["_id"]

        # Check if the user is already subscribed to the course
        existing_subscription = find_documents_fields(
            "DB_Cours",
            "Souscriveur",
            query={"id_cours": ObjectId(course_id), "id_user": ObjectId(id_user)},
            fields=["_id"]
        )
        if existing_subscription:
            return Response({"error": "User is already subscribed to this course."}, status=status.HTTP_400_BAD_REQUEST)
        

        # Add the user to the subscribers list
        insert_document(
            "DB_Cours",
            "Souscriveur",
            {
                "id_cours": ObjectId(course_id),
                "id_user": ObjectId(id_user)
            }
        )

        # TODO : Update the number of members in the course metadata?
        
        return Response(
            status=status.HTTP_200_OK
        )