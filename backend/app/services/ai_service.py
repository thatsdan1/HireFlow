import os
import openai
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Initialize client lazily to avoid import-time errors
        self._client = None
        self.model = "gpt-4"
        self.temperature = 0.7
        self.max_tokens = 2000
    
    @property
    def client(self):
        if self._client is None:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise Exception("OPENAI_API_KEY environment variable not set")
            self._client = openai.OpenAI(api_key=api_key)
        return self._client

    def _get_ai_response(self, system_prompt: str, user_prompt: str, context: Dict[str, Any] = None) -> str:
        """Get AI response with proper error handling and logging"""
        try:
            # Build the full prompt with context
            full_prompt = self._build_contextual_prompt(system_prompt, user_prompt, context)
            
            logger.info(f"AI Request - System: {system_prompt[:100]}...")
            logger.info(f"AI Request - User: {user_prompt[:100]}...")
            logger.info(f"AI Request - Context: {context}")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            ai_response = response.choices[0].message.content
            logger.info(f"AI Response: {ai_response[:200]}...")
            
            return ai_response
            
        except Exception as error:
            logger.error(f"Error getting AI response: {error}", exc_info=True)
            raise Exception(f"AI service error: {str(error)}")

    def _build_contextual_prompt(self, system_prompt: str, user_prompt: str, context: Dict[str, Any] = None) -> str:
        """Build contextual prompt with user data and retrieved context"""
        if not context:
            return user_prompt
            
        context_str = ""
        if context.get('user_resume'):
            context_str += f"\n\nUSER'S CURRENT RESUME:\n{context['user_resume']}"
        if context.get('job_description'):
            context_str += f"\n\nTARGET JOB DESCRIPTION:\n{context['job_description']}"
        if context.get('relevant_experience'):
            context_str += f"\n\nRELEVANT EXPERIENCE:\n{context['relevant_experience']}"
        if context.get('skills'):
            context_str += f"\n\nUSER'S SKILLS:\n{context['skills']}"
            
        return f"{user_prompt}\n{context_str}"

    async def tailor_resume_for_job(self, resume_data: Dict[str, Any], job_description: str, 
                                   target_role: str, company: str) -> Dict[str, Any]:
        """Tailor resume for specific job using actual user data"""
        
        # Build context from user's actual resume data
        context = {
            'user_resume': self._extract_resume_text(resume_data),
            'job_description': job_description,
            'target_role': target_role,
            'company': company
        }
        
        system_prompt = """You are an expert resume writer and career coach. Your task is to tailor a user's resume for a specific job application.

IMPORTANT RULES:
1. Use ONLY the information provided by the user
2. Do NOT fabricate or invent skills, experiences, or achievements
3. Tailor language and keywords to match the job requirements
4. Focus on quantifiable achievements where possible
5. Maintain the user's authentic voice and experience level
6. Provide specific, actionable suggestions for improvement"""

        user_prompt = f"""Please analyze this resume for the {target_role} position at {company} and provide:

1. Specific improvements to experience descriptions
2. Skills to highlight based on job requirements
3. Keywords to include for ATS optimization
4. Overall structure recommendations
5. ATS score improvement estimate (0-10 points)

Be specific and actionable. Use the user's actual experience and skills."""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            # Parse the AI response into structured format
            return {
                'tailored_resume': ai_response,
                'keywords': self._extract_keywords(ai_response),
                'ats_improvements': self._extract_ats_improvements(ai_response),
                'cover_letter_suggestions': self._extract_cover_letter_suggestions(ai_response),
                'score_improvement': self._extract_score_improvement(ai_response)
            }
            
        except Exception as error:
            logger.error(f"Resume tailoring failed: {error}")
            raise

    async def generate_cover_letter(self, resume_data: Dict[str, Any], job_description: str, 
                                   company: str, role: str, user_name: str) -> Dict[str, Any]:
        """Generate personalized cover letter using actual user data"""
        
        context = {
            'user_resume': self._extract_resume_text(resume_data),
            'job_description': job_description,
            'company': company,
            'role': role,
            'user_name': user_name
        }
        
        system_prompt = """You are an expert cover letter writer. Create a compelling, personalized cover letter that:

1. Uses ONLY the information provided by the user
2. Connects the user's actual experience to the job requirements
3. Shows genuine interest in the company and role
4. Maintains professional but engaging tone
5. Includes specific examples from the user's background
6. Is tailored to the company's culture and values"""

        user_prompt = f"""Write a cover letter for {user_name} applying to the {role} position at {company}.

The cover letter should:
- Highlight relevant experience from their resume
- Address specific requirements from the job description
- Show understanding of the company
- End with a strong call to action

Make it personal and specific to this user and job."""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            return {
                'cover_letter': ai_response,
                'key_talking_points': self._extract_talking_points(ai_response),
                'modifications': self._suggest_modifications(ai_response),
                'word_count': len(ai_response.split())
            }
            
        except Exception as error:
            logger.error(f"Cover letter generation failed: {error}")
            raise

    async def enhance_experience_descriptions(self, experience_text: str, target_role: str, 
                                           industry: str) -> Dict[str, Any]:  # FIXED: Changed from 'string' to 'str'
        """Enhance experience descriptions using AI"""
        
        context = {
            'experience_text': experience_text,
            'target_role': target_role,
            'industry': industry
        }
        
        system_prompt = """You are an expert at writing compelling experience descriptions for resumes. Your task is to enhance the provided experience text to:

1. Use action verbs and quantifiable achievements
2. Match the language and requirements of the target role
3. Include relevant keywords for ATS systems
4. Make descriptions more impactful and professional
5. Focus on results and outcomes, not just responsibilities"""

        user_prompt = f"""Please enhance this experience description for a {target_role} position in the {industry} industry:

Current Description: {experience_text}

Provide:
1. Enhanced description with action verbs and metrics
2. Specific improvements made
3. Keywords added for ATS optimization
4. Notes on industry-specific language used"""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            return {
                'enhanced_description': ai_response,
                'improvements': self._extract_improvements(ai_response),
                'suggested_metrics': self._extract_metrics(ai_response),
                'ats_notes': self._extract_ats_notes(ai_response)
            }
            
        except Exception as error:
            logger.error(f"Experience enhancement failed: {error}")
            raise

    async def analyze_job_description(self, job_description: str, company: str, 
                                    role: str) -> Dict[str, Any]:
        """Analyze job description and extract key insights"""
        
        context = {
            'job_description': job_description,
            'company': company,
            'role': role
        }
        
        system_prompt = """You are an expert job analyst and career coach. Analyze the provided job description to extract:

1. Key requirements and qualifications
2. Important skills and technologies
3. Company culture indicators
4. Salary and growth insights
5. Application strategy recommendations"""

        user_prompt = f"""Please analyze this job description for the {role} position at {company}:

Job Description: {job_description}

Provide a comprehensive analysis including:
- Required vs. preferred qualifications
- Key skills and technologies
- Company culture insights
- Salary range indicators
- Growth opportunities
- Application tips"""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            return {
                'requirements': self._extract_requirements(ai_response),
                'keywords': self._extract_keywords(ai_response),
                'company_culture': self._extract_culture(ai_response),
                'skills_to_highlight': self._extract_skills(ai_response),
                'salary_insights': self._extract_salary_insights(ai_response),
                'growth_opportunities': self._extract_growth(ai_response)
            }
            
        except Exception as error:
            logger.error(f"Job analysis failed: {error}")
            raise

    async def provide_career_guidance(self, user_profile: Dict[str, Any], 
                                    career_goals: str, current_challenges: str) -> Dict[str, Any]:
        """Provide personalized career guidance"""
        
        context = {
            'user_profile': user_profile,
            'career_goals': career_goals,
            'current_challenges': current_challenges
        }
        
        system_prompt = """You are an expert career coach with deep knowledge of the tech industry. Provide personalized career guidance that:

1. Addresses the user's specific situation and goals
2. Offers actionable advice and next steps
3. Considers their current experience level and background
4. Provides realistic timelines and expectations
5. Suggests relevant resources and learning paths"""

        user_prompt = f"""Please provide career guidance for this user:

Profile: {user_profile}
Career Goals: {career_goals}
Current Challenges: {current_challenges}

Provide:
1. Career development plan
2. Learning recommendations
3. Networking strategies
4. Project suggestions
5. Timeline for goals
6. Solutions to current challenges"""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            return {
                'career_plan': ai_response,
                'learning_recommendations': self._extract_learning_recs(ai_response),
                'networking_strategies': self._extract_networking(ai_response),
                'project_suggestions': self._extract_projects(ai_response),
                'timeline': self._extract_timeline(ai_response),
                'challenge_solutions': self._extract_solutions(ai_response)
            }
            
        except Exception as error:
            logger.error(f"Career guidance failed: {error}")
            raise

    async def optimize_for_ats(self, resume_data: Dict[str, Any], job_description: str, 
                              target_role: str, company: str) -> Dict[str, Any]:
        """Optimize resume for ATS systems"""
        
        context = {
            'user_resume': self._extract_resume_text(resume_data),
            'job_description': job_description,
            'target_role': target_role,
            'company': company
        }
        
        system_prompt = """You are an ATS (Applicant Tracking System) optimization expert. Your task is to:

1. Analyze keyword matching between resume and job
2. Identify missing important keywords
3. Suggest improvements for better ATS scoring
4. Optimize formatting and structure
5. Ensure maximum compatibility with ATS systems"""

        user_prompt = f"""Please optimize this resume for ATS systems for the {target_role} position at {company}.

Focus on:
- Keyword optimization and matching
- Format improvements for ATS parsing
- Structure recommendations
- Missing keywords to add
- ATS score improvement estimate"""

        try:
            ai_response = self._get_ai_response(system_prompt, user_prompt, context)
            
            return {
                'ats_optimization': ai_response,
                'keyword_analysis': self._analyze_keywords(resume_data, job_description),
                'format_recommendations': self._extract_format_recs(ai_response),
                'score_improvement': self._extract_score_improvement(ai_response)
            }
            
        except Exception as error:
            logger.error(f"ATS optimization failed: {error}")
            raise

    async def health_check(self) -> Dict[str, Any]:
        """Simple health check for AI service"""
        try:
            # Test OpenAI connection with a simple prompt
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Say 'OK' if you're working."}],
                max_tokens=10
            )
            
            if response.choices[0].message.content.strip().upper() == "OK":
                return {"status": "healthy", "message": "AI service is working properly"}
            else:
                return {"status": "unhealthy", "message": "AI service response unexpected"}
                
        except Exception as error:
            logger.error(f"AI health check failed: {error}")
            return {"status": "unhealthy", "message": f"AI service error: {str(error)}"}

    # Helper methods for extracting information from AI responses
    def _extract_resume_text(self, resume_data: Dict[str, Any]) -> str:
        """Extract text content from resume data"""
        text_parts = []
        
        if resume_data.get('personal'):
            personal = resume_data['personal']
            text_parts.append(f"Name: {personal.get('name', '')}")
            text_parts.append(f"Email: {personal.get('email', '')}")
            text_parts.append(f"Location: {personal.get('location', '')}")
        
        if resume_data.get('education'):
            for edu in resume_data['education']:
                text_parts.append(f"Education: {edu.get('school', '')} - {edu.get('degree', '')}")
        
        if resume_data.get('experience'):
            for exp in resume_data['experience']:
                text_parts.append(f"Experience: {exp.get('position', '')} at {exp.get('company', '')}")
                text_parts.append(f"Description: {exp.get('description', '')}")
        
        if resume_data.get('skills'):
            skills = [skill.get('name', '') for skill in resume_data['skills']]
            text_parts.append(f"Skills: {', '.join(skills)}")
        
        return '\n'.join(text_parts)

    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        # Simple keyword extraction - in production, use more sophisticated NLP
        common_keywords = ['python', 'javascript', 'react', 'node.js', 'aws', 'docker', 'sql', 'git']
        found_keywords = [word.lower() for word in text.split() if word.lower() in common_keywords]
        return list(set(found_keywords))

    def _extract_ats_improvements(self, text: str) -> List[str]:
        """Extract ATS improvement suggestions"""
        improvements = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['improve', 'add', 'include', 'optimize']):
                improvements.append(line.strip())
        return improvements

    def _extract_cover_letter_suggestions(self, text: str) -> str:
        """Extract cover letter suggestions"""
        # Find the section with cover letter suggestions
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if 'cover letter' in line.lower():
                return '\n'.join(lines[i:i+5])  # Return next 5 lines
        return "Cover letter suggestions not found in response"

    def _extract_score_improvement(self, text: str) -> int:
        """Extract score improvement estimate"""
        import re
        # Look for numbers followed by 'point' or 'score'
        match = re.search(r'(\d+)\s*(?:point|score)', text.lower())
        if match:
            return min(10, int(match.group(1)))  # Cap at 10 points
        return 5  # Default improvement

    def _extract_talking_points(self, text: str) -> List[str]:
        """Extract key talking points"""
        points = []
        lines = text.split('\n')
        for line in lines:
            if line.strip().startswith(('-', '•', '*', '1.', '2.', '3.')):
                points.append(line.strip())
        return points[:5]  # Return first 5 points

    def _suggest_modifications(self, text: str) -> Dict[str, str]:
        """Suggest modifications to cover letter"""
        return {
            'tone': 'Professional and engaging',
            'length': 'Keep under 300 words',
            'focus': 'Highlight relevant experience',
            'call_to_action': 'Include strong closing'
        }

    def _extract_improvements(self, text: str) -> List[str]:
        """Extract improvement suggestions"""
        improvements = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['improve', 'enhance', 'add', 'include']):
                improvements.append(line.strip())
        return improvements

    def _extract_metrics(self, text: str) -> List[str]:
        """Extract suggested metrics"""
        metrics = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['%', 'percent', 'increase', 'decrease', 'users', 'revenue']):
                metrics.append(line.strip())
        return metrics

    def _extract_ats_notes(self, text: str) -> str:
        """Extract ATS optimization notes"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if 'ats' in line.lower():
                return '\n'.join(lines[i:i+3])  # Return next 3 lines
        return "ATS optimization notes not found"

    def _extract_requirements(self, text: str) -> List[str]:
        """Extract job requirements"""
        requirements = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['required', 'requirement', 'qualification', 'must have']):
                requirements.append(line.strip())
        return requirements

    def _extract_culture(self, text: str) -> str:
        """Extract company culture insights"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['culture', 'environment', 'atmosphere', 'values']):
                return '\n'.join(lines[i:i+3])
        return "Company culture insights not found"

    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills to highlight"""
        skills = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['skill', 'technology', 'tool', 'framework']):
                skills.append(line.strip())
        return skills

    def _extract_salary_insights(self, text: str) -> str:
        """Extract salary insights"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['salary', 'compensation', 'pay', 'benefits']):
                return '\n'.join(lines[i:i+3])
        return "Salary insights not found"

    def _extract_growth(self, text: str) -> List[str]:
        """Extract growth opportunities"""
        opportunities = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['growth', 'advancement', 'career path', 'opportunity']):
                opportunities.append(line.strip())
        return opportunities

    def _extract_learning_recs(self, text: str) -> List[str]:
        """Extract learning recommendations"""
        recs = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['learn', 'study', 'course', 'certification']):
                recs.append(line.strip())
        return recs

    def _extract_networking(self, text: str) -> List[str]:
        """Extract networking strategies"""
        strategies = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['network', 'connect', 'meet', 'conference']):
                strategies.append(line.strip())
        return strategies

    def _extract_projects(self, text: str) -> List[str]:
        """Extract project suggestions"""
        projects = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['project', 'build', 'create', 'develop']):
                projects.append(line.strip())
        return projects

    def _extract_timeline(self, text: str) -> str:
        """Extract timeline information"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['timeline', 'schedule', 'plan', 'goal']):
                return '\n'.join(lines[i:i+3])
        return "Timeline information not found"

    def _extract_solutions(self, text: str) -> List[str]:
        """Extract challenge solutions"""
        solutions = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['solution', 'solve', 'overcome', 'address']):
                solutions.append(line.strip())
        return solutions

    def _analyze_keywords(self, resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        """Analyze keyword matching between resume and job"""
        resume_text = self._extract_resume_text(resume_data).lower()
        job_lower = job_description.lower()
        
        # Extract common tech keywords
        tech_keywords = ['python', 'javascript', 'react', 'node.js', 'aws', 'docker', 'sql', 'git']
        
        resume_keywords = [kw for kw in tech_keywords if kw in resume_text]
        job_keywords = [kw for kw in tech_keywords if kw in job_lower]
        
        matching_keywords = [kw for kw in resume_keywords if kw in job_keywords]
        missing_keywords = [kw for kw in job_keywords if kw not in resume_keywords]
        
        match_percentage = len(matching_keywords) / len(job_keywords) * 100 if job_keywords else 0
        
        return {
            'matching_keywords': matching_keywords,
            'missing_keywords': missing_keywords,
            'match_percentage': round(match_percentage, 1),
            'resume_keywords': resume_keywords,
            'job_keywords': job_keywords
        }

    def _extract_format_recs(self, text: str) -> List[str]:
        """Extract formatting recommendations"""
        recs = []
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['format', 'structure', 'layout', 'design']):
                recs.append(line.strip())
        return recs