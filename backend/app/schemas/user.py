from pydantic import BaseModel, EmailStr
import uuid

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    tenant_name: str

class User(UserBase):
    id: uuid.UUID
    tenant_id: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
