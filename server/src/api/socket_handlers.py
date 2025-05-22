"""
socket_handlers.py

This module defines Socket.IO event handlers for managing real-time communication
between the client and server in a chat-based agent application.

Features include:
- Handling client connections
- Initializing agent sessions
- Streaming assistant responses
- Dynamically generating session titles
- Synchronizing stream readiness between client and server

Dependencies:
- Asyncio for event-based concurrency
- agno agent and model providers (Google, Cohere, Mistral, Groq, OpenRouter)
- Socket.IO for real-time bidirectional communication
- MongoDB for session persistence
"""

import asyncio

from agno.agent import Agent
from agno.models.cohere import Cohere
from agno.models.google import Gemini
from agno.models.groq import Groq
from agno.models.mistral import MistralChat
from agno.models.openrouter import OpenRouter

from ..config.config import settings
from ..main import socket_manager
from ..repositories.connection import get_agent_storage


def make_model(id: str, provider: str):
    """
    Factory function that returns a model instance based on the provider name.

    Parameters:
        id (str): Model ID to use.
        provider (str): Name of the provider (e.g., 'google', 'cohere').

    Returns:
        An instance of the corresponding model class with configured API key.

    Raises:
        ValueError: If the provider is unknown.
    """
    p = (provider or "").lower()
    if p == "google":
        return Gemini(id=id, api_key=settings.google_api_key)
    if p == "cohere":
        return Cohere(id=id, api_key=settings.co_api_key)
    if p == "mistral":
        return MistralChat(id=id, api_key=settings.mistral_api_key)
    if p == "groq":
        return Groq(id=id, api_key=settings.groq_api_key)
    if p == "openrouter":
        return OpenRouter(id=id, api_key=settings.openrouter_api_key)
    raise ValueError(f"Unknown provider: {provider}")


# Dictionary to coordinate session stream readiness across async coroutines
stream_ready_events = {}


@socket_manager.on("connect")
async def on_connect(sid, environ):
    """
    Event handler triggered when a client connects to the WebSocket.

    Parameters:
        sid (str): The session ID assigned to the connected client.
        environ (dict): The connection environment metadata.
    """
    print(f"Client connected: {sid}")


@socket_manager.on("init_session")
async def init_session(sid, data):
    """
    Event handler to initialize a chat session.

    Parameters:
        sid (str): The session ID of the socket client.
        data (dict): A dictionary containing session configuration:
                     - session_id (str)
                     - model (str)
                     - provider (str)
                     - prompt (str)
                     - user_id (str)
                     - is_new (bool)

    Behavior:
        - Joins the client to the corresponding session room.
        - Creates an agent with the selected model.
        - If the session is new, waits for a 'stream_ready' signal.
        - Streams assistant response back to the client incrementally.
        - If the session is new, generates and stores a title summarizing the conversation.
    """
    session_id = data["session_id"]
    model_id = data["model"]
    provider = data["provider"]
    prompt = data["prompt"]
    user_id = data["user_id"]
    is_new = data.get("is_new", False)

    await socket_manager.enter_room(sid, session_id)

    storage = await get_agent_storage()
    existing = storage.collection.find_one({"session_id": session_id})
    is_new_session = existing is None

    if is_new:
        stream_ready_events[session_id] = asyncio.Event()
        await stream_ready_events[session_id].wait()
        del stream_ready_events[session_id]

    agent = Agent(
        model=make_model(model_id, provider),
        storage=storage,
        session_id=session_id,
        user_id=user_id,
        markdown=True,
        add_history_to_messages=not is_new_session,
    )

    loop = asyncio.get_event_loop()

    def run_and_emit():
        """
        Runs the agent and emits assistant response chunks via WebSocket.

        Also generates a session title for new sessions and emits it to the client.
        """
        full_response = ""
        for chunk in agent.run(prompt, stream=True):
            full_response += chunk.content
            asyncio.run_coroutine_threadsafe(
                socket_manager.emit(
                    "assistant_stream",
                    {"session_id": session_id, "content": full_response},
                    room=session_id,
                ),
                loop,
            )
        asyncio.run_coroutine_threadsafe(
            socket_manager.emit(
                "assistant_stream",
                {"session_id": session_id, "content": full_response, "done": True},
                room=session_id,
            ),
            loop,
        )

        if is_new_session:
            title_agent = Agent(
                model=make_model(model_id, provider),
                storage=None,
                markdown=False,
            )
            title_prompt = (
                f"Generate a short conversation title (must be less than 40 chars, your response purely "
                f"contains ONLY the title, no quotation marks at the begin or end) summarizing the "
                f"following response:\n{full_response}"
            )
            title = title_agent.run(title_prompt).content or "Untitled"

            storage.collection.update_one(
                {"session_id": session_id},
                {"$set": {"session_data.session_name": title}},
            )
            asyncio.run_coroutine_threadsafe(
                socket_manager.emit(
                    "session_title",
                    {"session_id": session_id, "title": title},
                    room=session_id,
                ),
                loop,
            )

    loop.run_in_executor(None, run_and_emit)


@socket_manager.on("stream_ready")
async def stream_ready(sid, data):
    """
    Event handler called by the client to signal readiness for streaming assistant responses.

    Parameters:
        sid (str): The session ID of the socket client.
        data (dict): Contains 'session_id' (str) to indicate which stream is ready.
    """
    session_id = data["session_id"]
    if session_id in stream_ready_events:
        stream_ready_events[session_id].set()
