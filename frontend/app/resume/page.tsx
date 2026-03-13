import ResumeUpload from '@/components/ResumeUpload';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Analyser — ReLaunchAI',
  description: 'Upload your PDF resume and get an ATS score, missing keywords, and actionable improvement suggestions powered by AI.',
};

export default function ResumePage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '720px', width: '100%', marginBottom: '3rem' }}>
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>ATS Optimiser</p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}>
          Resume{' '}
          <span style={{ color: 'var(--rose)' }}>Analysis</span>
        </h1>
        <p style={{ color: 'var(--cream-muted)', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Upload your PDF resume and instantly get your ATS compatibility score, missing keywords, and specific improvements to land more interviews.
        </p>
      </div>
      <ResumeUpload />
    </div>
  );
}
