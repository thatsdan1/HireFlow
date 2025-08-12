from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer)  # in bytes
    file_type = Column(String(50))  # pdf, docx, etc.
    
    # Content fields
    raw_content = Column(Text)  # Extracted text content
    structured_content = Column(JSON)  # Parsed sections (experience, education, skills, etc.)
    
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
        return f"<Resume(id={self.id}, title='{self.title}', user_id={self.user_id})>" 