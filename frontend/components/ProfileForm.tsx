'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STEPS = ['Previous Role', 'Experience', 'Your Skills', 'Target Role'];

const DEMO_DATA = {
  previous_role: 'Software Tester',
  years_experience: 3,
  break_duration: 4,
  skills: ['Manual Testing', 'SQL', 'JIRA'],
  target_role: 'QA Automation Engineer',
};

export default function ProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    previous_role: '',
    years_experience: '',
    break_duration: '',
    skills: '',
    target_role: '',
  });

  const fillDemo = () => {
    setForm({
      previous_role: DEMO_DATA.previous_role,
      years_experience: String(DEMO_DATA.years_experience),
      break_duration: String(DEMO_DATA.break_duration),
      skills: DEMO_DATA.skills.join(', '),
      target_role: DEMO_DATA.target_role,
    });
    setStep(3);
    toast.success('Demo data filled! Click "Analyze My Profile" to continue.');
  };

  const canNext = () => {
    if (step === 0) return form.previous_role.trim().length > 0;
    if (step === 1) return form.years_experience !== '' && form.break_duration !== '';
    if (step === 2) return form.skills.trim().length > 0;
    return form.target_role.trim().length > 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        previous_role: form.previous_role,
        years_experience: Number(form.years_experience),
        break_duration: Number(form.break_duration),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        target_role: form.target_role,
      };

      const res = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to analyze profile');
      }

      const data = await res.json();
      localStorage.setItem('relaunch_profile', JSON.stringify(payload));
      localStorage.setItem('relaunch_result', JSON.stringify(data));
      toast.success('Analysis complete! Redirecting to your dashboard...');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`step-dot ${i === step ? 'active' : i < step ? 'done' : 'idle'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-xs text-slate-500 mt-1 hidden sm:block">{label}</span>
            {i < STEPS.length - 1 && (
              <div
                className="absolute"
                style={{
                  width: `calc(${100 / STEPS.length}% - 40px)`,
                  height: '2px',
                  background: i < step ? '#0D9488' : '#E2E8F0',
                  top: '16px',
                  left: `calc(${(100 / STEPS.length) * i}% + 20px)`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="space-y-6 animate-fade-in-up">
        {step === 0 && (
          <div className="space-y-3">
            <Label className="text-slate-700 font-semibold text-base" htmlFor="previous_role">
              What was your previous role?
            </Label>
            <Input
              id="previous_role"
              placeholder="e.g. Software Tester, Data Analyst…"
              value={form.previous_role}
              onChange={(e) => setForm((f) => ({ ...f, previous_role: e.target.value }))}
              className="h-12 text-base"
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold text-base" htmlFor="years_experience">
                Years of work experience
              </Label>
              <Input
                id="years_experience"
                type="number"
                min={0}
                max={40}
                placeholder="e.g. 3"
                value={form.years_experience}
                onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold text-base" htmlFor="break_duration">
                Career break duration (years)
              </Label>
              <Input
                id="break_duration"
                type="number"
                min={0}
                max={20}
                placeholder="e.g. 4"
                value={form.break_duration}
                onChange={(e) => setForm((f) => ({ ...f, break_duration: e.target.value }))}
                className="h-12 text-base"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Label className="text-slate-700 font-semibold text-base" htmlFor="skills">
              Skills you already have
              <span className="text-slate-400 font-normal text-sm ml-2">(comma-separated)</span>
            </Label>
            <Input
              id="skills"
              placeholder="e.g. Manual Testing, SQL, JIRA, Python…"
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              className="h-12 text-base"
            />
            <p className="text-xs text-slate-400">Separate each skill with a comma</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <Label className="text-slate-700 font-semibold text-base" htmlFor="target_role">
              What role do you want to return as?
            </Label>
            <Input
              id="target_role"
              placeholder="e.g. QA Automation Engineer, Data Scientist…"
              value={form.target_role}
              onChange={(e) => setForm((f) => ({ ...f, target_role: e.target.value }))}
              className="h-12 text-base"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
        ) : (
          <button
            onClick={fillDemo}
            className="text-sm text-teal-brand hover:text-teal-700 transition-colors font-medium"
          >
            Fill demo data ✨
          </button>
        )}

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="bg-rose-brand hover:bg-rose-700 text-white px-8 h-11 font-semibold disabled:opacity-40"
            id="next-step-btn"
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canNext() || loading}
            className="bg-rose-brand hover:bg-rose-700 text-white px-8 h-11 font-semibold disabled:opacity-40"
            id="analyze-profile-btn"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing…
              </span>
            ) : (
              'Analyze My Profile →'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
