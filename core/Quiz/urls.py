from django.urls import path
from .views import *

urlpatterns = [
    path('getLockedChapters/', GetLockedChapters.as_view(), name='get_locked_chapters'),
    path("completeQuiz/", CompleteQuiz.as_view(), name="complete_quiz"),
]