export interface JobApplication {
  id: string;
  userId: string;
  resumeId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  followUpDate?: string;
  interviewDate?: string;
  offerDetails?: OfferDetails;
  feedback?: ApplicationFeedback;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  applicationDeadline?: string;
  url: string;
  source: 'linkedin' | 'indeed' | 'handshake' | 'company' | 'other';
  logo?: string;
  industry?: string;
  companySize?: string;
  matchScore?: number;
  missingSkills?: string[];
}

export type ApplicationStatus = 
  | 'interested'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface OfferDetails {
  salary: number;
  benefits: string[];
  startDate: string;
  equity?: number;
  bonus?: number;
  notes?: string;
}

export interface ApplicationFeedback {
  satisfaction: 1 | 2 | 3 | 4 | 5;
  interviewExperience?: string;
  companyCulture?: string;
  suggestions?: string;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number;
  averageResponseTime: number;
  interviewRate: number;
  offerRate: number;
  weeklyApplications: number;
  topCompanies: string[];
  topPositions: string[];
} 