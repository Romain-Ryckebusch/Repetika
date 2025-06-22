from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("api/quiz/", include("Quiz.urls")),
]

