from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeResponse, ResumeUpdate
from app.services.auth import get_current_user
from app.services.resume_service import process_resume_file, extract_resume_content

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    title: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a new resume"""
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed"
        )
    
    # Validate file size
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size must be less than {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Save file
    file_path = await process_resume_file(file, current_user.id)
    
    # Extract content using AI
    content_data = await extract_resume_content(file_path, file.content_type)
    
    # Create resume record
    db_resume = Resume(
        user_id=current_user.id,
        title=title,
        file_path=file_path,
        file_name=file.filename,
        file_size=file.size,
        file_type=file.content_type,
        raw_content=content_data.get("raw_content"),
        structured_content=content_data.get("structured_content"),
        skills_extracted=content_data.get("skills"),
        experience_summary=content_data.get("experience_summary")
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return ResumeResponse(
        id=db_resume.id,
        title=db_resume.title,
        file_name=db_resume.file_name,
        file_size=db_resume.file_size,
        file_type=db_resume.file_type,
        is_primary=db_resume.is_primary,
        created_at=db_resume.created_at
    )

@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for current user"""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [
        ResumeResponse(
            id=resume.id,
            title=resume.title,
            file_name=resume.file_name,
            file_size=resume.file_size,
            file_type=resume.file_type,
            is_primary=resume.is_primary,
            created_at=resume.created_at
        )
        for resume in resumes
    ]

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific resume by ID"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return ResumeResponse(
        id=resume.id,
        title=resume.title,
        file_name=resume.file_name,
        file_size=resume.file_size,
        file_type=resume.file_type,
        is_primary=resume.is_primary,
        created_at=resume.created_at
    )

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update resume details"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Update fields
    update_data = resume_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resume, field, value)
    
    db.commit()
    db.refresh(resume)
    
    return ResumeResponse(
        id=resume.id,
        title=resume.title,
        file_name=resume.file_name,
        file_size=resume.file_size,
        file_type=resume.file_type,
        is_primary=resume.is_primary,
        created_at=resume.created_at
    )

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file from storage
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"} 