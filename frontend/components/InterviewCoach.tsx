'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EvalResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function InterviewCoach() {
  const [role, setRole] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<EvalResult | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingA, setLoadingA] = useState(false);

  const getQuestion = async () => {
    if (!role.trim()) { toast.error('Please enter a role first.'); return; }
    setLoadingQ(true);
    setQuestion('');
    setAnswer('');
    setResult(null);
    try {
      const res = await fetch('/api/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to get question');
      const data = await res.json();
      setQuestion(data.question);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoadingQ(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please write your answer first.'); return; }
    setLoadingA(true);
    setResult(null);
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      if (!res.ok) throw new Error('Failed to evaluate answer');
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoadingA(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 7 ? 'text-teal-brand' : score >= 5 ? 'text-amber-500' : 'text-rose-brand';

  const nextQuestion = () => {
    setAnswer('');
    setResult(null);
    getQuestion();
  };

  return (
    <div className="space-y-6">
      {/* Role input */}
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700 text-base" htmlFor="interview-role">
          Target Role
        </Label>
        <div className="flex gap-3">
          <Input
            id="interview-role"
            placeholder="e.g. QA Automation Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-11 flex-1"
          />
          <Button
            id="get-question-btn"
            onClick={getQuestion}
            disabled={loadingQ || !role.trim()}
            className="bg-rose-brand hover:bg-rose-700 text-white h-11 px-6 font-semibold whitespace-nowrap"
          >
            {loadingQ ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              'Get Question'
            )}
          </Button>
        </div>
      </div>

      {/* Question card */}
      {question && (
        <div className="rounded-2xl border-l-4 border-rose-brand bg-rose-50 p-5 animate-fade-in-up">
          <p className="text-xs font-bold text-rose-brand uppercase tracking-wider mb-2">Interview Question</p>
          <p className="text-slate-800 font-medium leading-relaxed text-base">{question}</p>
        </div>
      )}

      {/* Answer */}
      {question && !result && (
        <div className="space-y-3 animate-fade-in-up">
          <Label className="font-semibold text-slate-700" htmlFor="answer-input">
            Your Answer
          </Label>
          <Textarea
            id="answer-input"
            placeholder="Type your answer here… Be specific, use STAR method if applicable."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className="resize-none text-base"
          />
          <Button
            id="submit-answer-btn"
            onClick={submitAnswer}
            disabled={loadingA || !answer.trim()}
            className="w-full bg-teal-brand hover:bg-teal-700 text-white h-11 font-semibold"
          >
            {loadingA ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Evaluating…
              </span>
            ) : (
              'Submit Answer →'
            )}
          </Button>
        </div>
      )}

      {/* Feedback */}
      {result && (
        <div className="space-y-5 animate-pop-in">
          {/* Score */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Score</div>
            <div
              className={`text-6xl font-bold mb-1 ${scoreColor(result.score)}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {result.score}
              <span className="text-2xl text-slate-300">/10</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mt-3 max-w-md mx-auto">
              {result.feedback}
            </p>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.strengths?.length > 0 && (
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-4">
                <p className="text-xs font-bold text-teal-brand uppercase tracking-wider mb-3">✅ Strengths</p>
                <ul className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-teal-brand">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements?.length > 0 && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-4">
                <p className="text-xs font-bold text-rose-brand uppercase tracking-wider mb-3">💡 Improvements</p>
                <ul className="space-y-1.5">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-rose-brand">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button
            id="next-question-btn"
            onClick={nextQuestion}
            className="w-full border border-rose-brand text-rose-brand bg-white hover:bg-rose-50 h-11 font-semibold"
          >
            Next Question →
          </Button>
        </div>
      )}
    </div>
  );
}
