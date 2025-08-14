from fastapi import APIRouter, Depends, HTTPException, Form
from typing import Dict, Any, List, Optional
import logging

from app.services.auth import get_current_user
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.application_service import ApplicationService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/applications", tags=["applications"])

application_service = ApplicationService()

@router.post("/create")
async def create_application(
    resume_id: int = Form(...),
    job_id: int = Form(...),
    company: str = Form(...),
    position: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job application"""
    try:
        result = await application_service.create_application(
            db=db,
            user_id=current_user.id,
            resume_id=resume_id,
            job_id=job_id,
            company=company,
            position=position
        )
        
        return result
        
    except Exception as error:
        logger.error(f"Application creation failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/list")
async def list_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's applications"""
    try:
        result = await application_service.get_user_applications(db, current_user.id)
        return result
        
    except Exception as error:
        logger.error(f"Failed to list applications: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/stats")
async def get_application_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get application statistics for dashboard"""
    try:
        result = await application_service.get_application_stats(db, current_user.id)
        return result
        
    except Exception as error:
        logger.error(f"Failed to get application stats: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.put("/{application_id}/status")
async def update_application_status(
    application_id: int,
    new_status: str = Form(...),
    notes: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status"""
    try:
        result = await application_service.update_application_status(
            db=db,
            application_id=application_id,
            user_id=current_user.id,
            new_status=new_status,
            notes=notes
        )
        
        return result
        
    except Exception as error:
        logger.error(f"Status update failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/{application_id}/notes")
async def add_application_notes(
    application_id: int,
    notes: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add notes to an application"""
    try:
        result = await application_service.add_application_notes(
            db=db,
            application_id=application_id,
            user_id=current_user.id,
            notes=notes
        )
        
        return result
        
    except Exception as error:
        logger.error(f"Failed to add notes: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/{application_id}")
async def get_application_details(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed application information"""
    try:
        result = await application_service.get_application_details(
            db=db,
            application_id=application_id,
            user_id=current_user.id
        )
        
        return result
        
    except Exception as error:
        logger.error(f"Failed to get application details: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.delete("/{application_id}")
async def delete_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an application"""
    try:
        result = await application_service.delete_application(
            db=db,
            application_id=application_id,
            user_id=current_user.id
        )
        
        return result
        
    except Exception as error:
        logger.error(f"Failed to delete application: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/status/options")
async def get_status_options():
    """Get available application status options"""
    return {
        "success": True,
        "status_options": application_service.get_status_options(),
        "display_names": application_service.get_status_display_names()
    }
