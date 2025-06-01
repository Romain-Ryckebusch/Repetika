from django.urls import path
from .views import *

urlpatterns = [
    path('firstPlanChapter', FirstPlanChapter.as_view(), name='first_plan_chapter'),
    path('scheduleNextReviews', ScheduleNextReviews.as_view(), name='schedule_next_reviews'),
]