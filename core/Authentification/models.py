from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    préférences_json = models.JSONField(default=dict, blank=True)

    # AbstractUser a déjà : password (hashé), last_login, date_joined, etc.
    
    def __str__(self):
        return self.username