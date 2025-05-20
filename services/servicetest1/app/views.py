from django.shortcuts import render
from django.utils import timezone   # honours TIME_ZONE and USE_TZ in settings


def current_datetime(request):
    """Return an HTML page with the current date-time."""
    context = {"now": timezone.localtime()}   # convert to project’s local TZ
    return render(request, "current_datetime.html", context)
