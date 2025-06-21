import json
import requests
import os
from core.settings import *
from datetime import datetime

from django.http import HttpResponse, JsonResponse, FileResponse
from django.utils import timezone
from django.utils.timezone import make_aware

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.shared_modules.mongodb_utils import *

from PyPDF2 import PdfMerger
from PyPDF2 import PdfReader, PdfWriter

from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED

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

class GetCourseChapters(APIView):
    """ GET /api/LireCours/getCourseChapters
    Takes user_id, id_course
    Returns List of chapters (id_chapitre, nom_chapitre, date_creation, is_unlocked, is_finished, chemin_pdf)
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        id_course = request.GET.get('id_course')
        if not id_course:
            return Response(
                {"error": "id_course parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        # Get the chapters for the course
        chapters = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"id_cours": ObjectId(id_course)},
            fields=["_id", "nom_chapitre", "position","chemin_pdf"]
        )
        id_deck = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_course)},
            fields=["id_deck"]
        )[0]["id_deck"]
        print("chapters : ", chapters)
        chapters.sort(key=lambda x: x.get("position", float("inf")))
        print("sorted chapters : ", chapters)

        # Prepare the response data
        response_data = []
        for chapter in chapters:
            id_chapter= str(chapter["_id"])
            is_finished = not (requests.get(QUIZ_BASE_URL + "/doesQuizExist", params={"user_id":user_id, "id_chapitre":id_chapter, "id_deck":id_deck}).json().get("isQuizExisting", False))
            if chapter["position"] == 0:
                is_unlocked = True # The first chapter of a course is always unlocked
            else: 
                is_unlocked = response_data[-1]["is_finished"]
            response_data.append({
                "id_chapitre": id_chapter,
                "nom_chapitre": chapter["nom_chapitre"],
                "position": chapter["position"],
                "is_unlocked": is_unlocked,
                "is_finished": is_finished,
                "chemin_pdf":chapter["chemin_pdf"]
            })
        
        last_element = response_data[-1]
        last_element["is_finished"] = not (requests.get(QUIZ_BASE_URL + "/doesQuizExist", params={"user_id":user_id, "id_chapitre":last_element["id_chapitre"], "id_deck":id_deck}).json().get("isQuizExisting", False))

        return Response(response_data, status=status.HTTP_200_OK)

class GetFullPDF(APIView):
    """
    GET /api/cours/getPDF
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
        
        id_course = request.GET.get('id_course')
        if not id_course:
            return Response(
                {"error": "id_course parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(COURS_BASE_URL + "/getCourseChapters", params={
                "user_id": user_id,
                "id_course":id_course
            })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to get-cartes"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        list_chapter=response.json()
        merger = PdfMerger()
        missing_files = []
        list_chapter.sort(key=lambda c: c['position']) #on trie la liste des chapitres
        
        for chapter in list_chapter:
            if chapter["is_unlocked"]:

                path = os.path.join(chapter["chemin_pdf"])
                if os.path.exists(path):
                    merger.append(path)
                else:
                    missing_files.append(chapter["nom_chapitre"])

        if not merger.pages:
            return Response({"error": "Aucun PDF valide à assembler."}, status=status.HTTP_404_NOT_FOUND)
        
        os.makedirs("cours_pdf", exist_ok=True)
        output_path = os.path.join("cours_pdf", "HistoriqueGetPDF.pdf")
        with open(output_path, "wb") as f_out:
            merger.write(f_out)

        merger.close()

        response = FileResponse(open(output_path, "rb"), as_attachment=True, filename="HistoriqueGetPDF.pdf")

        if missing_files:
            response["pdf_manquants"] = ",".join(missing_files)

        return response
    

    
class GetPDF(APIView):
    """
    GET /api/cours/getPDF
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
        
        id_course = request.GET.get('id_course')
        if not id_course:
            return Response(
                {"error": "id_course parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(COURS_BASE_URL + "/getCourseChapters", params={
                "user_id": user_id,
                "id_course":id_course
            })
        if response.status_code != 200:
            return Response(
                {"error": "Failed to get-cartes"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        list_chapter=response.json()
        merger = PdfMerger()
        pdfs_manquants = []
        list_chapter.sort(key=lambda c: c['position']) #on trie la liste des chapitres
        zip_buffer = BytesIO()
        
        with ZipFile(zip_buffer, "w", compression=ZIP_DEFLATED) as zf:
            for chapter in list_chapter:
                if chapter["is_unlocked"]:
                    chapter_path = os.path.join(chapter["chemin_pdf"])
                    if os.path.exists(chapter_path):
                        nom = f"{chapter['position']:02d}-{chapter['nom_chapitre']}.pdf"  #on ajoute le numéro du chapitre sur 2 chiffre(01,02,..)
                        zf.write(chapter_path, arcname=nom)
                    else:
                        pdfs_manquants.append(chapter["nom_chapitre"])

        if zip_buffer.tell() == 0:
            return Response({"error": "Aucun chapitre PDF trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        zip_buffer.seek(0)
        resp = FileResponse(
            zip_buffer,
            as_attachment=True,
            filename=f"cours_{id_course}.zip",
            content_type="application/zip"
        )
        if pdfs_manquants:
            resp["pdfs_manquants"] = ",".join(pdfs_manquants)
        return resp


class UploadPDF(APIView):
    """
    POST /api/ajout-cours/
    All fields of metadata and metadata itself are optional 
    takes: pdf,
           metadata={
                    "course_name":"name",
                    "chapters": [
                        ["name_chapter1", length1],
                        ["name_chapter1", length2], ...
                        ],
                    "author_id":ObjectId('id'),         #remplacer id par un id valide ex: 68386a41ac5083de66afd675
                    "name_author":"name_author",
                    "id_deck":ObjectId('id'),           #si un id est donné il est rataché au cours et sinon un deck est créé
                    "matiere":"Informatique",
                    "public":false,                      #or true
                    "tags":[]
                    }

    return: id_cours, id_chapitres (a list of ids), id_deck
    """
    parser_classes = [MultiPartParser]
    def get(self, request):
        return Response({'message': 'Use POST to upload a file.'})

    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf')
        metadata = request.data.get('metadata')
        list_pdf=[]

        if not pdf_file:
            return Response({"error": "Missing PDF"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not metadata:
            metadata_json={}
        else:
            try:
                metadata_json = json.loads(metadata)
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON in metadata"}, status=status.HTTP_400_BAD_REQUEST)
            
        #on interprète metadata et on complète les info n'ayant pas été transmises           
        if 'course_name' not in metadata_json or not metadata_json['course_name']:
            nom_cours='default_name'
        else:
            nom_cours=metadata_json['course_name']

        if 'author_id' not in metadata_json or not metadata_json['author_id']:
            id_auteur=ObjectId('68386a41ac5083de66afd675')                      #utilisateur test
        else:
            id_auteur=metadata_json['user_id']

        if 'name_author' not in metadata_json or not metadata_json['name_author']:
            name_author=''                                   
        else:
            name_author=metadata_json['name_author'] + '/'

        if 'tags' not in metadata_json or not metadata_json['tags']:
            tags=[]                         
        else:
            tags=metadata_json['tags']

        if 'id_deck' not in metadata_json or not metadata_json['id_deck']:      #on crée un deck
            id_deck=self.crer_deck(id_auteur,nom_cours,tags)                        
        else:
            id_deck=metadata_json['id_deck']

        if 'matiere' not in metadata_json or not metadata_json['matiere']:
            matiere=''                                          
        else:
            matiere=metadata_json['matiere'] + '/'

        if 'public' not in metadata_json or not metadata_json['public']:
            public='false'                                          
        else:
            public=metadata_json['public']
        
        if 'chapters' not in metadata_json or not metadata_json['chapters']:#on crée les pdf si il n'y a pas de chapitres
            path='cours_pdf/'+name_author + matiere + nom_cours +".pdf"
            list_pdf=[(nom_cours,path)]
            os.makedirs(os.path.dirname(path), exist_ok=True)
            reader = PdfReader(pdf_file)
            writer = PdfWriter()
            writer.append_pages_from_reader(reader)
            with open(path, "wb") as f_out:
                writer.write(f_out)
        
        else:                                                                #on crée les pdf pour les differents chapitres
            list_chapter=metadata_json['chapters']
            reader = PdfReader(pdf_file)
            total_pages = len(reader.pages)
            current=0
            
            for (title,length) in list_chapter:
                path='cours_pdf/'+name_author + matiere + nom_cours +'/'+ title +".pdf"
                os.makedirs(os.path.dirname(path), exist_ok=True)             #on cree les sous dossiers

                writer = PdfWriter()
                end_page = current + length - 1
                
                if end_page >= total_pages:
                    end_page = total_pages - 1
                start_page=current
                
                for page_num in range(start_page, end_page + 1):
                    writer.add_page(reader.pages[page_num])
                    current+=1
                with open(path, "wb") as f_out:
                    writer.write(f_out)
                list_pdf.append((title,path))

        #update bdd:
        #ajout du cours
        chemin_dossier='cours_pdf/'+name_author + matiere + nom_cours
        date_creation=make_aware(datetime.now())

        document = {
                "id_auteur": ObjectId(id_auteur),
                "id_deck": ObjectId(id_deck),
                "chemin_dossier": chemin_dossier,
                "public": public,
                "date_creation": date_creation,
                "nom_cours": nom_cours,
                }
        id_cours = insert_document("DB_Cours", "Cours", document)

        #ajout des chapitres 
        id_chapitres=[]
        for i,chapitre in enumerate(list_pdf):
            nom_chapitre=chapitre[0]
            chemin_pdf=chapitre[1]
            document = {
                    "id_cours": id_cours,
                    "nom_chapitre": nom_chapitre,
                    "position": i,
                    "chemin_pdf": chemin_pdf
                    }
            id_chapitre=insert_document("DB_Cours", "Chapitres", document)
            id_chapitres.append(id_chapitre)
        
        data={"id_cours":str(id_cours), 
              "id_chapitres":[str(x) for x in id_chapitres], 
              "id_deck":str(id_deck)
        }

        return Response(data, status=status.HTTP_200_OK)
    
    def crer_deck(self,id_auteur,nom_cours,tags):
        id_user = id_auteur
        nom_deck = nom_cours
        
        response = requests.get(DECKS_BASE_URL + "/createDeck", params={
                "user_id": ObjectId(id_user),
                "nom_deck":nom_deck,
                "tags":tags
            })
        if response.status_code == 200:
            response_json=response.json()
            return response_json["id_deck"]
        else:
            return ObjectId('68386a41ac5083de66afd675') #id deck test



class GetAccessibleCourses(APIView):
    """
    GET /api/cours/GetAccessibleCourses
    Takes user_id
    Returns list of accessible (owned + subscribed) courses for the user (id_cours, nom_cours, date_creation)
    """
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the courses owned by the user
        owned_courses = find_documents_fields(
            "DB_Cours",
            "Cours",
            query={"id_auteur": ObjectId(user_id)},
            fields=["_id", "nom_cours", "date_creation","id_deck"]
        )
        
        # Get the courses the user is subscribed to
        subscribed_courses = find_documents_fields(
            "DB_Cours",
            "Souscriveur",
            query={"id_user": ObjectId(user_id)},
            fields=["id_cours"]
        )
        
        # Extract course IDs from subscribed courses
        subscribed_course_ids = [str(course["id_cours"]) for course in subscribed_courses]
        
        # Combine owned and subscribed courses
        accessible_courses = []
        for course in owned_courses:
            accessible_courses.append({
                "id_cours": str(course["_id"]),
                "nom_cours": course["nom_cours"],
                "date_creation": course["date_creation"].isoformat() if course["date_creation"] else None,
                "id_deck":course["id_deck"],
                "owned": True,
                "subscribed": False
            })
        
        for course_id in subscribed_course_ids:
            if not any(course["id_cours"] == course_id for course in accessible_courses):
                accessible_courses.append({
                    "id_cours": course_id,
                    "nom_cours": None,  # Course name not available in subscription data
                    "date_creation": None,  # Creation date not available in subscription data
                    "id_deck":None,
                    "owned": False,
                    "subscribed": True
                })

        cards_today = requests.get(PLANNING_BASE_URL + "/cardsToday", params={"user_id": user_id})
        if cards_today.status_code != 200:
            return Response(
                {"error": "Failed to retrieve cards for today. details: " + cards_today.text},
                status=cards_today.status_code
            )
        cards_today_data = cards_today.json()
        # Get the course corresponding to each card from the database (cards_today_data only contains id_chapitre, so we have to find the corresponding id_cours from the Chapitre table)


        card_list = requests.get(
            DECKS_BASE_URL + "/getCardsFromID",
            params={"card_ids": [card["id_card"] for card in cards_today_data]}
        ).json()
        # Add id_chapitre to each card in cards_today_data
        for i in range(len(cards_today_data)):
            cards_today_data[i]["id_chapitre"] = card_list[i]["id_chapitre"]  # Add id_chapitre to each card in cards_today_data

        chapters = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"_id": {"$in": [ObjectId(card["id_chapitre"]) for card in cards_today_data]}},  # Use the id_chapitre from cards_today_data
            fields=["_id", "id_cours"]
        )

        # Mapping chapitre → cours
        course_ids = {str(ch["_id"]): str(ch["id_cours"]) for ch in chapters}

        # Count the number of cards for each course
        course_card_count = {}
        for card in cards_today_data:
            id_chapitre = card.get("id_chapitre")
            if str(id_chapitre) in course_ids:
                course_id = course_ids[str(id_chapitre)]
                if course_id not in course_card_count:
                    course_card_count[course_id] = 0
                course_card_count[course_id] += 1
        # Prepare the final response with course information and card counts
        for course in accessible_courses:
            course_id = str(course["id_cours"])
            course["cards_today"] = course_card_count.get(course_id, 0)

        
        return Response(accessible_courses, status=status.HTTP_200_OK)


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
            fields=["_id", "nom_cours", "id_deck"]
        )
        if not course:
            return Response({"error": "Course not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)
        course = course[0]

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


        # Delete the course
        delete_count = delete_document(
            "DB_Cours",
            "Cours",
            query={"_id": ObjectId(id_lesson), "id_auteur": ObjectId(user_id)}
        )
        if delete_count == 0:
            return Response({"error": "Failed to delete course."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(
            {"message": "Course deleted successfully."},
            status=status.HTTP_200_OK
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

class GetCourseIDFromChapterID(APIView):
    """
    Get /api/Decks/getCourseIDFromChapterID
    Takes chapter_ids one or multiple times in the request
    Returns dict ID_Chapitre->ID_Cours
    """
    def get(self, request):
        chapter_ids = request.GET.getlist('chapter_ids')
        if not chapter_ids:
            return Response(
                {"error": "chapter_ids parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        #print("card ids : ",chapter_ids)
        # Convert chapter_ids to ObjectId
        chapter_ids = [ObjectId(id_chapitre) for id_chapitre in chapter_ids]
        # Find all cards with the given IDs
        coursesID = find_documents_fields(
            "DB_Cours",
            "Chapitres",
            query={"_id": {"$in": chapter_ids}},
            fields=["_id","id_cours"]
        )
        result = {item["_id"]: item["id_cours"] for item in coursesID}
        return Response(
            result,
            status=status.HTTP_200_OK
        )