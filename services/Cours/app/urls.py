from django.urls import path
from .views import GetChapter, GetPDF

urlpatterns = [
    path('Cours/getChapter/', GetChapter.as_view()),
    path('Cours/getPDF/', GetPDF.as_view()),
]