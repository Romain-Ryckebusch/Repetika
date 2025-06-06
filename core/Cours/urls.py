from django.urls import path
from .views import *

urlpatterns = [
    path('getChapter', GetChapter.as_view()),
    path('getPDF', GetPDF.as_view()),
    path('ajout-cours', UploadAPIView.as_view(), name='ajout-cours'),
    path('deleteCourse', DeleteCourse.as_view()),
    path('shareCourse', ShareCourse.as_view()),
    path('showAllSharedCourses', ShowAllSharedCourses.as_view()),
    path('addToSubscribers', AddToSubscribers.as_view()),
    path('deleteChapter', DeleteChapter.as_view()),

]