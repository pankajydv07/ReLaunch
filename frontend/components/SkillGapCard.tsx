'use client';

import { motion } from 'framer-motion';

interface SkillGapCardProps {
  missingSkills: string[];
  existingSkills: string[];
}

export default function SkillGapCard({ missingSkills, existingSkills }: SkillGapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card"
      style={{ padding: '2rem' }}
    >
      <p className="section-label" style={{ marginBottom: '0.75rem' }}>Skill Analysis</p>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Your Skill Gap
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Existing Skills */}
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '0.75rem' }}>
            ✓ Skills You Have
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {existingSkills.length > 0
              ? existingSkills.map((skill) => (
                  <span key={skill} className="badge badge-green">{skill}</span>
                ))
              : <span style={{ color: 'var(--cream-muted)', fontSize: '0.85rem' }}>None listed</span>}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f87171', marginBottom: '0.75rem' }}>
            ✗ Skills to Acquire
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {missingSkills.length > 0
              ? missingSkills.map((skill) => (
                  <span key={skill} className="badge badge-red">{skill}</span>
                ))
              : <span style={{ color: 'var(--cream-muted)', fontSize: '0.85rem' }}>None — great match!</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
