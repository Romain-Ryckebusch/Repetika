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

from .mongodb_utils import find_documents_fields, count_documents, update_document, delete_document

from PyPDF2 import PdfMerger
from PyPDF2 import PdfReader, PdfWriter

#from .models import UploadedFile
#from .serializers import UploadedFileSerializer

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
        
        # Call the Quiz API endpoint
        quiz_data = {"Mathematiques": 0, "Informatique": 1} # Numbers of locked chapters for each course
        # get this from the Quiz service later
        
        user_lessons = find_documents_fields(
            "Cours",
            query={"id_auteur": ObjectId(user_id)},
            fields=["_id", "nom_cours"] # We request the name and id of every course owned by the user
        )
        total_chapters = {}
        for lesson in user_lessons:
            id_lesson = lesson["_id"]
            course_name = lesson["nom_cours"]
            chapter_count = count_documents(
                "Chapitres",
                query={"id_cours": ObjectId(id_lesson)} # Count the number of chapters for this course
            )
            total_chapters[course_name] = chapter_count # Add the course name and its total number of chapters to the dictionary        

        outlist = []
        for course_name, locked_chapters in quiz_data.items(): # If a chapter is in quiz_data, it is locked
            total = total_chapters.get(course_name, 0)
            unlocked_chapters = total - locked_chapters # For each course, we determine the number of unlocked chapters
            outlist.append({
                "course_name": course_name,
                "unlocked_chapters": unlocked_chapters,
                "total_chapters": total
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


class DeleteCourse(APIView):
    """
    GET /api/cours/DeleteCourse
    Takes: lesson_name
    Returns: lesson_type, chapter names listed
    """
    def get(self, request):

        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        course_name = request.GET.get('course_name')
        if not course_name:
            return Response({"error": "course_name parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Obtain the nature of the course (public or private) from the DB; 
        course = find_documents_fields(
            "Cours",
            query={"nom_cours": course_name},
            fields=["_id", "id_auteur", "public"]
        )

        if not course:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        course = course[0]
        course_id = course["_id"]
        is_public = course['public']
        is_owner = str(user_id) == str(course['id_auteur'])

        # Obtain the list of chapter names [public]. 
        chapters = find_documents_fields(
            "Chapitres",
            query={"id_cours": ObjectId(course_id)},
            fields=["nom_chapitre", "_id"]
        )

        #Return all information on the nature of the course and the list of course chapters.
        if not chapters:
            return Response({"error": "No chapters found for this course."}, status=status.HTTP_404_NOT_FOUND)

        # if the authenticated user is the owner, replace the Course owner with ‘none’. 
        if(is_owner):
            modified = update_document(
                "Cours",
                {"_id": ObjectId(course_id)},  # Adapte selon le type de course_id
                {"id_auteur": None}            # ou "none"
            )
        else:
            # If the authenticated user is not the owner
            # deletion of its name from the ‘Subscriber’ table; 
            delete_document(
                "Souscriveur",
                {"id_cours": ObjectId(course_id), "id_user": ObjectId(user_id)}
            )
        
        if(not is_public):
            # Deletion of all the pdfs for the course chapters; 
            for chapter in chapters:
                chapter_id = chapter["_id"]
                chapter_name = chapter["nom_chapitre"]
                pdf_path = f"files/{course_name}/{chapter_name}.pdf"
                try:
                    os.remove(pdf_path)
                    delete_document(
                        "Chapitres",
                        {"_id": ObjectId(chapter_id)}
                    )
                except FileNotFoundError:
                    pass
            # Deletion of all the entries for this course from the DB;
            delete_document(
                "Cours",
                {"_id": ObjectId(course_id)}
            )

            # TODO : appel API à l'endpoint de suppression des cartes liées au cours
            # Exemple d'appel fictif :
            # requests.delete(f"http://api-decks/delete-cards-by-course/{course_id}")
            # (À implémenter selon ton architecture)


        # Return information on the nature of the course and the list of course chapters
        return Response(
            {
                "course_name": course_name,
                "is_public": is_public,
                "chapters": [chapter["nom_chapitre"] for chapter in chapters]
            },
            status=status.HTTP_200_OK
        )
