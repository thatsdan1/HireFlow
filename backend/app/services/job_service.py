import re
from typing import Dict, Any, List
from app.core.config import settings

async def analyze_job_description(description: str) -> Dict[str, Any]:
    """Analyze job description using AI to extract key information"""
    # TODO: Integrate with OpenAI for comprehensive analysis
    # For now, use basic NLP techniques
    
    analysis_result = {
        "skills_required": _extract_skills_from_description(description),
        "experience_level": _determine_experience_level(description),
        "industry": _identify_industry(description),
        "key_requirements": _extract_key_requirements(description)
    }
    
    return analysis_result

def _extract_skills_from_description(description: str) -> List[str]:
    """Extract technical skills from job description"""
    # Common technical skills patterns
    skill_patterns = [
        r'\b(?:Python|Java|JavaScript|React|Angular|Vue|Node\.js|SQL|MongoDB|AWS|Docker|Kubernetes|Git|Agile|Scrum)\b',
        r'\b(?:Machine Learning|AI|Data Science|Analytics|Statistics|R|TensorFlow|PyTorch|Scikit-learn)\b',
        r'\b(?:HTML|CSS|Bootstrap|jQuery|TypeScript|GraphQL|REST API|Microservices)\b',
        r'\b(?:Project Management|Leadership|Communication|Problem Solving|Team Work|Time Management)\b'
    ]
    
    skills = []
    for pattern in skill_patterns:
        matches = re.findall(pattern, description, re.IGNORECASE)
        skills.extend(matches)
    
    # Remove duplicates and normalize
    skills = list(set([skill.lower() for skill in skills if skill]))
    
    # Add common skills based on keywords
    additional_skills = []
    if any(word in description.lower() for word in ['web', 'frontend', 'ui']):
        additional_skills.extend(['html', 'css', 'javascript'])
    if any(word in description.lower() for word in ['data', 'database', 'sql']):
        additional_skills.extend(['sql', 'data analysis'])
    if any(word in description.lower() for word in ['mobile', 'app', 'ios', 'android']):
        additional_skills.extend(['mobile development', 'app development'])
    
    skills.extend(additional_skills)
    return list(set(skills))

def _determine_experience_level(description: str) -> str:
    """Determine the required experience level from job description"""
    description_lower = description.lower()
    
    # Experience level indicators
    if any(word in description_lower for word in ['senior', 'lead', 'principal', '5+ years', '7+ years']):
        return 'senior'
    elif any(word in description_lower for word in ['mid-level', 'mid level', '3+ years', '4+ years']):
        return 'mid'
    elif any(word in description_lower for word in ['junior', 'entry', '0-2 years', '1+ years']):
        return 'entry'
    elif any(word in description_lower for word in ['intern', 'internship', 'student']):
        return 'intern'
    else:
        return 'mid'  # Default to mid-level

def _identify_industry(description: str) -> str:
    """Identify the industry from job description"""
    description_lower = description.lower()
    
    industry_keywords = {
        'technology': ['software', 'tech', 'it', 'computer', 'programming', 'coding'],
        'finance': ['banking', 'financial', 'investment', 'trading', 'risk', 'compliance'],
        'healthcare': ['medical', 'health', 'pharmaceutical', 'clinical', 'patient'],
        'education': ['academic', 'learning', 'teaching', 'student', 'curriculum'],
        'retail': ['e-commerce', 'shopping', 'customer', 'sales', 'marketing'],
        'manufacturing': ['production', 'industrial', 'engineering', 'operations', 'supply chain']
    }
    
    for industry, keywords in industry_keywords.items():
        if any(keyword in description_lower for keyword in keywords):
            return industry
    
    return 'general'

def _extract_key_requirements(description: str) -> List[str]:
    """Extract key requirements and qualifications"""
    requirements = []
    
    # Look for requirement patterns
    requirement_patterns = [
        r'(?:Bachelor|Master|PhD|Degree)\s+(?:in|of)\s+([^,\n]+)',
        r'(?:Required|Must have|Requirements?):\s*([^.\n]+)',
        r'(?:Experience with|Knowledge of|Familiarity with)\s+([^,\n]+)'
    ]
    
    for pattern in requirement_patterns:
        matches = re.findall(pattern, description, re.IGNORECASE)
        requirements.extend(matches)
    
    # Clean up requirements
    requirements = [req.strip() for req in requirements if req.strip()]
    return requirements[:5]  # Limit to top 5 requirements

async def calculate_match_score(resume_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
    """Calculate match score between resume and job requirements"""
    if not resume_skills or not job_skills:
        return {
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": job_skills,
            "match_percentage": 0.0
        }
    
    # Normalize skills for comparison
    resume_skills_normalized = [skill.lower().strip() for skill in resume_skills]
    job_skills_normalized = [skill.lower().strip() for skill in job_skills]
    
    # Find matching skills
    matched_skills = []
    for job_skill in job_skills_normalized:
        # Check for exact matches and partial matches
        for resume_skill in resume_skills_normalized:
            if (job_skill in resume_skill or 
                resume_skill in job_skill or 
                any(word in resume_skill for word in job_skill.split())):
                matched_skills.append(job_skill)
                break
    
    # Calculate match score
    match_percentage = (len(matched_skills) / len(job_skills_normalized)) * 100
    match_score = int(match_percentage)
    
    # Find missing skills
    missing_skills = [skill for skill in job_skills_normalized if skill not in matched_skills]
    
    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": round(match_percentage, 1)
    }

async def enhance_job_analysis_with_ai(description: str) -> Dict[str, Any]:
    """Enhance job analysis using OpenAI (placeholder)"""
    # TODO: Integrate with OpenAI for:
    # - Advanced skill extraction
    # - Industry classification
    # - Experience level determination
    # - Salary range estimation
    # - Company culture insights
    
    return {
        "ai_enhanced_skills": [],
        "industry_confidence": 0.0,
        "experience_level_confidence": 0.0,
        "salary_insights": {},
        "company_culture_indicators": []
    } 