import json
import requests

from django.http import HttpResponse, JsonResponse
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from PyPDF2 import PdfMerger
from pypdf import PdfReader, PdfWriter

from .models import UploadedFile
from .serializers import UploadedFileSerializer



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
        quiz_data = {"Mathématiques": 2, "Informatique": 5} # Numbers of locked chapters for each course
        # get this from the Quiz service later
        
        # Subtract the total number of chapters by this value to obtain the number of chapters unlocked;
        total_chapters = {
            "Mathématiques": 5,
            "Informatique": 6
        } # Get those numbers from the database later

        outlist = []
        for course_name, locked_chapters in quiz_data.items():
            total = total_chapters.get(course_name, 0)
            unlocked_chapters = total - locked_chapters
            outlist.append({
                "course_name": course_name,
                "unlocked_chapters": unlocked_chapters,
                "total_chapters": total
            })

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
            pdf_paths.append(f"/path/to/{course_name}/{chapter_name}.pdf")

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


