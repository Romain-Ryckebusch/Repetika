from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("", include("MainServer.urls")),
    path("api/cours/", include("Cours.urls")),
    path("api/quiz/", include("Quiz.urls")),
    path("api/decks/", include("Decks.urls")),
    path("api/planning/", include("Planning.urls")),
    path("api/learning-session/", include("SeanceApprentissage.urls")),
    path("api/main/", include("MainServer.urls")),
    path("api/auth/", include("Authentification.urls")),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

