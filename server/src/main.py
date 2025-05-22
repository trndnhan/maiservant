"""
Main entry point for the FastAPI application.

This module sets up the application configuration, initializes the database connection
via a lifespan context, and includes API routers.
"""

from contextlib import asynccontextmanager

import src.api.socket_handlers
import uvicorn
from fastapi import FastAPI
from fastapi_socketio import SocketManager

from .api.agent_api import router as agent_router
from .api.auth_api import router as auth_router
from .config.config import settings
from .repositories.connection import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """
    Lifespan context manager that initializes the database connection.
    """
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)
socket_manager = SocketManager(app=app, mount_location="/socket.io")

app.include_router(auth_router, prefix="/api/auth")
app.include_router(agent_router, prefix="/api/chat/agent", tags=["agent"])

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=settings.port, reload=True)
