FROM python:3.11-slim

RUN groupadd -g 1000 user-app && useradd -u 1000 -g 1000 -r -m user-app
WORKDIR /app

COPY services/main_service/requirements.txt .

RUN python -m venv /venv \
 && /venv/bin/pip install --no-cache-dir -r requirements.txt \
 && chown -R user-app:user-app /venv
 
COPY --chown=user-app:user-app services/main_service/ .
COPY services/shared/ /app/shared/

USER user-app

ENV PATH="/venv/bin:$PATH"

EXPOSE 8000