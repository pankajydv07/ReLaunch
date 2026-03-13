export interface UserProfile {
  previous_role: string;
  experience_years: number;
  career_gap_years: number;
  skills: string[];
  target_role: string;
}

export interface ReturnshipProgram {
  name: string;
  company: string;
  url?: string;
  description?: string;
  duration?: string;
  roles?: string[];
  location?: string;
}

export interface AnalyzeProfileResponse {
  missing_skills: string[];
  roadmap: string[];
  recommended_roles: string[];
  returnship_programs: ReturnshipProgram[];
}

export interface ResumeAnalysisResponse {
  ats_score: number;
  missing_keywords: string[];
  suggestions: string[];
}

export interface InterviewQuestionResponse {
  question: string;
}

export interface EvaluateAnswerResponse {
  score: number;
  feedback: string;
}
