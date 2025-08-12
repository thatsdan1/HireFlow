from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.services.auth import get_current_user
from app.services.job_service import analyze_job_description, calculate_match_score

router = APIRouter()

@router.post("/", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job posting"""
    # Analyze job description using AI
    analysis_result = await analyze_job_description(job_data.description)
    
    # Create job record
    db_job = Job(
        user_id=current_user.id,
        title=job_data.title,
        company=job_data.company,
        description=job_data.description,
        requirements=job_data.requirements,
        location=job_data.location,
        salary_range=job_data.salary_range,
        job_type=job_data.job_type,
        source_url=job_data.source_url,
        source_type=job_data.source_type,
        skills_required=analysis_result.get("skills_required"),
        experience_level=analysis_result.get("experience_level"),
        industry=analysis_result.get("industry")
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    return JobResponse(
        id=db_job.id,
        title=db_job.title,
        company=db_job.company,
        location=db_job.location,
        salary_range=db_job.salary_range,
        job_type=db_job.job_type,
        source_type=db_job.source_type,
        experience_level=db_job.experience_level,
        industry=db_job.industry,
        created_at=db_job.created_at
    )

@router.get("/", response_model=List[JobResponse])
async def get_user_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all jobs for current user"""
    jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    return [
        JobResponse(
            id=job.id,
            title=job.title,
            company=job.company,
            location=job.location,
            salary_range=job.salary_range,
            job_type=job.job_type,
            source_type=job.source_type,
            experience_level=job.experience_level,
            industry=job.industry,
            created_at=job.created_at
        )
        for job in jobs
    ]

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific job by ID"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        salary_range=job.salary_range,
        job_type=job.job_type,
        source_type=job.source_type,
        experience_level=job.experience_level,
        industry=job.industry,
        created_at=job.created_at
    )

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update job details"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Update fields
    update_data = job_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    # Re-analyze if description changed
    if "description" in update_data:
        analysis_result = await analyze_job_description(job.description)
        job.skills_required = analysis_result.get("skills_required")
        job.experience_level = analysis_result.get("experience_level")
        job.industry = analysis_result.get("industry")
    
    db.commit()
    db.refresh(job)
    
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        salary_range=job.salary_range,
        job_type=job.job_type,
        source_type=job.source_type,
        experience_level=job.experience_level,
        industry=job.industry,
        created_at=job.created_at
    )

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a job posting"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    db.delete(job)
    db.commit()
    
    return {"message": "Job deleted successfully"}

@router.post("/{job_id}/analyze")
async def analyze_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Re-analyze job description with AI"""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Re-analyze job description
    analysis_result = await analyze_job_description(job.description)
    
    # Update job with new analysis
    job.skills_required = analysis_result.get("skills_required")
    job.experience_level = analysis_result.get("experience_level")
    job.industry = analysis_result.get("industry")
    
    db.commit()
    
    return {
        "message": "Job analysis updated",
        "analysis": analysis_result
    } 