from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int
    application_notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    application_notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    resume_id: int
    status: str
    applied_date: datetime
    has_tailored_resume: bool
    has_cover_letter: bool

    class Config:
        from_attributes = True

class ApplicationDetail(BaseModel):
    id: int
    job_id: int
    resume_id: int
    status: str
    applied_date: datetime
    tailored_resume: Optional[str] = None
    cover_letter: Optional[str] = None
    application_notes: Optional[str] = None
    ai_feedback: Optional[dict] = None
    skill_gaps: Optional[list] = None
    resume_improvements: Optional[list] = None
    user_satisfaction: Optional[int] = None
    interview_feedback: Optional[str] = None
    success_metrics: Optional[dict] = None
    follow_up_date: Optional[datetime] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApplicationFeedback(BaseModel):
    satisfaction_rating: int  # 1-5
    interview_feedback: Optional[str] = None 