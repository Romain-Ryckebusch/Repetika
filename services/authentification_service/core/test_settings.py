from .settings import *

# Force SQLite for tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'shared/db.sqlite3',
    }
}