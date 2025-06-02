from django.urls import path
from .views import *

urlpatterns = [
    path('getCardsChapter', GetCardsChapter.as_view(), name='get_cards_chapter'),
    path('getCardsFromID', GetCardsFromID.as_view(), name='get_cards_from_id'),
]