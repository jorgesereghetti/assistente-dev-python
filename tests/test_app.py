import unittest
from fastapi.testclient import TestClient
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        # Create a TestClient for testing FastAPI endpoints
        self.client = TestClient(app)

    def test_static_index_is_served(self):
        """Test that the root URL serves the static index.html containing the app title"""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Coder", response.text)

    def test_missing_api_key_returns_400(self):
        """Test that missing or empty API key in ChatRequest returns HTTP 400 Bad Request"""
        payload = {
            "provider": "openai",
            "model": "gpt-4o",
            "api_key": "",
            "messages": [{"role": "user", "content": "Olá"}]
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Por favor, forneça a chave API", response.json()["detail"])

    def test_unsupported_provider_returns_400(self):
        """Test that an invalid provider in ChatRequest returns HTTP 400 Bad Request"""
        payload = {
            "provider": "invalid_provider",
            "model": "gpt-4o",
            "api_key": "somekey",
            "messages": [{"role": "user", "content": "Olá"}]
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("não suportado", response.json()["detail"])

if __name__ == "__main__":
    unittest.main()
