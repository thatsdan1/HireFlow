import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Types for AI service requests and responses
export interface ResumeTailoringRequest {
  resume_data: any;
  job_description: string;
  target_role: string;
  company: string;
}

export interface ResumeTailoringResponse {
  tailored_resume: any;
  keywords: string[];
  ats_improvements: string[];
  cover_letter_suggestions: string;
  score_improvement: number;
}

export interface CoverLetterRequest {
  resume_data: any;
  job_description: string;
  company: string;
  role: string;
  user_name: string;
}

export interface CoverLetterResponse {
  cover_letter: string;
  key_talking_points: string[];
  modifications: any;
  word_count: number;
}

export interface ExperienceEnhancementRequest {
  experience_text: string;
  target_role: string;
  industry: string;
}

export interface ExperienceEnhancementResponse {
  enhanced_description: string;
  improvements: string[];
  suggested_metrics: string[];
  ats_notes: string;
}

export interface JobAnalysisRequest {
  job_description: string;
  company: string;
  role: string;
}

export interface JobAnalysisResponse {
  requirements: string[];
  keywords: string[];
  company_culture: string;
  skills_to_highlight: string[];
  salary_insights: string;
  growth_opportunities: string[];
}

export interface CareerGuidanceRequest {
  user_profile: any;
  career_goals: string;
  current_challenges: string;
}

export interface CareerGuidanceResponse {
  career_plan: string;
  learning_recommendations: string[];
  networking_strategies: string[];
  project_suggestions: string[];
  timeline: string;
  challenge_solutions: string[];
}

class AIService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async tailorResumeForJob(request: ResumeTailoringRequest): Promise<ResumeTailoringResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/tailor-resume`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw error;
    }
  }

  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/generate-cover-letter`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  async enhanceExperience(request: ExperienceEnhancementRequest): Promise<ExperienceEnhancementResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/enhance-experience`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error enhancing experience:', error);
      throw error;
    }
  }

  async analyzeJobDescription(request: JobAnalysisRequest): Promise<JobAnalysisResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/analyze-job`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing job description:', error);
      throw error;
    }
  }

  async provideCareerGuidance(request: CareerGuidanceRequest): Promise<CareerGuidanceResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/career-guidance`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error providing career guidance:', error);
      throw error;
    }
  }

  async optimizeForATS(request: ResumeTailoringRequest): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/ats-optimization`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error optimizing for ATS:', error);
      throw error;
    }
  }

  async bulkResumeAnalysis(requests: ResumeTailoringRequest[]): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/bulk-resume-analysis`,
        requests,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error performing bulk resume analysis:', error);
      throw error;
    }
  }

  async checkAIHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/health`);
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }

  // Helper method to format AI responses for display
  formatAIResponse(response: any, type: string): string {
    switch (type) {
      case 'resume_tailoring':
        return this.formatResumeTailoringResponse(response);
      case 'cover_letter':
        return this.formatCoverLetterResponse(response);
      case 'experience_enhancement':
        return this.formatExperienceEnhancementResponse(response);
      case 'job_analysis':
        return this.formatJobAnalysisResponse(response);
      case 'career_guidance':
        return this.formatCareerGuidanceResponse(response);
      default:
        return JSON.stringify(response, null, 2);
    }
  }

  private formatResumeTailoringResponse(response: ResumeTailoringResponse): string {
    let formatted = '## Resume Tailoring Results\n\n';
    
    if (response.keywords.length > 0) {
      formatted += '### Key Keywords to Include\n';
      formatted += response.keywords.map(kw => `- ${kw}`).join('\n') + '\n\n';
    }
    
    if (response.ats_improvements.length > 0) {
      formatted += '### ATS Improvements\n';
      formatted += response.ats_improvements.map(imp => `- ${imp}`).join('\n') + '\n\n';
    }
    
    if (response.score_improvement > 0) {
      formatted += `### Score Improvement: +${response.score_improvement}%\n\n`;
    }
    
    if (response.cover_letter_suggestions) {
      formatted += '### Cover Letter Suggestions\n';
      formatted += response.cover_letter_suggestions + '\n\n';
    }
    
    return formatted;
  }

  private formatCoverLetterResponse(response: CoverLetterResponse): string {
    let formatted = '## Cover Letter Generated\n\n';
    formatted += response.cover_letter + '\n\n';
    
    if (response.key_talking_points.length > 0) {
      formatted += '### Key Talking Points\n';
      formatted += response.key_talking_points.map(point => `- ${point}`).join('\n') + '\n';
    }
    
    formatted += `\n**Word Count:** ${response.word_count}`;
    return formatted;
  }

  private formatExperienceEnhancementResponse(response: ExperienceEnhancementResponse): string {
    let formatted = '## Enhanced Experience Description\n\n';
    formatted += response.enhanced_description + '\n\n';
    
    if (response.improvements.length > 0) {
      formatted += '### Key Improvements Made\n';
      formatted += response.improvements.map(imp => `- ${imp}`).join('\n') + '\n';
    }
    
    if (response.suggested_metrics.length > 0) {
      formatted += '### Suggested Metrics to Add\n';
      formatted += response.suggested_metrics.map(metric => `- ${metric}`).join('\n') + '\n';
    }
    
    if (response.ats_notes) {
      formatted += '### ATS Optimization Notes\n';
      formatted += response.ats_notes + '\n';
    }
    
    return formatted;
  }

  private formatJobAnalysisResponse(response: JobAnalysisResponse): string {
    let formatted = '## Job Analysis Results\n\n';
    
    if (response.requirements.length > 0) {
      formatted += '### Key Requirements\n';
      formatted += response.requirements.map(req => `- ${req}`).join('\n') + '\n';
    }
    
    if (response.keywords.length > 0) {
      formatted += '### Important Keywords\n';
      formatted += response.keywords.map(kw => `- ${kw}`).join('\n') + '\n';
    }
    
    if (response.skills_to_highlight.length > 0) {
      formatted += '### Skills to Highlight\n';
      formatted += response.skills_to_highlight.map(skill => `- ${skill}`).join('\n') + '\n';
    }
    
    if (response.company_culture) {
      formatted += '### Company Culture Insights\n';
      formatted += response.company_culture + '\n\n';
    }
    
    if (response.salary_insights) {
      formatted += '### Salary Insights\n';
      formatted += response.salary_insights + '\n\n';
    }
    
    if (response.growth_opportunities.length > 0) {
      formatted += '### Growth Opportunities\n';
      formatted += response.growth_opportunities.map(opp => `- ${opp}`).join('\n') + '\n';
    }
    
    return formatted;
  }

  private formatCareerGuidanceResponse(response: CareerGuidanceResponse): string {
    let formatted = '## Career Development Plan\n\n';
    formatted += response.career_plan + '\n\n';
    
    if (response.learning_recommendations.length > 0) {
      formatted += '### Learning Recommendations\n';
      formatted += response.learning_recommendations.map(rec => `- ${rec}`).join('\n') + '\n';
    }
    
    if (response.networking_strategies.length > 0) {
      formatted += '### Networking Strategies\n';
      formatted += response.networking_strategies.map(strategy => `- ${strategy}`).join('\n') + '\n';
    }
    
    if (response.project_suggestions.length > 0) {
      formatted += '### Project Suggestions\n';
      formatted += response.project_suggestions.map(project => `- ${project}`).join('\n') + '\n';
    }
    
    if (response.timeline) {
      formatted += '### Timeline Expectations\n';
      formatted += response.timeline + '\n\n';
    }
    
    if (response.challenge_solutions.length > 0) {
      formatted += '### Challenge Solutions\n';
      formatted += response.challenge_solutions.map(solution => `- ${solution}`).join('\n') + '\n';
    }
    
    return formatted;
  }
}

export const aiService = new AIService();
export default aiService; 