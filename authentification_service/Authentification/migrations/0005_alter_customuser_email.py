# Generated by Django 5.2 on 2025-06-19 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Authentification", "0004_alter_customuser_email_alter_customuser_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
