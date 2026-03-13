import type { Metadata } from 'next';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';

export const metadata: Metadata = {
  title: 'ReLaunchAI — Restart Your Career with Confidence',
  description: 'AI-powered skill gap analysis, learning roadmaps, resume optimisation, and interview coaching built for women returning to the workforce.',
};

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background accent — vertical stripe */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            right: '8%',
            width: '1px',
            height: '100%',
            background: 'var(--border)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            right: '18%',
            width: '1px',
            height: '60%',
            background: 'var(--border)',
            opacity: 0.4,
          }}
        />

        {/* Left column — headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2rem, 6vw, 5rem)',
            paddingTop: '6rem',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            {/* Text block */}
            <div>
              <p
                className="section-label"
                style={{ marginBottom: '1.25rem', letterSpacing: '0.25em' }}
              >
                AI Career Re-Entry Platform
              </p>

              <h1
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.5rem',
                }}
              >
                Your
                <br />
                Career{' '}
                <span
                  style={{
                    color: 'var(--rose)',
                    display: 'inline-block',
                    position: 'relative',
                  }}
                >
                  Break
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'var(--rose)',
                      opacity: 0.4,
                    }}
                  />
                </span>
                <br />
                Ends Here.
              </h1>

              <p
                style={{
                  color: 'var(--cream-muted)',
                  fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                  lineHeight: 1.75,
                  maxWidth: '420px',
                  marginBottom: '2.5rem',
                }}
              >
                Fill in your profile in under 2 minutes. Get an instant AI skill gap analysis,
                personalised learning roadmap, ATS resume score, and interview coaching — built specifically
                for women returning after a career break.
              </p>

              {/* Feature pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
                {[
                  '⚡ Skill Gap Analysis',
                  '🗺 Learning Roadmap',
                  '📄 ATS Resume Score',
                  '🎤 Interview Coach',
                ].map((f) => (
                  <span
                    key={f}
                    className="badge badge-rose"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#profile-form">
                  <button className="btn-primary">Start My Journey →</button>
                </a>
                <Link href="/dashboard">
                  <button className="btn-ghost">View Demo Dashboard</button>
                </Link>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  marginTop: '3.5rem',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '2rem',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { value: '4', label: 'AI Agents' },
                  { value: '<2min', label: 'To Results' },
                  { value: '100%', label: 'Free Tool' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p
                      style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        color: 'var(--rose)',
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--cream-muted)', marginTop: '0.2rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form block */}
            <div id="profile-form" style={{ scrollMarginTop: '80px' }}>
              <ProfileForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 4rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>How It Works</p>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            From break to launch in{' '}
            <span style={{ color: 'var(--rose)' }}>4 steps</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { icon: '👤', step: '01', title: 'Fill Profile', desc: 'Tell us your background, break duration, current skills, and target role.' },
              { icon: '🧠', step: '02', title: 'AI Analysis', desc: 'Our AI identifies your skill gaps and builds a month-by-month learning roadmap.' },
              { icon: '📄', step: '03', title: 'Resume Score', desc: 'Upload your PDF and get an ATS score with targeted keyword & format fixes.' },
              { icon: '🎤', step: '04', title: 'Interview Prep', desc: 'Practice realistic questions and get scored AI feedback to build confidence.' },
            ].map(({ icon, step, title, desc }) => (
              <div
                key={step}
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '2rem 1.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                  <span
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: 'var(--border)',
                    }}
                  >
                    {step}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--cream-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--rose)', fontSize: '0.9rem' }}>ReLaunchAI</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>Built for Code4Her Hackathon 2026</span>
      </footer>
    </>
  );
}
