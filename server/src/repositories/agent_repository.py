"""
agent_repository.py

This module contains asynchronous repository functions for interacting with the
agent session data stored in MongoDB. It handles retrieval, updates, and deletion
of sessions and messages for authenticated users.

Functions:
- get_sessions_by_user: Retrieve all chat sessions belonging to a user.
- get_session_messages: Fetch messages from a specific session with pagination.
- rename_session_in_db: Update the name/title of a session.
- delete_session_in_db: Remove a session belonging to a user from the database.
"""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import HTTPException
from pymongo import ReturnDocument

from ..models.agent_session import AgentMessage, AgentSession
from ..models.user import User
from ..repositories.connection import get_agent_storage


async def get_sessions_by_user(user: User) -> List[AgentSession]:
    """
    Retrieve all chat sessions for the specified user.

    Args:
        user (User): The currently authenticated user.

    Returns:
        List[AgentSession]: A list of AgentSession objects sorted by updated time.
    """
    storage = await get_agent_storage()
    cursor = storage.collection.find({"user_id": str(user.id)}).sort("updated_at", -1)
    results = cursor.to_list(length=None)
    sessions = []
    for doc in results:
        session_data = doc.get("session_data", {})
        doc["title"] = session_data.get("session_name")
        sessions.append(AgentSession(**doc))
    return sessions


async def get_session_messages(
    session_id: str, user: User, limit: int, before: Optional[str]
) -> List[AgentMessage]:
    """
    Retrieve a limited number of assistant and user messages for a given session.

    Args:
        session_id (str): The ID of the session.
        user (User): The currently authenticated user.
        limit (int): Maximum number of messages to return.
        before (Optional[str]): Optional ISO timestamp to paginate messages before this point.

    Raises:
        HTTPException: If the session is not found or user is unauthorized.

    Returns:
        List[AgentMessage]: A list of messages from the session.
    """
    storage = await get_agent_storage()
    doc = storage.collection.find_one({"session_id": session_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")
    if doc.get("user_id") != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized")

    mem_msgs = doc.get("memory", {}).get("messages", [])
    msgs = [m for m in mem_msgs if m.get("role") in ("user", "assistant")]
    msgs.sort(key=lambda m: m["created_at"], reverse=True)

    if before:
        before_dt = datetime.fromisoformat(before)
        before_timestamp = int(before_dt.timestamp())
        msgs = [m for m in msgs if m["created_at"] < before_timestamp]

    sliced = msgs[:limit]
    sorted_sliced = sorted(sliced, key=lambda m: m["created_at"])

    for m in sorted_sliced:
        if isinstance(m["created_at"], int):
            dt = datetime.fromtimestamp(m["created_at"], tz=timezone.utc)
            m["created_at"] = dt.isoformat()

    return [AgentMessage(**m) for m in sorted_sliced]


async def rename_session_in_db(
    session_id: str, user: User, new_name: str
) -> AgentSession:
    """
    Rename an existing session belonging to the user.

    Args:
        session_id (str): The session to rename.
        user (User): The currently authenticated user.
        new_name (str): New name for the session.

    Raises:
        HTTPException: If the session is not found or not authorized.

    Returns:
        AgentSession: The updated session object.
    """
    storage = await get_agent_storage()
    result = storage.collection.find_one_and_update(
        {"session_id": session_id, "user_id": str(user.id)},
        {"$set": {"session_data.session_name": new_name}},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(
            status_code=404, detail="Session not found or not authorized"
        )
    return AgentSession(**result)


async def delete_session_in_db(session_id: str, user: User) -> None:
    """
    Delete a session if it belongs to the specified user.

    Args:
        session_id (str): The ID of the session to delete.
        user (User): The currently authenticated user.

    Raises:
        HTTPException: If the session is not found or user is unauthorized.
    """
    storage = await get_agent_storage()
    res = storage.collection.delete_one(
        {"session_id": session_id, "user_id": str(user.id)}
    )
    if res.deleted_count == 0:
        raise HTTPException(
            status_code=404, detail="Session not found or not authorized"
        )
