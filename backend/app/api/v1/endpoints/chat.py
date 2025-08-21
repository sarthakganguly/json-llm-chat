from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.db.models import User
from app.db.session import get_tenant_db
from app.schemas.document import ChatRequest, ChatResponse
from app.services import rag_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_with_documents(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    # The user object from get_current_user has the tenant_id attached.
    tenant_id = current_user.tenant_id
    
    # Create a tenant-specific DB session dependency
    tenant_db_session = Depends(get_tenant_db(tenant_id))
    
    # Resolve the dependency to get the actual session
    for db in tenant_db_session():
        try:
            response = rag_service.get_answer_from_rag(query=request.query, db=db)
            return ChatResponse(**response)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
