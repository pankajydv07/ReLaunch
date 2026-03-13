'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface ResumeResult {
  ats_score: number;
  missing_keywords: string[];
  suggestions: string[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<'file' | 'paste'>('paste');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setMode('file');
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target role.');
      return;
    }
    if (mode === 'file' && !file) {
      toast.error('Please upload a file.');
      return;
    }
    if (mode === 'paste' && !pastedText.trim()) {
      toast.error('Please paste your resume text.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('target_role', targetRole);
      if (mode === 'file' && file) {
        fd.append('file', file);
      } else {
        fd.append('resume_text', pastedText);
      }

      const res = await fetch('/api/analyze-resume', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Resume analysis failed');
      }
      const data = await res.json();
      setResult(data);
      toast.success('Resume analyzed!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 70 ? 'text-teal-brand' : score >= 50 ? 'text-amber-500' : 'text-rose-brand';

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
      <h2
        className="text-xl font-bold text-slate-900"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Resume ATS Analyzer
      </h2>

      {/* Mode toggle */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            mode === 'paste'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📝 Paste Text
        </button>
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            mode === 'file'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📄 Upload File
        </button>
      </div>

      {/* Paste mode */}
      {mode === 'paste' && (
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700" htmlFor="resume-paste">
            Paste your resume text
          </Label>
          <Textarea
            id="resume-paste"
            placeholder="Copy and paste your entire resume content here..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={6}
            className="resize-none text-sm"
          />
        </div>
      )}

      {/* File mode */}
      {mode === 'file' && (
        <div
          id="resume-drop-zone"
          className={`drop-zone p-8 text-center cursor-pointer ${dragging ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); }}
          />
          {file ? (
            <div className="space-y-2">
              <div className="text-3xl">📄</div>
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">⬆️</div>
              <p className="font-semibold text-slate-700">Drop your resume file here</p>
              <p className="text-xs text-slate-400">Supports .txt files (or click to browse)</p>
            </div>
          )}
        </div>
      )}

      {/* Target role */}
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700" htmlFor="resume-role">
          Target Role
        </Label>
        <Input
          id="resume-role"
          placeholder="e.g. QA Automation Engineer"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="h-11"
        />
      </div>

      <Button
        id="analyze-resume-btn"
        onClick={handleAnalyze}
        disabled={loading || !targetRole.trim() || (mode === 'file' ? !file : !pastedText.trim())}
        className="w-full bg-rose-brand hover:bg-rose-700 text-white h-11 font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing Resume…
          </span>
        ) : (
          'Analyze Resume →'
        )}
      </Button>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in-up pt-2 border-t border-slate-100">
          {/* ATS Score */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-slate-700">ATS Score</span>
              <span
                className={`text-3xl font-bold ${scoreColor(result.ats_score)}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {result.ats_score}<span className="text-base text-slate-400">/100</span>
              </span>
            </div>
            <Progress value={result.ats_score} className="h-2" />
            <p className="text-xs text-slate-400">
              {result.ats_score >= 70
                ? '✅ Good ATS compatibility'
                : result.ats_score >= 50
                ? '⚠️ Moderate — some improvements needed'
                : '❌ Low ATS score — significant gaps to address'}
            </p>
          </div>

          {/* Missing keywords */}
          {result.missing_keywords?.length > 0 && (
            <div>
              <p className="font-semibold text-slate-700 text-sm mb-2">Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((kw) => (
                  <span key={kw} className="badge-rose">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div>
              <p className="font-semibold text-slate-700 text-sm mb-2">Suggestions</p>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-teal-brand mt-0.5">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
