from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, date

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    
    # Application status
    status = Column(String(50), default="applied")  # applied, interviewing, offered, rejected, withdrawn
    applied_date = Column(Date, default=date.today)
    company_name = Column(String(255))
    position_title = Column(String(255))
    notes = Column(Text)
    
    # AI-generated content
    tailored_resume = Column(Text)  # AI-tailored resume content
    cover_letter = Column(Text)  # AI-generated cover letter
    application_notes = Column(Text)  # User notes about the application
    
    # AI feedback and improvements
    ai_feedback = Column(JSON)  # AI suggestions for improvement
    skill_gaps = Column(JSON)  # Skills user should develop
    resume_improvements = Column(JSON)  # Specific resume suggestions
    
    # User feedback and learning
    user_satisfaction = Column(Integer)  # 1-5 rating of AI suggestions
    interview_feedback = Column(Text)  # User's interview experience
    success_metrics = Column(JSON)  # Response rate, interview rate, etc.
    
    # Tracking
    follow_up_date = Column(DateTime(timezone=True))
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")
    
    def __repr__(self):
        return f"<Application(id={self.id}, user_id={self.user_id}, job_id={self.job_id})>"


# Pydantic schemas for API requests/responses
class ApplicationCreate(BaseModel):
    user_id: int
    resume_id: int
    job_id: int
    company_name: str
    position_title: str
    status: str = "applied"
    applied_date: Optional[date] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    user_satisfaction: Optional[int] = None
    interview_feedback: Optional[str] = None 