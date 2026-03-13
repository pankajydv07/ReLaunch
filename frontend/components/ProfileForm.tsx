'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile } from '@/services/api';
import type { UserProfile } from '@/types';
import Toast from './Toast';

const DEMO_DATA: UserProfile = {
  previous_role: 'Software Tester',
  experience_years: 3,
  career_gap_years: 4,
  skills: ['Manual Testing', 'SQL', 'Agile', 'JIRA'],
  target_role: 'QA Automation Engineer',
};

export default function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<UserProfile, 'skills'> & { skills: string }>({
    previous_role: '',
    experience_years: 0,
    career_gap_years: 0,
    skills: '',
    target_role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fillDemo() {
    setForm({
      ...DEMO_DATA,
      skills: DEMO_DATA.skills.join(', '),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.previous_role || !form.target_role || !form.skills) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: UserProfile = {
        ...form,
        experience_years: Number(form.experience_years),
        career_gap_years: Number(form.career_gap_years),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const result = await analyzeProfile(payload);
      localStorage.setItem('relaunchData', JSON.stringify(result));
      localStorage.setItem('relaunchProfile', JSON.stringify(payload));
      router.push('/dashboard');
    } catch {
      setError('Analysis failed. Make sure the backend is running at http://localhost:8000');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          padding: '2.5rem',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '0.4rem' }}>Step 1 of 1</p>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>
              Your Career Profile
            </h2>
          </div>
          <button className="btn-ghost" onClick={fillDemo} type="button" style={{ fontSize: '0.75rem' }}>
            Fill Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Previous Role *</label>
            <input
              className="input"
              placeholder="e.g. Software Tester"
              value={form.previous_role}
              onChange={(e) => setForm({ ...form, previous_role: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Years of Experience</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="3"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="label">Career Gap (years)</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="4"
                value={form.career_gap_years}
                onChange={(e) => setForm({ ...form, career_gap_years: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="label">Skills You Have *</label>
            <input
              className="input"
              placeholder="Manual Testing, SQL, Agile (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Target Role *</label>
            <input
              className="input"
              placeholder="e.g. QA Automation Engineer"
              value={form.target_role}
              onChange={(e) => setForm({ ...form, target_role: e.target.value })}
              required
            />
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (
                <>
                  <Spinner />
                  Analysing Profile...
                </>
              ) : (
                'Analyse My Profile →'
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,17,23,0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9000,
              gap: '1rem',
            }}
          >
            <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--rose)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'Syne, sans-serif', color: 'var(--cream-muted)', fontSize: '0.9rem' }}>
              AI is analysing your career profile…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: '2px solid rgba(15,17,23,0.3)',
        borderTop: '2px solid var(--bg-primary)',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
}
