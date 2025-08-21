import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from datetime import datetime

Base = declarative_base()

class Tenant(Base):
    __tablename__ = 'tenants'
    id = Column(String, primary_key=True, default=lambda: f"tenant_{uuid.uuid4().hex[:12]}")
    name = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    users = relationship("User", back_populates="tenant")

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    tenant_id = Column(String, ForeignKey('tenants.id'))
    tenant = relationship("Tenant", back_populates="users")

class DocumentChunk(Base):
    __tablename__ = 'document_chunks'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(String, nullable=False)
    embedding = Column(Vector(384)) # all-MiniLM-L6-v2 has 384 dimensions
    source_document_id = Column(String, index=True) # Optional: to link back to the source
    created_at = Column(DateTime, default=datetime.utcnow)
