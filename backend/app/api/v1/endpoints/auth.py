from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core import security
from app.db import models, session as db_session
from app.schemas import user as user_schema

router = APIRouter()

@router.post("/token", response_model=user_schema.Token)
def login_for_access_token(db: Session = Depends(db_session.get_public_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = security.create_access_token(
        data={"sub": user.email, "tid": user.tenant_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/users/", response_model=user_schema.User)
def create_user(user: user_schema.UserCreate, db: Session = Depends(db_session.get_public_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create a new tenant and user
    with db.begin():
        new_tenant = models.Tenant(name=user.tenant_name)
        db.add(new_tenant)
        db.flush() # Flush to get the new_tenant.id

        hashed_password = security.get_password_hash(user.password)
        new_user = models.User(
            email=user.email, 
            hashed_password=hashed_password, 
            tenant_id=new_tenant.id
        )
        db.add(new_user)
        db.commit()

    # Create the schema for the new tenant
    with db.begin():
        db.execute(text(f"CREATE SCHEMA IF NOT EXISTS {new_tenant.id}"))
        # You would also create tables within the schema here, e.g., using metadata.create_all
        # For simplicity, the worker task will also create the schema if not exists.
    
    return new_user
