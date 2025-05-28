from django.urls import path
from .views import GetChapter, GetPDF

urlpatterns = [
    path('Cours/getChapter/', GetChapter.as_view()),
    path('Cours/getPDF/', GetPDF.as_view()),
    path('api/ajout-cours/', UploadAPIView.as_view(), name='ajout-cours'),
]
