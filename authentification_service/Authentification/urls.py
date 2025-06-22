from django.urls import path
from .views import*
from django.contrib import admin

urlpatterns = [
    path('register/', Register.as_view(), name='register/'),
    path('delete/', Delete.as_view(), name='delete/'),
    path('login/', Login.as_view(), name='login/'),
    path('admin/', admin.site.urls),
    path('getInfos/', GetInfos.as_view(), name='getInfos/')

]
