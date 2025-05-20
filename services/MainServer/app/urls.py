from django.urls import path
from .views import show_remote_time

urlpatterns = [
    path('remote-time/', show_remote_time, name='show-remote-time'),
]


