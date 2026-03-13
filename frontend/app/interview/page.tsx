import InterviewCoach from '@/components/InterviewCoach';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Interview Coach — ReLaunchAI',
  description:
    'Practice realistic AI-generated interview questions for your target role and get instant scored feedback.',
};

export default function InterviewPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        .voice-mode-btn:hover {
          border-color: var(--rose) !important;
          color: var(--cream) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: '720px', width: '100%', marginBottom: '3rem' }}>
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>AI Coach</p>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          Interview{' '}
          <span style={{ color: 'var(--rose)' }}>Prep</span>
        </h1>
        <p style={{ color: 'var(--cream-muted)', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          AI generates realistic interview questions and gives you a score out of 10 with detailed
          feedback — so you are ready when it counts.
        </p>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* TEXT mode — active */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--rose-muted)', border: '1px solid var(--rose)',
            fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne, sans-serif',
            color: 'var(--rose)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span>⌨</span> Text Mode
          </div>

          {/* VOICE mode — link */}
          <Link href="/interview/voice" style={{ textDecoration: 'none' }}>
            <div className="voice-mode-btn" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'transparent', border: '1px solid var(--border)',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne, sans-serif',
              color: 'var(--cream-muted)', letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}>
              <span>🎤</span> Voice Mode
              <span style={{
                fontSize: '0.6rem', background: 'var(--rose)', color: 'var(--bg-primary)',
                padding: '0.1rem 0.35rem', fontWeight: 700, letterSpacing: '0.08em',
              }}>
                NEW
              </span>
            </div>
          </Link>
        </div>
      </div>

      <InterviewCoach />
    </div>
  );
}
