from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase


class AuthViewTests(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        # names come from Authentification/urls.py
        self.register_url = reverse("register/")
        self.login_url = reverse("login/")
        self.delete_url = reverse("delete/")
        self.get_infos_url = reverse("getInfos/")

    # ---------- Register ----------

    def test_register_missing_password_returns_400(self):
        payload = {"username": "user1"}
        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_register_success_creates_user_and_returns_tokens(self):
        payload = {
            "username": "user2",
            "password": "strong-password",
            "email": "user2@example.com",
        }
        response = self.client.post(self.register_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User created successfully")
        self.assertIn("user_id", response.data)
        self.assertIn("tokens", response.data)
        self.assertTrue(
            self.User.objects.filter(username="user2").exists()
        )

    # ---------- Login ----------

    def test_login_invalid_credentials_returns_401(self):
        # no user created -> credentials are invalid
        payload = {
            "username": "unknown",
            "password": "wrong",
        }
        response = self.client.post(self.login_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)

    def test_login_success_returns_tokens(self):
        user = self.User.objects.create_user(
            username="user3",
            password="password123",
        )
        payload = {
            "username": "user3",
            "password": "password123",
        }
        response = self.client.post(self.login_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logged in")
        self.assertEqual(response.data["user_id"], user.id)
        self.assertIn("tokens", response.data)

    # ---------- GetInfos ----------

    def test_get_infos_without_id_user_returns_400(self):
        response = self.client.get(self.get_infos_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_get_infos_with_valid_id_returns_user_data(self):
        user = self.User.objects.create_user(
            username="user4",
            password="password123",
            email="user4@example.com",
        )
        response = self.client.get(self.get_infos_url, {"id_user": user.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)
        self.assertEqual(response.data["email"], user.email)

    # ---------- Delete ----------

    def test_delete_authenticated_user_deletes_account(self):
        user = self.User.objects.create_user(
            username="user5",
            password="password123",
        )

        # DRF shortcut: bypass JWT and directly mark request as authenticated
        self.client.force_authenticate(user=user)

        response = self.client.delete(self.delete_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User account deleted successfully.")
        self.assertFalse(self.User.objects.filter(pk=user.pk).exists())
