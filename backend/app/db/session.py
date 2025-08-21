from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_public_db():
    """DB session for accessing public schema tables like users and tenants."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_tenant_db(tenant_id: str):
    """Factory to create a DB session dependency for a specific tenant."""
    def get_db():
        db = SessionLocal()
        try:
            # Set the schema for the current session
            with db.begin():
                db.execute(f"SET search_path TO {tenant_id}, public")
            yield db
        finally:
            db.close()
    return get_db
