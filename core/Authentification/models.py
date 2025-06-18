from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from bson import ObjectId


class CustomUser(AbstractUser):
    def generate_mongo_id():
        return str(ObjectId())
        

    email = models.EmailField(unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    préférences_json = models.JSONField(default=dict, blank=True)
    id = models.CharField(
        max_length=24,
        unique=True,
        editable=False,
        default=generate_mongo_id(),
        primary_key=True
    )
    

    # AbstractUser a déjà : password (hashé), last_login, date_joined, etc.
    
    def __str__(self):
        return self.username