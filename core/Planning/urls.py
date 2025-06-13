from django.urls import path
from .views import *

urlpatterns = [
    path('firstPlanChapter', FirstPlanChapter.as_view(), name='first_plan_chapter'),
    path('scheduleNextReviews', ScheduleNextReviews.as_view(), name='schedule_next_reviews'),
    path('cardsToday', CardsToday.as_view(), name='cards_today'),
    path('cardsReviewedToday', CardsReviewedToday.as_view(), name='cards_reviewed_today'),
    path('unScheduleCards', UnScheduleCards.as_view(), name='unschedule_cards'),
]