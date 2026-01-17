from pathlib import Path
from repetika_common.settings_base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ug*a&%=rgy2wu4o2(k+vt88+rwiauwj8c%zn(lbk^3h1#la+41'


INSTALLED_APPS += [
    'django.contrib.admin', 
    'Authentification',
]

AUTH_USER_MODEL = 'Authentification.CustomUser'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "authdb"),
        "USER": os.getenv("POSTGRES_USER", "authuser"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "authpass"),
        "HOST": os.getenv("POSTGRES_HOST", "postgres"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}
