from django.urls import path
from .views import CurrentDateTimeView

urlpatterns = [
    path('api/current-datetime/', CurrentDateTimeView.as_view(), name='current-datetime'),
]
