from django.urls import path
from .views import *

urlpatterns = [
    path('getLockedChapters/', GetLockedChapters.as_view(), name='get_locked_chapters'),
    path("completeQuiz/", CompleteQuiz.as_view(), name="complete_quiz"),
    path("getQuiz/", GetQuiz.as_view(), name="get_quiz"),
    path("removeQuiz/", RemoveQuiz.as_view(), name="remove_quiz"),
    path('doesQuizExist/', DoesQuizExist.as_view(), name='does_quiz_exist')
]