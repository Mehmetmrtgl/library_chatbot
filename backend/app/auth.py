# app/auth.py
import hmac
import os

from flask import current_app, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

TOKEN_SALT = "admin-auth"
TOKEN_MAX_AGE = 12 * 60 * 60  # 12 saat


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt=TOKEN_SALT)


def check_admin_credentials(username, password):
    env_username = os.getenv("ADMIN_USERNAME")
    env_password = os.getenv("ADMIN_PASSWORD")
    # Ortam değişkenleri tanımlı değilse kimse giriş yapamaz
    if not env_username or not env_password:
        return False
    return hmac.compare_digest(str(username or ""), env_username) and hmac.compare_digest(
        str(password or ""), env_password
    )


def issue_admin_token(username):
    return _serializer().dumps({"user": username})


def require_admin():
    """Blueprint'lerde before_request olarak kullanılır; token geçersizse 401 döner."""
    if request.method == "OPTIONS":
        return None

    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return jsonify({"error": "Yetkisiz erişim"}), 401

    try:
        _serializer().loads(header[len("Bearer "):], max_age=TOKEN_MAX_AGE)
    except SignatureExpired:
        return jsonify({"error": "Oturum süresi doldu"}), 401
    except BadSignature:
        return jsonify({"error": "Yetkisiz erişim"}), 401
    return None
