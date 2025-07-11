# Generated by Django 5.2 on 2025-06-19 21:51

import Authentification.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Authentification", "0003_alter_customuser_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="id",
            field=models.CharField(
                default=Authentification.models.CustomUser.generate_mongo_id,
                editable=False,
                max_length=24,
                primary_key=True,
                serialize=False,
                unique=True,
            ),
        ),
    ]
