from fastapi import FastAPI
from sqlalchemy import text

from app.api.v1.api import api_router
from app.db.session import engine, SessionLocal
from app.db.models import Base
# Import the service to trigger the model loading
from app.services import embedding_service

app = FastAPI(title="Financial Chat API")

@app.on_event("startup")
def on_startup():
    # This will initialize our singleton embedding model when the app starts.
    print("Pre-loading embedding model...")
    _ = embedding_service.embedding_model
    print("Embedding model loaded.")

    # First, connect to the DB and enable the pgvector extension
    with SessionLocal() as db:
        with db.begin():
            db.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))

    # Create public schema tables (users, tenants)
    Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "ok"}