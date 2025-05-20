from django.urls import include, path

urlpatterns = [
    path("", include("TimeService.urls")),
    path("", include("MainServer.urls")),
]

