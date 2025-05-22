"""
agent_api.py

This module defines the API routes for managing agent sessions in the application.
It includes endpoints for listing sessions, retrieving messages from a session,
renaming a session, and deleting a session. All routes require the authenticated user.

Dependencies:
- FastAPI
- User authentication via current_active_user
- Agent session and message models
- Repository functions for database interactions
"""

from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Query, Response

from ..models.agent_session import AgentMessage, AgentSession
from ..models.user import User
from ..repositories.agent_repository import (
    delete_session_in_db,
    get_session_messages,
    get_sessions_by_user,
    rename_session_in_db,
)
from ..services.auth_service import current_active_user

router = APIRouter()


@router.get("/sessions", response_model=List[AgentSession])
async def list_sessions(user: User = Depends(current_active_user)):
    """
    Retrieve all agent sessions associated with the current authenticated user.

    Parameters:
        user (User): The currently authenticated user (injected via dependency).

    Returns:
        List[AgentSession]: A list of agent sessions owned by the user.
    """
    return await get_sessions_by_user(user)


@router.get(
    "/sessions/{session_id}/messages",
    response_model=List[AgentMessage],
)
async def get_messages(
    session_id: str,
    limit: int = Query(4, ge=1, le=100),
    before: Optional[str] = None,
    user: User = Depends(current_active_user),
):
    """
    Retrieve messages from a specific agent session.

    Parameters:
        session_id (str): The ID of the session to retrieve messages from.
        limit (int): The number of messages to return (default 4, between 1 and 100).
        before (Optional[str]): An optional message ID to paginate results.
        user (User): The currently authenticated user.

    Returns:
        List[AgentMessage]: A list of messages from the specified session.
    """
    return await get_session_messages(session_id, user, limit, before)


@router.patch("/sessions/{session_id}", response_model=AgentSession)
async def rename_session(
    session_id: str,
    new_name: str = Body(..., embed=True),
    user: User = Depends(current_active_user),
):
    """
    Rename an existing session for the current user.

    Parameters:
        session_id (str): The ID of the session to rename.
        new_name (str): The new name for the session (provided in request body).
        user (User): The currently authenticated user.

    Returns:
        AgentSession: The updated session with the new name.
    """
    return await rename_session_in_db(session_id, user, new_name)


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: str,
    user: User = Depends(current_active_user),
):
    """
    Delete a session owned by the current user.

    Parameters:
        session_id (str): The ID of the session to delete.
        user (User): The currently authenticated user.

    Returns:
        Response: An HTTP 204 No Content response indicating successful deletion.
    """
    await delete_session_in_db(session_id, user)
    return Response(status_code=204)
