from django.test import TestCase
from django.contrib.auth import get_user_model

from Authentification.utils import get_tokens_for_user


class TokenUtilsTests(TestCase):
    def setUp(self):
        self.User = get_user_model()

    def test_get_tokens_for_user_returns_access_and_refresh(self):
        user = self.User.objects.create_user(
            username="charlie",
            password="password123",
        )

        tokens = get_tokens_for_user(user)

        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)
        self.assertIsInstance(tokens["access"], str)
        self.assertIsInstance(tokens["refresh"], str)
        self.assertGreater(len(tokens["access"]), 0)
        self.assertGreater(len(tokens["refresh"]), 0)
