from django.urls import include, path

urlpatterns = [
    path("", include("services.TimeService.app.urls")),
    path("", include("services.MainServer.app.urls")),
    path("", include("services.Cours.app.urls")),
]

