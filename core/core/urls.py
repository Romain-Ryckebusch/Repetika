from django.urls import include, path

urlpatterns = [
    path("", include("MainServer.urls")),
    path("api/cours/", include("Cours.urls")),
    path("api/quiz/", include("Quiz.urls")),
    path("api/decks/", include("Decks.urls")),
    path("api/planning/", include("Planning.urls")),
<<<<<<< HEAD
    path("api/learning_session/", include("SeanceApprentissage.urls")),
=======
    path("api/learning-session", include("SeanceApprentissage.urls")),
>>>>>>> 9a30bbdee3c329b4ccdf60033a414858dfbe8f05
]

