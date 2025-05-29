from django.urls import include, path

urlpatterns = [
    path("", include("MainServer.urls")),
    path("cours/", include("Cours.urls")),
]

