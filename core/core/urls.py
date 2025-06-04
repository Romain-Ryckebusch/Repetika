from django.urls import include, path

urlpatterns = [
    path("", include("MainServer.urls")),
    path("api/cours/", include("Cours.urls")),
    path("api/quiz/", include("Quiz.urls")),
    path("api/decks/", include("Decks.urls")),
    path("api/planning/", include("Planning.urls")),
    path("api/learning-session/", include("SeanceApprentissage.urls")),
    path("api/main/", include("MainServer.urls")),
]

