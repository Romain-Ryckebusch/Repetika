from django.urls import include, path

urlpatterns = [
    path("", include("servicetest1.urls")),
    path("", include("MainServer.urls")),
]

