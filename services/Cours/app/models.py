from django.db import models
from django.contrib.postgres.fields import JSONField

class UploadedFile(models.Model):
    file = models.FileField(upload_to='pdfs/')
    metadata = models.JSONField()  
    uploaded_at = models.DateTimeField(auto_now_add=True)
