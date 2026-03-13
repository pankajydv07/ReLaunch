import axios from 'axios';
import type {
  UserProfile,
  AnalyzeProfileResponse,
  ResumeAnalysisResponse,
  InterviewQuestionResponse,
  EvaluateAnswerResponse,
} from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export async function analyzeProfile(data: UserProfile): Promise<AnalyzeProfileResponse> {
  const res = await api.post<AnalyzeProfileResponse>('/analyze-profile', data);
  return res.data;
}

export async function analyzeResume(
  file: File,
  targetRole: string
): Promise<ResumeAnalysisResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('target_role', targetRole);
  const res = await api.post<ResumeAnalysisResponse>('/analyze-resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getInterviewQuestion(role: string): Promise<InterviewQuestionResponse> {
  const res = await api.post<InterviewQuestionResponse>('/interview-question', { role });
  return res.data;
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<EvaluateAnswerResponse> {
  const res = await api.post<EvaluateAnswerResponse>('/evaluate-answer', { question, answer });
  return res.data;
}
