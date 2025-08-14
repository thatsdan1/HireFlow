from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime

from app.services.auth import get_current_user
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.resume import Resume, ResumeCreate, ResumeUpdate
from app.services.resume_service import ResumeService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/resume", tags=["resume"])

resume_service = ResumeService()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    template_id: Optional[int] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and process resume file"""
    try:
        # Validate file type
        allowed_types = ['.pdf', '.docx', '.doc', '.txt']
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not supported. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Use resume service to process the file
        processing_result = await resume_service.process_resume_upload(content, file.filename, current_user.id)
        
        text_content = processing_result['text_content']
        parsed_data = processing_result['parsed_data']
        
        # Store in database
        resume_data = ResumeCreate(
            user_id=current_user.id,
            original_content=text_content,
            parsed_content=parsed_data,
            template_id=template_id or 1,
            version_name=f"Uploaded {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            file_name=file.filename,
            file_size=len(content)
        )
        
        db_resume = Resume(**resume_data.dict())
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        logger.info(f"Resume uploaded successfully for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Resume uploaded and processed successfully",
            "resume_id": db_resume.id,
            "parsed_data": parsed_data,
            "file_name": file.filename
        }
        
    except Exception as error:
        logger.error(f"Resume upload failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Resume upload failed: {str(error)}")

@router.get("/list")
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's resumes"""
    try:
        resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
        return {
            "success": True,
            "resumes": [
                {
                    "id": resume.id,
                    "version_name": resume.version_name,
                    "template_id": resume.template_id,
                    "file_name": resume.file_name,
                    "file_size": resume.file_size,
                    "created_at": resume.created_at,
                    "updated_at": resume.updated_at
                }
                for resume in resumes
            ]
        }
    except Exception as error:
        logger.error(f"Failed to list resumes: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve resumes")

@router.get("/{resume_id}")
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific resume"""
    try:
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return {
            "success": True,
            "resume": {
                "id": resume.id,
                "original_content": resume.original_content,
                "parsed_content": resume.parsed_content,
                "template_id": resume.template_id,
                "version_name": resume.version_name,
                "file_name": resume.file_name,
                "created_at": resume.created_at,
                "updated_at": resume.updated_at
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Failed to get resume: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve resume")

@router.post("/{resume_id}/tailor")
async def tailor_resume(
    resume_id: int,
    job_description: str,
    target_role: str,
    company: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tailor resume for specific job"""
    try:
        # Get resume
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Use AI service to tailor resume
        tailored_result = await ai_service.tailor_resume_for_job(
            resume_data=resume.parsed_content,
            job_description=job_description,
            target_role=target_role,
            company=company
        )
        
        # Create new tailored version
        tailored_resume = ResumeCreate(
            user_id=current_user.id,
            original_content=resume.original_content,
            parsed_content=tailored_result,
            template_id=resume.template_id,
            version_name=f"Tailored for {company} - {target_role}",
            parent_resume_id=resume.id
        )
        
        db_tailored = Resume(**tailored_resume.dict())
        db.add(db_tailored)
        db.commit()
        db.refresh(db_tailored)
        
        logger.info(f"Resume tailored successfully for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Resume tailored successfully",
            "tailored_resume_id": db_tailored.id,
            "tailored_result": tailored_result
        }
        
    except Exception as error:
        logger.error(f"Resume tailoring failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Resume tailoring failed: {str(error)}")

@router.get("/templates")
async def get_templates():
    """Get available resume templates"""
    templates = [
        {
            "id": 1,
            "name": "Modern",
            "description": "Clean and professional design",
            "ats_score": 95,
            "preview_url": "/templates/modern-preview.png"
        },
        {
            "id": 2,
            "name": "Classic",
            "description": "Traditional format with proven results",
            "ats_score": 98,
            "preview_url": "/templates/classic-preview.png"
        },
        {
            "id": 3,
            "name": "Creative",
            "description": "Stand out design for creative roles",
            "ats_score": 85,
            "preview_url": "/templates/creative-preview.png"
        },
        {
            "id": 4,
            "name": "Technical",
            "description": "Perfect for STEM and technical roles",
            "ats_score": 92,
            "preview_url": "/templates/technical-preview.png"
        }
    ]
    
    return {
        "success": True,
        "templates": templates
    }

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete resume"""
    try:
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        db.delete(resume)
        db.commit()
        
        logger.info(f"Resume {resume_id} deleted for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Resume deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Failed to delete resume: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete resume")

# Resume service handles all text extraction and parsing
