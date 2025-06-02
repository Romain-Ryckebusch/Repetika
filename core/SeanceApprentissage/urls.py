from django.urls import path
from .views import GetCartes,SendPlanification

urlpatterns = [
    path('api/list-cartes/', GetCartes.as_view(), name='list-cartes'),
    path('api/send-planification/', SendPlanification.as_view(), name='send-planification'),


]
