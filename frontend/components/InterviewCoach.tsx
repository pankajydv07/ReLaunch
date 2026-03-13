'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterviewQuestion, evaluateAnswer } from '@/services/api';
import type { EvaluateAnswerResponse } from '@/types';
import Toast from './Toast';

export default function InterviewCoach() {
  const [role, setRole] = useState('');
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluateAnswerResponse | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);

  async function startSession(e: React.FormEvent) {
    e.preventDefault();
    if (!role.trim()) return;
    setStarted(true);
    await fetchQuestion(role);
  }

  async function fetchQuestion(r: string) {
    setLoadingQ(true);
    setEvaluation(null);
    setAnswer('');
    setError(null);
    try {
      const res = await getInterviewQuestion(r);
      setQuestion(res.question);
      setQuestionCount((c) => c + 1);
    } catch {
      setError('Failed to get a question. Make sure the backend is running.');
    } finally {
      setLoadingQ(false);
    }
  }

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) { setError('Please write your answer first.'); return; }
    setLoadingE(true);
    setError(null);
    try {
      const res = await evaluateAnswer(question, answer);
      setEvaluation(res);
    } catch {
      setError('Evaluation failed. Make sure the backend is running.');
    } finally {
      setLoadingE(false);
    }
  }

  const scoreColor = evaluation
    ? evaluation.score >= 8 ? '#4ade80' : evaluation.score >= 5 ? '#fbbf24' : '#f87171'
    : 'var(--rose)';

  if (!started) {
    return (
      <>
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '2.5rem', maxWidth: '480px', width: '100%' }}
        >
          <p className="section-label" style={{ marginBottom: '0.6rem' }}>Interview Coach</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Practice with AI
          </h2>
          <p style={{ color: 'var(--cream-muted)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            AI will generate realistic interview questions for your target role and give you scored feedback on your answers.
          </p>
          <form onSubmit={startSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Target Role *</label>
              <input
                className="input"
                placeholder="e.g. QA Automation Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>
              Start Interview Session →
            </button>
          </form>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="section-label">Interview Session</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--cream-muted)', marginTop: '0.25rem' }}>
              {role} &nbsp;·&nbsp; Question {questionCount}
            </p>
          </div>
          <button className="btn-ghost" onClick={() => setStarted(false)} style={{ fontSize: '0.75rem' }}>
            Change Role
          </button>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          {loadingQ ? (
            <motion.div
              key="loading-q"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTop: '2px solid var(--rose)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              <p style={{ color: 'var(--cream-muted)', fontSize: '0.9rem' }}>Generating your question…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          ) : (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{ padding: '2rem', borderLeft: '3px solid var(--rose)' }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.75rem' }}>
                Interview Question
              </p>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--cream)' }}>
                {question}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer form */}
        {question && !loadingQ && !evaluation && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={submitAnswer}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <label className="label">Your Answer</label>
              <textarea
                className="input"
                rows={6}
                placeholder="Write your answer here…"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loadingE} style={{ alignSelf: 'flex-start' }}>
              {loadingE ? 'Evaluating…' : 'Submit Answer →'}
            </button>
          </motion.form>
        )}

        {/* Evaluation result */}
        <AnimatePresence>
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Score */}
              <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    border: `3px solid ${scoreColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: '0',
                  }}
                >
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: scoreColor }}>
                    {evaluation.score}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cream-muted)', marginBottom: '0.3rem' }}>
                    Score out of 10
                  </p>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: scoreColor }}>
                    {evaluation.score >= 8 ? 'Excellent Answer!' : evaluation.score >= 5 ? 'Good — Room to Improve' : 'Needs More Practice'}
                  </p>
                </div>
              </div>

              {/* Feedback */}
              <div className="card" style={{ padding: '1.75rem', borderLeft: '3px solid var(--border)' }}>
                <p className="section-label" style={{ marginBottom: '0.6rem' }}>AI Feedback</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
                  {evaluation.feedback}
                </p>
              </div>

              {/* Next question */}
              <button className="btn-primary" onClick={() => fetchQuestion(role)} style={{ alignSelf: 'flex-start' }}>
                Next Question →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
