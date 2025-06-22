from django.urls import path
from .views import *

urlpatterns = [
    path('getCardsChapter', GetCardsChapter.as_view(), name='get_cards_chapter'),
    path('getCardsFromID', GetCardsFromID.as_view(), name='get_cards_from_id'),
    path('getDeckNames', GetDeckNames.as_view()),
    path('addCards', addCards.as_view()),
    path('deleteCards', DeleteCards.as_view()),
    path('deleteDeck', DeleteDeck.as_view()),
    path('deleteCardsChapter', DeleteCardsChapter.as_view()),
]