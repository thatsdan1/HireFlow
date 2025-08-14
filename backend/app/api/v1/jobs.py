from fastapi import APIRouter, Depends, HTTPException, Form
from typing import Dict, Any, List, Optional
import logging
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse

from app.services.auth import get_current_user
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.job import JobDescription, JobDescriptionCreate
from app.services.ai_service import AIService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/jobs", tags=["jobs"])

ai_service = AIService()

@router.post("/analyze")
async def analyze_job(
    job_url: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    company: str = Form(...),
    role: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze job description from URL or pasted text"""
    try:
        # Get job description from URL or use provided text
        if job_url:
            scraped_description = await scrape_job_description(job_url)
            if scraped_description:
                final_description = scraped_description
                logger.info(f"Job description scraped successfully from {job_url}")
            else:
                # If scraping fails, use manual input if provided
                if not job_description:
                    raise HTTPException(
                        status_code=400, 
                        detail="Could not scrape job description from URL. Please paste the description manually."
                    )
                final_description = job_description
                logger.warning(f"Job scraping failed for {job_url}, using manual input")
        else:
            if not job_description:
                raise HTTPException(
                    status_code=400, 
                    detail="Either job URL or job description must be provided"
                )
            final_description = job_description
        
        # Use AI to analyze the job description
        analysis_result = await ai_service.analyze_job_description(
            job_description=final_description,
            company=company,
            role=role
        )
        
        # Store job description in database
        job_data = JobDescriptionCreate(
            user_id=current_user.id,
            company_name=company,
            job_title=role,
            description_text=final_description,
            requirements_extracted=str(analysis_result.get('requirements', [])),
            job_url=job_url,
            keywords=str(analysis_result.get('keywords', [])),
            company_culture=analysis_result.get('company_culture', ''),
            skills_to_highlight=str(analysis_result.get('skills_to_highlight', []))
        )
        
        db_job = JobDescription(**job_data.dict())
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        
        logger.info(f"Job analysis completed successfully for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Job analyzed successfully",
            "job_id": db_job.id,
            "analysis": analysis_result,
            "scraped": bool(scraped_description if job_url else False)
        }
        
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Job analysis failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Job analysis failed: {str(error)}")

@router.get("/list")
async def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's analyzed jobs"""
    try:
        jobs = db.query(JobDescription).filter(JobDescription.user_id == current_user.id).all()
        return {
            "success": True,
            "jobs": [
                {
                    "id": job.id,
                    "company_name": job.company_name,
                    "job_title": job.job_title,
                    "description_text": job.description_text[:200] + "..." if len(job.description_text) > 200 else job.description_text,
                    "job_url": job.job_url,
                    "keywords": eval(job.keywords) if job.keywords else [],
                    "company_culture": job.company_culture,
                    "skills_to_highlight": eval(job.skills_to_highlight) if job.skills_to_highlight else [],
                    "created_at": job.created_at
                }
                for job in jobs
            ]
        }
    except Exception as error:
        logger.error(f"Failed to list jobs: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve jobs")

@router.get("/{job_id}")
async def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific job analysis"""
    try:
        job = db.query(JobDescription).filter(
            JobDescription.id == job_id,
            JobDescription.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "success": True,
            "job": {
                "id": job.id,
                "company_name": job.company_name,
                "job_title": job.job_title,
                "description_text": job.description_text,
                "requirements_extracted": job.requirements_extracted,
                "job_url": job.job_url,
                "keywords": eval(job.keywords) if job.keywords else [],
                "company_culture": job.company_culture,
                "skills_to_highlight": eval(job.skills_to_highlight) if job.skills_to_highlight else [],
                "created_at": job.created_at
            }
        }
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Failed to get job: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve job")

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete job analysis"""
    try:
        job = db.query(JobDescription).filter(
            JobDescription.id == job_id,
            JobDescription.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        db.delete(job)
        db.commit()
        
        logger.info(f"Job {job_id} deleted for user {current_user.id}")
        
        return {
            "success": True,
            "message": "Job deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Failed to delete job: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete job")

@router.post("/scrape")
async def scrape_job_url(
    url: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    """Scrape job description from URL"""
    try:
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        # Validate URL format
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # Scrape the job description
        description = await scrape_job_description(url)
        
        if not description:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract job description from this URL. Please paste the description manually."
            )
        
        logger.info(f"Job description scraped successfully from {url}")
        
        return {
            "success": True,
            "message": "Job description scraped successfully",
            "description": description,
            "url": url
        }
        
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Job scraping failed: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Job scraping failed: {str(error)}")

async def scrape_job_description(url: str) -> Optional[str]:
    """Scrape job description from various job sites"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Common selectors for job descriptions across different sites
        selectors = [
            # LinkedIn
            '.job-description',
            '.description__text',
            '[data-testid="job-description"]',
            
            # Indeed
            '#jobDescriptionText',
            '.job-description',
            '[data-testid="job-description"]',
            
            # Glassdoor
            '.jobDescriptionContent',
            '.desc',
            '.job-description',
            
            # General
            '.description',
            '.job-description',
            '.content',
            '.text',
            '[class*="description"]',
            '[class*="content"]',
            '[id*="description"]',
            '[id*="content"]'
        ]
        
        # Try each selector
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                # Get the element with the most text content
                best_element = max(elements, key=lambda x: len(x.get_text()))
                text = best_element.get_text(strip=True)
                
                # Clean up the text
                cleaned_text = clean_job_description(text)
                
                if len(cleaned_text) > 100:  # Ensure we have substantial content
                    return cleaned_text
        
        # If no specific selectors work, try to find the largest text block
        text_elements = soup.find_all(['p', 'div', 'span'])
        if text_elements:
            # Find the element with the most text that might be a job description
            best_element = max(text_elements, key=lambda x: len(x.get_text()))
            text = best_element.get_text(strip=True)
            
            # Check if it looks like a job description
            if is_job_description(text):
                cleaned_text = clean_job_description(text)
                if len(cleaned_text) > 100:
                    return cleaned_text
        
        return None
        
    except Exception as error:
        logger.error(f"Error scraping job description from {url}: {error}")
        return None

def clean_job_description(text: str) -> str:
    """Clean and format job description text"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove common unwanted patterns
    unwanted_patterns = [
        r'cookie\s+policy',
        r'privacy\s+policy',
        r'terms\s+of\s+service',
        r'©\s+\d{4}.*',
        r'all\s+rights\s+reserved',
        r'apply\s+now',
        r'submit\s+application',
        r'back\s+to\s+top',
        r'close\s+window',
        r'×',  # Close button
        r'‹',  # Navigation arrows
        r'›',
        r'←',
        r'→'
    ]
    
    for pattern in unwanted_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # Remove lines that are too short (likely navigation or UI elements)
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        if len(line) > 10:  # Only keep substantial lines
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def is_job_description(text: str) -> bool:
    """Check if text looks like a job description"""
    if not text or len(text) < 100:
        return False
    
    # Look for job description indicators
    job_indicators = [
        'responsibilities',
        'requirements',
        'qualifications',
        'experience',
        'skills',
        'duties',
        'job',
        'position',
        'role',
        'work',
        'develop',
        'implement',
        'manage',
        'coordinate',
        'analyze',
        'design',
        'build',
        'create',
        'maintain',
        'support'
    ]
    
    text_lower = text.lower()
    indicator_count = sum(1 for indicator in job_indicators if indicator in text_lower)
    
    # If we find multiple job-related terms, it's likely a job description
    return indicator_count >= 3
