import VoiceInterviewCoach from '@/components/VoiceInterviewCoach';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Voice Interview Coach — ReLaunchAI',
  description:
    'AI-powered voice interview practice. Speak your answers, get instant transcription via AssemblyAI, and scored feedback delivered by ElevenLabs voice.',
};

export default function VoiceInterviewPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div style={{ maxWidth: '900px', width: '100%', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/interview">
            <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}>
              ← Text Mode
            </button>
          </Link>
          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>🎤 Voice Mode</span>
        </div>

        <p className="section-label" style={{ marginBottom: '0.5rem' }}>Voice AI Coach</p>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}
        >
          Conversational{' '}
          <span style={{ color: 'var(--rose)' }}>Interview Practice</span>
        </h1>
        <p style={{ color: 'var(--cream-muted)', maxWidth: '560px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Your AI coach asks real interview questions out loud. Answer with your voice —
          AssemblyAI transcribes it, Gemini evaluates it, ElevenLabs reads the feedback back to you.
          Full transcript included.
        </p>

        {/* Tech badges */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {[
            { label: 'AssemblyAI', desc: 'Speech-to-Text' },
            { label: 'ElevenLabs', desc: 'Text-to-Speech' },
            { label: 'Gemini AI', desc: 'Q&A + Evaluation' },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="card"
              style={{ padding: '0.4rem 0.85rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rose)', fontFamily: 'Syne, sans-serif' }}>{label}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--cream-muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <VoiceInterviewCoach />
    </div>
  );
}
