from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("", include("MainServer.urls")),
    path("api/main/", include("MainServer.urls"))
]

