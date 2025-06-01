from django.urls import path
from .views import GetLockedChapters

urlpatterns = [
    path('getLockedChapters/', GetLockedChapters.as_view(), name='get_locked_chapters'),
]