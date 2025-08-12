from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.resume import Resume
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.services.auth import get_current_user
from app.services.application_service import generate_tailored_resume, generate_cover_letter

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job application"""
    # Verify job and resume belong to user
    job = db.query(Job).filter(
        Job.id == application_data.job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    resume = db.query(Resume).filter(
        Resume.id == application_data.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Generate AI-tailored content
    tailored_resume = await generate_tailored_resume(resume, job)
    cover_letter = await generate_cover_letter(resume, job)
    
    # Create application record
    db_application = Application(
        user_id=current_user.id,
        job_id=application_data.job_id,
        resume_id=application_data.resume_id,
        tailored_resume=tailored_resume,
        cover_letter=cover_letter,
        application_notes=application_data.application_notes,
        status="applied"
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    return ApplicationResponse(
        id=db_application.id,
        job_id=db_application.job_id,
        resume_id=db_application.resume_id,
        status=db_application.status,
        applied_date=db_application.applied_date,
        has_tailored_resume=bool(db_application.tailored_resume),
        has_cover_letter=bool(db_application.cover_letter)
    )

@router.get("/", response_model=List[ApplicationResponse])
async def get_user_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all applications for current user"""
    applications = db.query(Application).filter(Application.user_id == current_user.id).all()
    return [
        ApplicationResponse(
            id=app.id,
            job_id=app.job_id,
            resume_id=app.resume_id,
            status=app.status,
            applied_date=app.applied_date,
            has_tailored_resume=bool(app.tailored_resume),
            has_cover_letter=bool(app.cover_letter)
        )
        for app in applications
    ]

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific application by ID"""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return ApplicationResponse(
        id=application.id,
        job_id=application.job_id,
        resume_id=application.resume_id,
        status=application.status,
        applied_date=application.applied_date,
        has_tailored_resume=bool(application.tailored_resume),
        has_cover_letter=bool(application.cover_letter)
    )

@router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application details"""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update fields
    update_data = application_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    db.commit()
    db.refresh(application)
    
    return ApplicationResponse(
        id=application.id,
        job_id=application.job_id,
        resume_id=application.resume_id,
        status=application.status,
        applied_date=application.applied_date,
        has_tailored_resume=bool(application.tailored_resume),
        has_cover_letter=bool(application.cover_letter)
    )

@router.post("/{application_id}/feedback")
async def submit_application_feedback(
    application_id: int,
    satisfaction_rating: int,
    interview_feedback: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feedback for an application"""
    if not 1 <= satisfaction_rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Satisfaction rating must be between 1 and 5"
        )
    
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    application.user_satisfaction = satisfaction_rating
    if interview_feedback:
        application.interview_feedback = interview_feedback
    
    db.commit()
    
    return {"message": "Feedback submitted successfully"}

@router.get("/{application_id}/content")
async def get_application_content(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated content for an application"""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return {
        "tailored_resume": application.tailored_resume,
        "cover_letter": application.cover_letter,
        "ai_feedback": application.ai_feedback,
        "skill_gaps": application.skill_gaps
    } 