from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserProfile
from app.services.auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's full profile"""
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        phone=current_user.phone,
        location=current_user.location,
        bio=current_user.bio,
        linkedin_url=current_user.linkedin_url,
        github_url=current_user.github_url,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    # Update only provided fields
    update_data = profile_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        phone=current_user.phone,
        location=current_user.location,
        bio=current_user.bio,
        linkedin_url=current_user.linkedin_url,
        github_url=current_user.github_url,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.delete("/profile")
async def delete_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current user's account"""
    current_user.is_active = False
    db.commit()
    
    return {"message": "User account deactivated successfully"} 