from django.urls import path
from .views import *

urlpatterns = [
    path('getChapter', GetChapter.as_view()),
    path('getPDF', GetPDF.as_view()),
    path('ajout-cours', UploadPDF.as_view(), name='ajout-cours'),
    path('deleteCourse', DeleteCourse.as_view()),
    path('shareCourse', ShareCourse.as_view()),
    path('showAllSharedCourses', ShowAllSharedCourses.as_view()),
    path('addToSubscribers', AddToSubscribers.as_view()),
    path('deleteChapter', DeleteChapter.as_view()),
    path('getAccessibleCourses', GetAccessibleCourses.as_view()),
    path('getCourseChapters', GetCourseChapters.as_view()),
    path('getCourseIDFromChapterID', GetCourseIDFromChapterID.as_view()),

]