"""
This module defines the User document model for MongoDB using Beanie ODM.
"""

from typing import Optional

from beanie import Document, PydanticObjectId
from fastapi_users import schemas
from fastapi_users_db_beanie import BeanieBaseUser


class User(BeanieBaseUser, Document):  # pylint: disable=too-many-ancestors
    """
    User document model for MongoDB using Beanie ODM.

    This class extends BeanieBaseUser to provide user-related fields and
    behavior in a MongoDB document. It is used with FastAPI Users for
    authentication and user management.
    """

    full_name: Optional[str]

    class Settings:  # pylint: disable=too-few-public-methods
        """
        Settings for the User document model.

        Specifies the MongoDB collection name.
        """

        name = "users"
        email_collation = {"locale": "en", "strength": 2}


class UserRead(
    schemas.BaseUser[PydanticObjectId]
):  # pylint: disable=too-few-public-methods
    """
    Schema for reading user details.

    Attributes:
        username (str): The username of the user.
    """

    full_name: str


class UserCreate(schemas.BaseUserCreate):
    """
    Schema for creating a new user.

    Attributes:
        full_name (str): The full_name for the new user.
    """

    full_name: Optional[str]


class UserUpdate(schemas.BaseUserUpdate):
    """
    Schema for updating an existing user.

    Attributes:
        full_name (Optional[str]): The new full_name for the user. It is optional.
    """

    full_name: Optional[str]
