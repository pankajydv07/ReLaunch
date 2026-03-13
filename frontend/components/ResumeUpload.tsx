'use client';

import { useState, useRef, DragEvent } from 'react';
import { motion } from 'framer-motion';
import { analyzeResume } from '@/services/api';
import type { ResumeAnalysisResponse } from '@/types';
import Toast from './Toast';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.toLowerCase().endsWith('.pdf')) setFile(dropped);
    else setError('Please upload a PDF file.');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Please upload a PDF resume.'); return; }
    if (!targetRole.trim()) { setError('Please enter a target role.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume(file, targetRole);
      setResult(data);
    } catch {
      setError('Resume analysis failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = result
    ? result.ats_score >= 70 ? '#4ade80' : result.ats_score >= 45 ? '#fbbf24' : '#f87171'
    : 'var(--rose)';

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      {!result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '2.5rem', maxWidth: '560px', width: '100%' }}
        >
          <p className="section-label" style={{ marginBottom: '0.6rem' }}>Resume Analyser</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem' }}>
            Upload Your Resume
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--rose)' : file ? '#4ade80' : 'var(--border)'}`,
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                background: dragging ? 'var(--rose-muted)' : 'var(--bg-secondary)',
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                {file ? '✅' : '📄'}
              </div>
              {file ? (
                <p style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</p>
              ) : (
                <>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 500 }}>
                    Drag & drop your PDF here
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--cream-muted)', marginTop: '0.3rem' }}>
                    or click to browse
                  </p>
                </>
              )}
            </div>

            <div>
              <label className="label">Target Role *</label>
              <input
                className="input"
                placeholder="e.g. QA Automation Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? 'Analysing Resume…' : 'Get ATS Score →'}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* ATS Score */}
          <div className="card" style={{ padding: '2rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>ATS Score</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '3.5rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {result.ats_score}
              </span>
              <span style={{ color: 'var(--cream-muted)', fontSize: '1.2rem', paddingBottom: '0.4rem' }}>/100</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '0', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.ats_score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: scoreColor }}
              />
            </div>
            <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--cream-muted)' }}>
              {result.ats_score >= 70 ? 'Strong match — you\'re competitive for this role.' :
               result.ats_score >= 45 ? 'Moderate match — some gaps to address.' :
               'Low match — significant gaps to close.'}
            </p>
          </div>

          {/* Missing Keywords */}
          <div className="card" style={{ padding: '2rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Missing Keywords</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {result.missing_keywords.length > 0
                ? result.missing_keywords.map((kw) => <span key={kw} className="badge badge-red">{kw}</span>)
                : <p style={{ color: 'var(--cream-muted)', fontSize: '0.85rem' }}>No critical keywords missing!</p>}
            </div>
          </div>

          {/* Suggestions */}
          <div className="card" style={{ padding: '2rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Improvement Suggestions</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.suggestions.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--rose)', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>→</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6 }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-ghost" onClick={() => { setResult(null); setFile(null); }}>
            ← Analyse Another Resume
          </button>
        </motion.div>
      )}
    </>
  );
}
