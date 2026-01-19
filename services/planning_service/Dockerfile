FROM python:3.11-slim

RUN groupadd -g 1000 user-app && useradd -u 1000 -g 1000 -r -m user-app

WORKDIR /app

COPY common/ /common/

COPY services/planning_service/requirements.txt .
RUN python -m venv /venv \
 && /venv/bin/pip install --no-cache-dir -r requirements.txt \
 && chown -R user-app:user-app /venv

RUN /venv/bin/pip install --no-cache-dir -e /common

COPY --chown=user-app:user-app services/planning_service /app

USER user-app

ENV PATH="/venv/bin:$PATH"

EXPOSE 8000

CMD ["./entrypoint.sh"]
