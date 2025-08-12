from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    is_active: bool

    class Config:
        from_attributes = True 