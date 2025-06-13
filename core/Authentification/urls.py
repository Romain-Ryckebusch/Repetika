from django.urls import path
from .views import*

urlpatterns = [
    path('register/', Register.as_view(), name='register/'),
    path('delete/', Delete.as_view(), name='delete/'),
    path('login/', Login.as_view(), name='login/'),
]
