from django.urls import path
from .views import GetCartes,SendPlanification

urlpatterns = [
    path('get-cartes/', GetCartes.as_view(), name='get-cartes/'),
    path('send-planification/', SendPlanification.as_view(), name='send-planification'),


]
