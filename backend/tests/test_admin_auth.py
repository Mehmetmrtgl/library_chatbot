# tests/test_admin_auth.py
import pytest

ADMIN_GET_ENDPOINTS = [
    "/api/unapproved_questions",
    "/api/feedback_logs",
    "/api/stats",
    "/api/analytics",
    "/api/questions_with_answers",
    "/api/download_fine_tune_data",
    "/api/chat_sessions",
    "/api/chat_history/some-session",
]

ADMIN_POST_ENDPOINTS = [
    "/api/approve_answer",
    "/api/update_answer",
    "/api/set_quality_score",
    "/api/export_finetune_data",
    "/api/generate_alternative",
    "/api/mark_for_edit",
]


def login(client, password="correct-password"):
    return client.post("/admin/login", json={"username": "admin", "password": password})


def test_login_with_wrong_password_fails(client):
    assert login(client, password="wrong").status_code == 401


def test_login_without_configured_credentials_fails(client, monkeypatch):
    monkeypatch.delenv("ADMIN_PASSWORD")
    assert login(client, password="").status_code == 401


def test_login_returns_signed_token(client):
    token = login(client).get_json()["token"]
    assert token and token != "fake-admin-token"


@pytest.mark.parametrize("path", ADMIN_GET_ENDPOINTS)
def test_admin_get_requires_token(client, path):
    assert client.get(path).status_code == 401


@pytest.mark.parametrize("path", ADMIN_POST_ENDPOINTS)
def test_admin_post_requires_token(client, path):
    assert client.post(path, json={}).status_code == 401


def test_reject_requires_token(client):
    assert client.delete("/api/reject_answer/1").status_code == 401


def test_forged_token_is_rejected(client):
    headers = {"Authorization": "Bearer fake-admin-token"}
    assert client.post("/api/generate_alternative", json={"question": "q"}, headers=headers).status_code == 401


def test_valid_token_is_accepted(client):
    token = login(client).get_json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post("/api/generate_alternative", json={"question": "q"}, headers=headers)
    assert res.status_code == 200
    assert res.get_json() == {"alternative": "stub-answer"}


def test_cors_preflight_is_not_blocked(client):
    res = client.options("/api/stats", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization",
    })
    assert res.status_code == 200


def test_public_chat_endpoint_stays_open(client):
    assert client.post("/chat", json={"question": "merhaba"}).status_code != 401


def test_app_refuses_to_start_without_secret_key(monkeypatch):
    monkeypatch.delenv("SECRET_KEY", raising=False)
    from app.app import create_app

    with pytest.raises(RuntimeError):
        create_app()
