from django.urls import path
from .views import *

urlpatterns = [
    path('start-session', DébutSéanceRévision.as_view()),
    path('update-session', updateSéanceRévision.as_view()),
    
    path('getDeckNames', GetDeckNames.as_view()),
    path('createCards', CreateCards.as_view()),
    path('getDeckNames', GetDeckNames.as_view()),
    path('createCards', CreateCards.as_view()),
    path('deleteCourse', DeleteCourse.as_view()),
    path('getAccessibleCourses', GetAccessibleCourses.as_view()),
    path('getCourseChapters', GetCourseChapters.as_view()),
    path('ajout-cours', UploadPDF.as_view()),
    path('completeQuiz', CompleteQuiz.as_view()),
    path('doesQuizExist', DoesQuizExist.as_view()),
    path('showAllSharedCourses', ShowAllSharedCourses.as_view()),
    path('addToSubscribers', AddToSubscribers.as_view()),
    path('cardsReviewedToday', CardsReviewedToday.as_view()),

    # AUTHENTIFICATION URLs
    path('register', UserRegister.as_view()),
    path('deleteAccount', UserDelete.as_view()),
    path('login', UserLogin.as_view()),
    path('logout', UserLogout.as_view()),
    path('updateProfile', UserUpdateProfile.as_view()),
]

