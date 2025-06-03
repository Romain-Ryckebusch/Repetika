from django.urls import path
from .views import *

urlpatterns = [
    path('getDeckNames', GetDeckNames.as_view()),
    path('createCards', CreateCards.as_view()),
]


