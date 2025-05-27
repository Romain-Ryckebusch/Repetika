from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from PyPDF2 import PdfMerger

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

        merger = PdfMerger()
        
        # Get the pdfs from the paths;
        for pdf_path in pdf_paths:
            # merge the pdfs in the indicated order; 
            merger.append(pdf_path)

        # Save the merged pdf to a temporary file
        merged_pdf_path = "/path/to/merged_course.pdf"
        merger.write(merged_pdf_path)
        merger.close()
        
        return Response(merged_pdf_path, status=status.HTTP_200_OK)
