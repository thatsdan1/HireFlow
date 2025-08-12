from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    source_type: Optional[str] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobDetail(BaseModel):
    id: int
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Optional[str] = None
    skills_required: Optional[List[str]] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    match_score: Optional[int] = None
    matched_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 