import InterviewCoach from '@/components/InterviewCoach';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Coach — ReLaunchAI',
  description: 'Practice realistic AI-generated interview questions for your target role and get instant scored feedback.',
};

export default function InterviewPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '720px', width: '100%', marginBottom: '3rem' }}>
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>AI Coach</p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}>
          Interview{' '}
          <span style={{ color: 'var(--rose)' }}>Prep</span>
        </h1>
        <p style={{ color: 'var(--cream-muted)', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Your AI coach generates realistic interview questions and gives you a score out of 10 with detailed feedback — so you're ready when it counts.
        </p>
      </div>
      <InterviewCoach />
    </div>
  );
}
