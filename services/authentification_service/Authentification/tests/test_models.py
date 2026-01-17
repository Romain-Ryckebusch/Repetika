from django.test import TestCase
from django.contrib.auth import get_user_model


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

    def test_str_returns_username(self):
        user = self.User.objects.create_user(
            username="alice",
            password="password123",
            email="alice@example.com",
        )
        self.assertEqual(str(user), "alice")

    def test_custom_user_uses_mongo_like_string_id(self):
        user = self.User.objects.create_user(
            username="bob",
            password="password123",
        )
        # id is the primary key, defined as CharField with ObjectId-like default
        self.assertIsInstance(user.id, str)
        self.assertEqual(len(user.id), 24)
