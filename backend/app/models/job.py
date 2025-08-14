from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    
    # Job details
    description_text = Column(Text, nullable=False)
    requirements_extracted = Column(Text)
    job_url = Column(String(500))
    
    # AI analysis fields
    keywords = Column(JSON)  # AI-extracted keywords
    company_culture = Column(Text)  # AI-analyzed company culture
    skills_to_highlight = Column(JSON)  # Skills user should emphasize
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="job_descriptions")
    applications = relationship("Application", back_populates="job")
    
    def __repr__(self):
        return f"<JobDescription(id={self.id}, job_title='{self.job_title}', company_name='{self.company_name}')>"


# Pydantic schemas for API requests/responses
class JobDescriptionCreate(BaseModel):
    user_id: int
    company_name: str
    job_title: str
    description_text: str
    requirements_extracted: Optional[str] = None
    job_url: Optional[str] = None
    keywords: Optional[Dict[str, Any]] = None
    company_culture: Optional[str] = None
    skills_to_highlight: Optional[Dict[str, Any]] = None

class JobDescriptionUpdate(BaseModel):
    description_text: Optional[str] = None
    requirements_extracted: Optional[str] = None
    keywords: Optional[Dict[str, Any]] = None
    company_culture: Optional[str] = None
    skills_to_highlight: Optional[Dict[str, Any]] = None 