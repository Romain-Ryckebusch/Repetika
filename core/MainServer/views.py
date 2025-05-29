from django.shortcuts import render
from .services import fetch_remote_datetime

def show_remote_time(request):
    try:
        remote_dt = fetch_remote_datetime()
    except Exception as e:
        remote_dt = None
        error = str(e)
    else:
        error = None

    return render(request, 'remote_time.html', {
        'remote_datetime': remote_dt,
        'error': error,
    })
