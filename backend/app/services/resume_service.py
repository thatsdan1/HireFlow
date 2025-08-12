import os
import uuid
from typing import Dict, Any
from fastapi import UploadFile
import PyPDF2
from docx import Document
from app.core.config import settings

async def process_resume_file(file: UploadFile, user_id: int) -> str:
    """Process and save uploaded resume file"""
    # Create user-specific upload directory
    user_upload_dir = os.path.join(settings.UPLOAD_DIR, str(user_id))
    os.makedirs(user_upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(user_upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return file_path

async def extract_resume_content(file_path: str, file_type: str) -> Dict[str, Any]:
    """Extract text content from resume file"""
    try:
        if file_type == "application/pdf":
            return await _extract_pdf_content(file_path)
        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return await _extract_docx_content(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    except Exception as e:
        # Return basic content if extraction fails
        return {
            "raw_content": f"Error extracting content: {str(e)}",
            "structured_content": {},
            "skills": [],
            "experience_summary": ""
        }

async def _extract_pdf_content(file_path: str) -> Dict[str, Any]:
    """Extract content from PDF file"""
    with open(file_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text_content = ""
        
        for page in pdf_reader.pages:
            text_content += page.extract_text()
    
    # Basic content structuring (can be enhanced with AI)
    structured_content = _structure_resume_content(text_content)
    
    return {
        "raw_content": text_content,
        "structured_content": structured_content,
        "skills": structured_content.get("skills", []),
        "experience_summary": structured_content.get("experience_summary", "")
    }

async def _extract_docx_content(file_path: str) -> Dict[str, Any]:
    """Extract content from DOCX file"""
    doc = Document(file_path)
    text_content = ""
    
    for paragraph in doc.paragraphs:
        text_content += paragraph.text + "\n"
    
    # Basic content structuring (can be enhanced with AI)
    structured_content = _structure_resume_content(text_content)
    
    return {
        "raw_content": text_content,
        "structured_content": structured_content,
        "skills": structured_content.get("skills", []),
        "experience_summary": structured_content.get("experience_summary", "")
    }

def _structure_resume_content(text: str) -> Dict[str, Any]:
    """Basic resume content structuring (placeholder for AI enhancement)"""
    # This is a basic implementation - in production, use AI to parse
    lines = text.split('\n')
    
    structured_content = {
        "contact_info": {},
        "summary": "",
        "experience": [],
        "education": [],
        "skills": [],
        "certifications": []
    }
    
    # Basic parsing logic (simplified)
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect sections (basic heuristics)
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in ['experience', 'work history', 'employment']):
            current_section = 'experience'
        elif any(keyword in lower_line for keyword in ['education', 'academic', 'degree']):
            current_section = 'education'
        elif any(keyword in lower_line for keyword in ['skills', 'technical skills', 'competencies']):
            current_section = 'skills'
        elif any(keyword in lower_line for keyword in ['summary', 'objective', 'profile']):
            current_section = 'summary'
        elif current_section == 'summary':
            structured_content['summary'] += line + " "
        elif current_section == 'skills':
            # Extract skills from comma-separated or bullet-pointed lists
            skills = [skill.strip() for skill in line.replace('•', ',').replace('-', ',').split(',')]
            structured_content['skills'].extend([s for s in skills if s])
    
    # Clean up skills
    structured_content['skills'] = list(set([s for s in structured_content['skills'] if len(s) > 2]))
    
    # Generate basic experience summary
    if structured_content['experience']:
        structured_content['experience_summary'] = f"Experience in {len(structured_content['experience'])} roles"
    else:
        structured_content['experience_summary'] = "Entry-level position"
    
    return structured_content

async def enhance_resume_with_ai(resume_content: str) -> Dict[str, Any]:
    """Enhance resume content using AI (placeholder for OpenAI integration)"""
    # TODO: Integrate with OpenAI for content enhancement
    # This would include:
    # - Skill extraction and categorization
    # - Experience summarization
    # - Content optimization suggestions
    
    return {
        "enhanced_skills": [],
        "experience_summary": "",
        "optimization_suggestions": [],
        "keyword_analysis": {}
    } 