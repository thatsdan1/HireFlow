from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    
    # Job details
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    location = Column(String(255))
    salary_range = Column(String(100))
    job_type = Column(String(50))  # full-time, part-time, contract, etc.
    
    # Source information
    source_url = Column(String(500))  # If scraped from job board
    source_type = Column(String(50))  # manual, linkedin, indeed, etc.
    
    # AI analysis fields
    embeddings = Column(JSON)  # Vector embeddings for semantic matching
    skills_required = Column(JSON)  # AI-extracted required skills
    experience_level = Column(String(50))  # entry, mid, senior, etc.
    industry = Column(String(100))
    
    # Matching data
    match_score = Column(Integer)  # 0-100 score with user's resume
    matched_skills = Column(JSON)  # Skills that match user's resume
    missing_skills = Column(JSON)  # Skills user lacks
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")
    
    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>" 