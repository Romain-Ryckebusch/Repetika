from django.urls import include, path

urlpatterns = [
    path("", include("yourapp.urls")),
]

