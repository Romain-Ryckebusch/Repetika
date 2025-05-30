import requests
from django.conf import settings
from datetime import datetime

def fetch_remote_datetime():
    """
    Calls App2's endpoint and returns a Python datetime.
    """
    url = settings.SERVICETEST1_BASE_URL.rstrip('/') + '/api/current-datetime/'
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
    payload = resp.json()
    return datetime.fromisoformat(payload['current_datetime'])
