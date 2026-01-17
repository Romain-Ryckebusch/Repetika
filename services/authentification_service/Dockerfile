FROM python:3.11-slim

RUN groupadd -r user-app && useradd -r -g user-app -u 1000 user-app

COPY common/ /common/
WORKDIR /app

COPY services/authentification_service/requirements.txt .

RUN python -m venv /venv \
 && /venv/bin/pip install --no-cache-dir -r requirements.txt \
 && chown -R user-app:user-app /venv
 
RUN /venv/bin/pip install --no-cache-dir -e /common


COPY --chown=user-app:user-app services/authentification_service/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY --chown=user-app:user-app services/authentification_service/entrypoint.sh services/authentification_service/entrypoint.sh
RUN chmod +x services/authentification_service/entrypoint.sh

USER user-app

ENV PATH="/venv/bin:$PATH"

EXPOSE 8000

CMD ["/app/services/authentification_service/entrypoint.sh"]
