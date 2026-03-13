'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SkillGapCard from '@/components/SkillGapCard';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import type { AnalyzeProfileResponse, UserProfile } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyzeProfileResponse | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('relaunchData');
    const storedProfile = localStorage.getItem('relaunchProfile');
    if (!stored) {
      router.push('/');
      return;
    }
    setData(JSON.parse(stored));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, [router]);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--cream-muted)' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>Your Results</p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1 }}>
          Career Re-Entry{' '}
          <span style={{ color: 'var(--rose)' }}>Analysis</span>
        </h1>
        {profile && (
          <p style={{ color: 'var(--cream-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
            {profile.previous_role} → <strong style={{ color: 'var(--cream)' }}>{profile.target_role}</strong>
            {' '}&nbsp;·&nbsp; {profile.career_gap_years} year{profile.career_gap_years !== 1 ? 's' : ''} break
          </p>
        )}
      </motion.div>

      {/* Grid: Skill Gap + Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <SkillGapCard
          missingSkills={data.missing_skills}
          existingSkills={profile?.skills ?? []}
        />
        <RoadmapTimeline roadmap={data.roadmap} />
      </div>

      {/* Recommended Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card"
        style={{ padding: '2rem', marginBottom: '1.5rem' }}
      >
        <p className="section-label" style={{ marginBottom: '0.75rem' }}>Opportunities</p>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Roles Matched For You
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {data.recommended_roles.map((role) => (
            <div
              key={role}
              className="card"
              style={{ padding: '0.75rem 1.25rem', border: '1px solid var(--border)', cursor: 'default' }}
            >
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>{role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Returnship Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card"
        style={{ padding: '2rem' }}
      >
        <p className="section-label" style={{ marginBottom: '0.75rem' }}>Returnship Programs</p>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Programs Available to You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {data.returnship_programs.map((program) => (
            <a
              key={program.name}
              href={program.url ?? '#'}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--rose)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.3rem', color: 'var(--cream)' }}>
                  {program.company ?? program.name}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--rose)', fontWeight: 600, marginBottom: '0.5rem' }}>{program.name}</p>
                {program.description && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--cream-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {program.description}
                  </p>
                )}
                {program.duration && (
                  <span className="badge badge-amber" style={{ marginTop: '0.6rem' }}>{program.duration}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* CTA row */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <a href="/resume"><button className="btn-primary">Analyse My Resume →</button></a>
        <a href="/interview"><button className="btn-ghost">Practice Interview</button></a>
      </div>
    </div>
  );
}
