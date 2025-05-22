"""
Configuration module for the application.

This module defines the Settings class, which loads configuration
variables from environment variables using Pydantic's BaseSettings.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        database_url (str): MongoDB connection URI.
        port (int): Port number for the FastAPI application.
        google_api_key (str): API key for accessing Google services.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )
    database_url: str = Field(..., alias="MONGODB_URI")
    port: int = Field(..., alias="PORT")
    google_api_key: str = Field(..., alias="GOOGLE_API_KEY")
    co_api_key: str = Field(..., alias="CO_API_KEY")
    groq_api_key: str = Field(..., alias="GROQ_API_KEY")
    mistral_api_key: str = Field(..., alias="MISTRAL_API_KEY")
    openrouter_api_key: str = Field(..., alias="OPENROUTER_API_KEY")
    access_public_key: str = Field(..., alias="ACCESS_PUBLIC_KEY")
    access_private_key: str = Field(..., alias="ACCESS_PRIVATE_KEY")


settings = Settings()
