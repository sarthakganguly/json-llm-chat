from fastapi import APIRouter
from app.api.v1.endpoints import auth, upload, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(upload.router, prefix="/data", tags=["Data Management"])
api_router.include_router(chat.router, prefix="/query", tags=["Chat"])
