# services/servicetest1/Dockerfile

# 1. Base image
FROM python:3.11-slim

# 2. Prevent Python buffering logs
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app:/app/services/servicetest1/app

# 3. Set working directory
WORKDIR /app

# 4. Copy in the requirements files
COPY services/servicetest1/requirements.txt ./servicetest1-requirements.txt
COPY services/MainServer/requirements.txt ./MainServer-requirements.txt


COPY core/core/requirements.txt ./core-requirements.txt
# & install requirements
RUN pip install --upgrade pip \
 && pip install --no-cache-dir \
        -r servicetest1-requirements.txt \
        -r core-requirements.txt \
        -r MainServer-requirements.txt

# 5. Copy in the shared core code and this service’s app
COPY core                       ./core
COPY services/servicetest1/app  ./core/servicetest1
COPY services/MainServer/app    ./core/MainServer

# 6. Move into the Django project
WORKDIR /app/core

# 7. Ensure Python can import core/ and the service app
ENV PYTHONPATH=/app/core
ENV DJANGO_SETTINGS_MODULE=core.settings

EXPOSE 8000

# 9. Default command: run Gunicorn binding on port 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

