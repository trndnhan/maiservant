"""
This module sets up the connection to MongoDB and initializes the Beanie ODM.
It also provides a helper function to get the MongoDbStorage for Agno agents.
"""

from agno.storage.mongodb import MongoDbStorage
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from ..config.config import settings
from ..models.user import User

DEFAULT_DB_NAME = "MAIServant"


async def init_db():
    """
    Initialize the MongoDB connection and Beanie ODM using configuration from config.py.
    """
    mongodb_uri = settings.database_url
    client = AsyncIOMotorClient(mongodb_uri)
    db = client[DEFAULT_DB_NAME]
    await init_beanie(database=db, document_models=[User])


async def get_agent_storage():
    """
    Asynchronously returns a MongoDbStorage instance configured for Agno agents.

    Storage configuration:
      - collection_name: "sessions"
      - db_url: fetched from settings.database_url
      - db_name: "MAIServant"

    Returns:
        MongoDbStorage: The configured storage backend.
    """
    mongodb_uri = settings.database_url
    storage = MongoDbStorage(
        collection_name="sessions",
        db_url=mongodb_uri,
        db_name=DEFAULT_DB_NAME,
    )
    return storage
