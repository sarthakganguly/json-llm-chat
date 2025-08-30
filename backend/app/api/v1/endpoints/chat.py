from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.db.models import User
from app.db.session import get_tenant_db
from app.schemas.document import ChatRequest, ChatResponse
from app.services import rag_service

router = APIRouter()

# This new dependency function correctly wires everything together for FastAPI.
def get_current_tenant_db(current_user: User = Depends(get_current_user)):
    """
    A dependency that first gets the current user, then yields a database session
    that is correctly configured for that user's specific tenant schema.
    """
    # get_tenant_db(tenant_id) returns a generator function (our dependency)
    db_session_generator = get_tenant_db(current_user.tenant_id)

    # We call the generator function to get the actual generator, then iterate
    for db in db_session_generator():
        try:
            yield db
        finally:
            # The original generator in session.py handles closing the session.
            pass

@router.post("/chat", response_model=ChatResponse)
def chat_with_documents(
    request: ChatRequest,
    # The endpoint now correctly receives the tenant-specific db session
    # directly as a parameter, thanks to our new dependency.
    db: Session = Depends(get_current_tenant_db)
):
    try:
        response = rag_service.get_answer_from_rag(query=request.query, db=db)
        return ChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))