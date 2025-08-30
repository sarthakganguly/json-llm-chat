from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text, exc
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
    # The first DB call implicitly begins a transaction.
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        # 1. Create the new tenant
        new_tenant = models.Tenant(name=user.tenant_name)
        db.add(new_tenant)
        # We need the tenant ID for the user and schema, so we flush the session.
        # This sends the INSERT to the DB but does not commit the transaction.
        db.flush()

        # 2. Create the new user, now with the flushed tenant_id
        hashed_password = security.get_password_hash(user.password)
        new_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            tenant_id=new_tenant.id
        )
        db.add(new_user)

        # 3. Create the schema for the new tenant
        db.execute(text(f"CREATE SCHEMA IF NOT EXISTS {new_tenant.id}"))

        # If all operations were successful, commit the transaction.
        db.commit()
        db.refresh(new_user) # Refresh the object to get all data from the DB.

    except exc.SQLAlchemyError as e:
        # If any database error occurred, roll back the entire transaction.
        db.rollback()
        print(f"Database error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while creating the user.")

    return new_user