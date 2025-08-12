from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True 