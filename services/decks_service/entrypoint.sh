#!/bin/sh
/venv/bin/python /app/manage.py migrate --noinput
/venv/bin/python /app/manage.py runserver 0.0.0.0:8000
