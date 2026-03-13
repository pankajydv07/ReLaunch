'use client';

import { motion } from 'framer-motion';

interface RoadmapTimelineProps {
  roadmap: string[];
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card"
      style={{ padding: '2rem' }}
    >
      <p className="section-label" style={{ marginBottom: '0.75rem' }}>Learning Path</p>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.75rem' }}>
        Your Personalised Roadmap
      </h2>

      <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '0.9rem',
          top: '1.2rem',
          bottom: '0',
          width: '1px',
          background: 'var(--border)',
        }} />

        {roadmap.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i + 0.2 }}
            style={{
              position: 'relative',
              marginBottom: '1.25rem',
              paddingBottom: '0',
            }}
          >
            {/* Circle marker */}
            <div
              style={{
                position: 'absolute',
                left: '-2.5rem',
                top: '0.1rem',
                width: '1.8rem',
                height: '1.8rem',
                background: i === 0 ? 'var(--rose)' : 'var(--bg-secondary)',
                border: `1px solid ${i === 0 ? 'var(--rose)' : 'var(--border)'}`,
                borderRadius: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne, sans-serif',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: i === 0 ? 'var(--bg-primary)' : 'var(--cream-muted)',
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: i === 0 ? 'var(--cream)' : 'var(--text-body)',
              fontWeight: i === 0 ? 500 : 400,
              lineHeight: 1.5,
            }}>
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
