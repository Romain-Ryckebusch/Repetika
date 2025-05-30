from django.urls import path
from .views import GetChapter, GetPDF,UploadAPIView, DeleteCourse

urlpatterns = [
    path('getChapter', GetChapter.as_view()),
    path('getPDF', GetPDF.as_view()),
    path('ajout-cours', UploadAPIView.as_view(), name='ajout-cours'),
    path('deleteCourse', DeleteCourse.as_view()),
]