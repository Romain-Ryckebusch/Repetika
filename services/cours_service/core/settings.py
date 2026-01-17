from pathlib import Path
from repetika_common.settings_base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ug*a&%=rgy2wu4o2(k+vt88+rwiauwj8c%zn(lbk^3h1#la+41'

INSTALLED_APPS += [
    'Cours',
]

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

