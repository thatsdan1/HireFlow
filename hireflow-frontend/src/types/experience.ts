export interface ExperienceType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  examples: string[];
}

export interface TranslationResult {
  original: string;
  professional: string;
  confidence: number;
  improvements: string[];
  keywords: string[];
}

export interface ExperienceFormData {
  type: string;
  description: string;
  role?: string;
  duration?: string;
  teamSize?: number;
  technologies?: string[];
  outcomes?: string[];
} 