from django.urls import path
from .views import GetChapter, GetPDF

urlpatterns = [
    path('getchapter/', GetChapter.as_view()),
    path('getpdf/', GetPDF.as_view()), # Q: what is a regex to select two hash signs, a space, and any number of letters? A: r'^##\s*[a-zA-Z]*$'
]