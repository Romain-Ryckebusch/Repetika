from pathlib import Path
from repetika_common.settings_base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ug*a&%=rgy2wu4o2(k+vt88+rwiauwj8c%zn(lbk^3h1#la+41'

INSTALLED_APPS += [
    'Planning',
]

BASE_DIR = Path(__file__).resolve().parent.parent

SQLITE_PATH = os.getenv("SQLITE_PATH")
if SQLITE_PATH:
    db_name = SQLITE_PATH
else:
    db_name = BASE_DIR / "db.sqlite3"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": db_name,
    }
}

