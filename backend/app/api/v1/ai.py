from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.services.ai_service import AIService
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["AI Services"])
security = HTTPBearer()
ai_service = AIService()

# Request Models
class ResumeTailoringRequest(BaseModel):
    resume_data: Dict[str, Any]
    job_description: str
    target_role: str
    company: str

class CoverLetterRequest(BaseModel):
    resume_data: Dict[str, Any]
    job_description: str
    company: str
    role: str
    user_name: str

class ExperienceEnhancementRequest(BaseModel):
    experience_text: str
    target_role: str
    industry: str

class JobAnalysisRequest(BaseModel):
    job_description: str
    company: str
    role: str

class CareerGuidanceRequest(BaseModel):
    user_profile: Dict[str, Any]
    career_goals: str
    current_challenges: str

# Response Models
class ResumeTailoringResponse(BaseModel):
    tailored_resume: Dict[str, Any]
    keywords: list
    ats_improvements: list
    cover_letter_suggestions: str
    score_improvement: int

class CoverLetterResponse(BaseModel):
    cover_letter: str
    key_talking_points: list
    modifications: Dict[str, Any]
    word_count: int

class ExperienceEnhancementResponse(BaseModel):
    enhanced_description: str
    improvements: list
    suggested_metrics: list
    ats_notes: str

class JobAnalysisResponse(BaseModel):
    requirements: list
    keywords: list
    company_culture: str
    skills_to_highlight: list
    salary_insights: str
    growth_opportunities: list

class CareerGuidanceResponse(BaseModel):
    career_plan: str
    learning_recommendations: list
    networking_strategies: list
    project_suggestions: list
    timeline: str
    challenge_solutions: list

@router.post("/tailor-resume", response_model=ResumeTailoringResponse)
async def tailor_resume_for_job(
    request: ResumeTailoringRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Tailor a resume for a specific job using AI analysis
    """
    try:
        result = await ai_service.tailor_resume_for_job(
            resume_data=request.resume_data,
            job_description=request.job_description,
            target_role=request.target_role,
            company=request.company
        )
        return ResumeTailoringResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to tailor resume: {str(e)}"
        )

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(
    request: CoverLetterRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a personalized cover letter for a specific job
    """
    try:
        result = await ai_service.generate_cover_letter(
            resume_data=request.resume_data,
            job_description=request.job_description,
            company=request.company,
            role=request.role,
            user_name=request.user_name
        )
        return CoverLetterResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cover letter: {str(e)}"
        )

@router.post("/enhance-experience", response_model=ExperienceEnhancementResponse)
async def enhance_experience_descriptions(
    request: ExperienceEnhancementRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Enhance experience descriptions using AI to make them more impactful
    """
    try:
        result = await ai_service.enhance_experience_descriptions(
            experience_text=request.experience_text,
            target_role=request.target_role,
            industry=request.industry
        )
        return ExperienceEnhancementResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enhance experience: {str(e)}"
        )

@router.post("/analyze-job", response_model=JobAnalysisResponse)
async def analyze_job_description(
    request: JobAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze a job description to extract key requirements and insights
    """
    try:
        result = await ai_service.analyze_job_description(
            job_description=request.job_description,
            company=request.company,
            role=request.role
        )
        return JobAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze job description: {str(e)}"
        )

@router.post("/career-guidance", response_model=CareerGuidanceResponse)
async def provide_career_guidance(
    request: CareerGuidanceRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Provide personalized career guidance based on user profile and goals
    """
    try:
        result = await ai_service.provide_career_guidance(
            user_profile=request.user_profile,
            career_goals=request.career_goals,
            current_challenges=request.current_challenges
        )
        return CareerGuidanceResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to provide career guidance: {str(e)}"
        )

@router.get("/health")
async def ai_health_check():
    """
    Check if the AI service is working properly
    """
    try:
        is_healthy = await ai_service.health_check()
        if is_healthy:
            return {"status": "healthy", "message": "AI service is working properly"}
        else:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is not responding"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service health check failed: {str(e)}"
        )

@router.post("/bulk-resume-analysis")
async def bulk_resume_analysis(
    resumes: list[ResumeTailoringRequest],
    current_user: User = Depends(get_current_user)
):
    """
    Analyze multiple resumes for different job applications
    """
    try:
        results = []
        for resume_request in resumes:
            result = await ai_service.tailor_resume_for_job(
                resume_data=resume_request.resume_data,
                job_description=resume_request.job_description,
                target_role=resume_request.target_role,
                company=resume_request.company
            )
            results.append({
                "company": resume_request.company,
                "role": resume_request.target_role,
                "analysis": result
            })
        
        return {
            "total_analyzed": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk resume analysis: {str(e)}"
        )

@router.post("/ats-optimization")
async def optimize_for_ats(
    request: ResumeTailoringRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Specifically optimize a resume for ATS (Applicant Tracking System) compatibility
    """
    try:
        # Focus on ATS optimization
        result = await ai_service.tailor_resume_for_job(
            resume_data=request.resume_data,
            job_description=request.job_description,
            target_role=request.target_role,
            company=request.company
        )
        
        # Extract ATS-specific improvements
        ats_optimized = {
            "keywords": result.get("keywords", []),
            "ats_improvements": result.get("ats_improvements", []),
            "score_improvement": result.get("score_improvement", 0),
            "formatting_suggestions": [
                "Use standard section headers",
                "Include relevant keywords naturally",
                "Use bullet points for achievements",
                "Avoid graphics and complex formatting"
            ]
        }
        
        return ats_optimized
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to optimize for ATS: {str(e)}"
        ) 