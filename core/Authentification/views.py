from core.settings import *
from core.shared_modules.mongodb_utils import *
from .utils import *

from django.contrib.auth import authenticate, login, logout

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import CustomUser

class Register(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # maybe the password should be hashed before coming here... maybe.
        email = request.data.get('email', '')
        avatar_url = request.data.get('avatar_url', '')
        preferences_json = request.data.get('preferences_json', '{}')

        if not username or not password:
            return Response(
                {"error": "username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CustomUser.objects.create_user(username=username, password=password, email=email)
        user.avatar_url = avatar_url
        user.preferences_json = preferences_json
        user.save() # God bless django

        # Automatically log in the user after registration
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "message": "User created successfully",
                "user_id": user.id,
                "tokens": tokens
            },
            status=status.HTTP_201_CREATED
        )


class Delete(APIView):
    # Deletes the user account of the currently authenticated user.
    permission_classes = [IsAuthenticated]
    # if the user is not authenticated, the request will be denied a priori.

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "User account deleted successfully."}, status=status.HTTP_200_OK)


class Login(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Both username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=username, password=password)
        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                "message": "Logged in",
                "user_id": user.id,
                "tokens": tokens
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid password or username."}, status=status.HTTP_401_UNAUTHORIZED)


# No logout ?
#
# It's not needed, since the user is authenticated via tokens.
# To log out, simply delete the token from the client side.
# Once again, God bless Django, React Native, and the America.
#