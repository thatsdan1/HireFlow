from sqlalchemy.orm import relationship
from .user import User
from .resume import Resume
from .job import JobDescription
from .application import Application

# Import all models to ensure they are registered with SQLAlchemy
__all__ = ["User", "Resume", "JobDescription", "Application"]

# Update relationship back_populates after all models are imported
User.resumes = relationship("Resume", back_populates="user")
User.job_descriptions = relationship("JobDescription", back_populates="user")
User.applications = relationship("Application", back_populates="user") 