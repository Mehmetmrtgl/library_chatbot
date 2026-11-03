# tests/conftest.py
# Model, FAISS ve embedding modüllerini sahte modüllerle değiştirir;
# böylece testler GPU, Ollama veya vektör veritabanı olmadan çalışır.
import sys
import types

import pytest


def _stub(name, **attrs):
    module = types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


_stub("scripts.model_inference", generate_answer=lambda *args, **kwargs: "stub-answer")
_stub("scripts.faiss_utils", get_similar_questions=lambda *args, **kwargs: [])
_stub(
    "app.chat.utils",
    answer_user_question=lambda *args, **kwargs: {"answer": "stub-answer"},
    normalize_input=lambda text: text,
)


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    monkeypatch.setenv("ADMIN_USERNAME", "admin")
    monkeypatch.setenv("ADMIN_PASSWORD", "correct-password")
    for var, value in {
        "DB_USER": "u", "DB_PASSWORD": "p", "DB_HOST": "localhost", "DB_PORT": "5432", "DB_NAME": "db",
    }.items():
        monkeypatch.setenv(var, value)

    from app.app import create_app

    app = create_app()
    app.config["TESTING"] = True
    return app.test_client()
