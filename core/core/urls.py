from django.urls import include, path

urlpatterns = [
    path("", include("MainServer.app.urls")),
    path("", include("TimeService.app.urls")),
    path("", include("Cours.app.urls")),
]

