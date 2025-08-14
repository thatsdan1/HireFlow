from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_content = Column(Text)  # Extracted text content
    parsed_content = Column(JSON)  # Parsed sections (experience, education, skills, etc.)
    template_id = Column(Integer, default=1)
    version_name = Column(String(255))
    file_name = Column(String(255))
    file_size = Column(Integer)  # in bytes
    parent_resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    
    # AI processing fields
    embeddings = Column(JSON)  # Vector embeddings for semantic search
    skills_extracted = Column(JSON)  # AI-extracted skills
    experience_summary = Column(Text)  # AI-generated experience summary
    
    # Metadata
    is_primary = Column(Boolean, default=False)  # User's main resume
    is_public = Column(Boolean, default=False)  # Can be shared
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")
    
    def __repr__(self):
        return f"<Resume(id={self.id}, version_name='{self.version_name}', user_id={self.user_id})>"


# Pydantic schemas for API requests/responses
class ResumeCreate(BaseModel):
    user_id: int
    original_content: str
    parsed_content: Dict[str, Any]
    template_id: int = 1
    version_name: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    parent_resume_id: Optional[int] = None

class ResumeUpdate(BaseModel):
    parsed_content: Optional[Dict[str, Any]] = None
    template_id: Optional[int] = None
    version_name: Optional[str] = None 