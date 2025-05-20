from django.urls import path
from . import views

urlpatterns = [
    path("now/", views.current_datetime, name="current_datetime"),
]

