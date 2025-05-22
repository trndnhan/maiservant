"""
Authentication Service Module

This module sets up the JWT authentication backend for the application using FastAPI Users.
It configures a cookie transport with a max age of 3600 seconds and utilizes a database strategy
(from the auth_repository) to manage token authentication.
"""

import base64

from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi_users_db_beanie import ObjectIDIDMixin

from ..config.config import settings
from ..models.user import User
from ..repositories.auth_repository import get_user_manager

cookie_transport = CookieTransport(cookie_max_age=3600)


def get_jwt_strategy() -> JWTStrategy:
    """
    Returns a JWTStrategy instance configured with RS256 algorithm.

    This strategy uses the application's access private and public keys,
    decoded from base64, to sign and verify JWT tokens. The tokens have
    a lifetime of 3600 seconds (1 hour).

    Returns:
        JWTStrategy: Configured JWT authentication strategy.
    """
    return JWTStrategy(
        secret=base64.b64decode(settings.access_private_key).decode("utf-8"),
        lifetime_seconds=3600,
        algorithm="RS256",
        public_key=base64.b64decode(settings.access_public_key).decode("utf-8"),
    )


auth_backend = AuthenticationBackend(
    name="auth",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, ObjectIDIDMixin](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
