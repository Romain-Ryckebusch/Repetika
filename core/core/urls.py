from django.urls import include, path

urlpatterns = [
    path("", include("MainServer.urls")),
    path("api/cours/", include("Cours.urls")),
    #path("", include("SeanceApprentissage.urls")),
]

