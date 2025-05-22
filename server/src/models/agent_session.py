"""
agent_session.py

This module defines Pydantic models used for managing and serializing data
related to agent sessions, messages, and model metadata in the chat application.

Models:
- AgentModel: Represents a model configuration (e.g., GPT-4 by OpenAI).
- AgentData: Wraps the model configuration metadata.
- AgentMessage: Represents a message in the chat session.
- AgentSession: Represents a chat session with metadata, associated model, and timestamps.
"""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, computed_field


class AgentModel(BaseModel):
    """
    Metadata for an AI model used by an agent.

    Attributes:
        id (str): Identifier of the model (e.g., 'gpt-4').
        name (str): Display name of the model.
        provider (str): Name of the provider (e.g., 'openai', 'google').
    """

    id: str
    name: str
    provider: str


class AgentData(BaseModel):
    """
    Container for the model metadata used by the agent.

    Attributes:
        model (AgentModel): The AI model used in the session.
    """

    model: AgentModel


class AgentMessage(BaseModel):
    """
    Represents a single message exchanged in a chat session.

    Attributes:
        role (Literal["user", "assistant"]): Origin of the message.
        content (str): Text content of the message.
        created_at (datetime): Timestamp when the message was created.
    """

    role: Literal["user", "assistant"]
    content: str
    created_at: datetime


class AgentSession(BaseModel):
    """
    Represents a chat session with metadata, associated agent model, and timestamps.

    Attributes:
        session_id (str): Unique identifier for the session.
        session_data (dict): Dictionary holding session metadata (e.g., title).
        agent_data (AgentData): Model metadata used for the session.
        created_at (datetime): When the session was initially created.
        updated_at (datetime): When the session was last modified.
    """

    session_id: str
    session_data: dict
    agent_data: AgentData
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def title(self) -> Optional[str]:
        """
        Computed field to extract the session's display title from session_data.

        Returns:
            Optional[str]: The session title, if available.
        """
        return self.session_data.get("session_name")
