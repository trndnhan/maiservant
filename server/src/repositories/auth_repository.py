"""
Repository module for user-related data access operations.

This module defines the UserRepository class which provides methods to interact
with the User collection in the database using Beanie ODM.
"""

from typing import Optional

from beanie import PydanticObjectId
from fastapi import Depends, Request
from fastapi_users import BaseUserManager
from fastapi_users_db_beanie import BeanieUserDatabase, ObjectIDIDMixin
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from ..models.user import User


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    This settings model uses pydantic's BaseSettings and loads the required
    configuration from the '.env' file. Any extra variables in the file will be ignored.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )
    reset_secret: str = Field(..., alias="RESET_SECRET")
    verification_secret: str = Field(..., alias="VERIFICATION_SECRET")


settings = Settings()


async def get_user_db():
    """
    Yield a BeanieUserDatabase instance for the User document model.

    Yields:
        BeanieUserDatabase: An instance configured to operate on the User model.
    """
    yield BeanieUserDatabase(User)


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    """
    Custom user manager handling user registration, password reset, and verification processes.

    It leverages the reset and verification secrets loaded from environment variables.
    """

    reset_password_token_secret = settings.reset_secret
    verification_token_secret = settings.verification_secret

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print("User registered:", user.model_dump())


async def get_user_manager(user_db=Depends(get_user_db)):
    """
    Yield an instance of UserManager initialized with the user database dependency.

    Args:
        user_db: Dependency injected BeanieUserDatabase instance for the User model.

    Yields:
        UserManager: An instance of UserManager configured with the user database.
    """
    yield UserManager(user_db)
