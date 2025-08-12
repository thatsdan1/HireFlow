export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: string;
  sections: ResumeSection[];
  metadata: ResumeMetadata;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  order: number;
  isVisible: boolean;
}

export type SectionType = 
  | 'personal-info'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'activities'
  | 'awards'
  | 'coursework'
  | 'research'
  | 'volunteer'
  | 'athletics';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  minor?: string;
  gpa?: number;
  startDate: string;
  endDate?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  url?: string;
  github?: string;
  teamSize?: number;
  role?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'other';
}

export interface ResumeMetadata {
  atsScore: number;
  wordCount: number;
  lastOptimized: string;
  tags: string[];
  targetJob?: string;
  targetCompany?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  preview: string;
  isPopular: boolean;
  isFree: boolean;
} 