from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

class CurrentDateTimeView(APIView):
    """
    GET /api/current-datetime/
    Returns the server's current datetime in ISO-8601.
    """
    def get(self, request, format=None):
        now = timezone.now()
        return Response({'current_datetime': now.isoformat()})
