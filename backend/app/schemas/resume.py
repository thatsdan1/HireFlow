from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ResumeCreate(BaseModel):
    title: str

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    is_primary: Optional[bool] = None
    is_public: Optional[bool] = None

class ResumeResponse(BaseModel):
    id: int
    title: str
    file_name: str
    file_size: int
    file_type: str
    is_primary: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeDetail(BaseModel):
    id: int
    title: str
    file_name: str
    file_size: int
    file_type: str
    raw_content: Optional[str] = None
    structured_content: Optional[Dict[str, Any]] = None
    skills_extracted: Optional[list] = None
    experience_summary: Optional[str] = None
    is_primary: bool
    is_public: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 