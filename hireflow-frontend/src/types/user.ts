export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  plan: 'free' | 'premium' | 'enterprise';
  isEduEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  careerGoals: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university?: string;
  major?: string;
  graduationYear?: number;
} 