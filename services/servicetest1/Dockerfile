# services/servicetest1/Dockerfile

# 1. Base image
FROM python:3.11-slim

# 2. Prevent Python buffering logs
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app:/app/services/servicetest1/app

# 3. Set working directory
WORKDIR /app

COPY services/servicetest1/requirements.txt ./requirements.txt
COPY core                       ./core
COPY core/core/requirements.txt ./core-requirements.txt
# 4. Copy & install requirements
COPY services/servicetest1/requirements.txt ./
RUN pip install --upgrade pip \
 && pip install --no-cache-dir \
        -r requirements.txt \
        -r core-requirements.txt

# 5. Copy in the shared core code and this service’s app
COPY services/servicetest1/app  ./app

# 6. Move into the Django project
WORKDIR /app/core

# 7. Ensure Python can import core/ and the service app
ENV PYTHONPATH=/app/core
ENV DJANGO_SETTINGS_MODULE=core.settings

EXPOSE 8000

# 9. Default command: run Gunicorn binding on port 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

