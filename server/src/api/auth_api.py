"""
auth_api.py

This module defines the API routes related to user authentication and user information.
It integrates with FastAPI Users for handling JWT-based authentication and user registration.
Includes an endpoint to fetch the currently authenticated user's basic information.

Dependencies:
- FastAPI Users for authentication and registration
- JWT-based authentication backend
- User models and authentication service
"""

from fastapi import APIRouter, Depends

from ..models.user import User, UserCreate, UserRead
from ..services.auth_service import auth_backend, current_active_user, fastapi_users

router = APIRouter()

# Authentication route using JWT tokens
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["auth"],
)

# User registration route
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="",
    tags=["auth"],
)


@router.get("/current_user")
async def authenticated_route(user: User = Depends(current_active_user)):
    """
    Retrieve basic information about the currently authenticated user.

    Parameters:
        user (User): The currently authenticated user (injected via dependency).

    Returns:
        dict: A dictionary containing the user's ID, email, and full name.
    """
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
    }
