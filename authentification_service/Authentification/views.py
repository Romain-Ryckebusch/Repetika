from core.settings import *
from core.shared_modules.mongodb_utils import *
from .utils import *

from django.contrib.auth import authenticate, login, logout

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import CustomUser

#aller sur: "http://127.0.0.1:8000/api/auth/admin/Authentification/customuser/" pour la base de donné, mot de passe de quentin: 123
#aller sur: "http://192.168.49.2:30741/api/authentification/admin/Authentification/customuser/" pour la base de donné, mot de passe de quentin: RepatikaISEN2025

class Register(APIView):
    """
    POST /api/auth/register
    Takes username, password
    Returns success message
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # maybe the password should be hashed before coming here... maybe.
        email = request.data.get('email')
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
        

        user = CustomUser.objects.create_user(username=username, 
                                              password=password, 
                                              email=email or None
                                              )
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

class GetInfos(APIView):
    def get(self, request):
        id_user = request.GET.get('id_user')
        if not id_user:
            return Response({"error": "id_user is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = CustomUser.objects.get(id=id_user)
        
        username = user.username

        

        #return Response({"error": "Invalid password or username."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"username": str(username),"email": user.email}, status=status.HTTP_200_OK)


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required for logout."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": f"Invalid or expired token. {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
class Update(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        username = request.data.get('username')
        email = request.data.get('email', '')
        avatar_url = request.data.get('avatar_url', '')
        preferences_json = request.data.get('preferences_json', '{}')

        if username:
            user.username = username
        if email:
            user.email = email
        if avatar_url:
            user.avatar_url = avatar_url
        if preferences_json:
            user.preferences_json = preferences_json

        user.save()

        return Response(
            {"message": "User updated successfully."},
            status=status.HTTP_200_OK
        )
