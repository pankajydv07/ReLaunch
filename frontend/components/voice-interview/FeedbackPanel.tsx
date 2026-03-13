'use client';

import { Button } from '@/components/ui/button';

export interface EvalResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  ideal_answer: string;
}

interface FeedbackPanelProps {
  result: EvalResult;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export default function FeedbackPanel({ result, onNextQuestion, isLastQuestion }: FeedbackPanelProps) {
  const scoreColor = (score: number) =>
    score >= 80 ? 'text-teal-brand' : score >= 60 ? 'text-amber-500' : 'text-rose-brand';

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Score Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Evaluation Score</div>
        <div
          className={`text-6xl font-bold mb-1 ${scoreColor(result.score)}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {result.score}
          <span className="text-3xl text-slate-300">/100</span>
        </div>
        <p className="text-slate-600 text-base leading-relaxed mt-4 max-w-2xl mx-auto font-medium">
          {result.feedback}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div className="rounded-xl bg-teal-50/50 border border-teal-100 p-5">
            <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-lg">✅</span> Strengths
            </h4>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-teal-brand mt-0.5">•</span> 
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {result.improvements?.length > 0 && (
          <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-5">
            <h4 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> Areas to Improve
            </h4>
            <ul className="space-y-2">
              {result.improvements.map((s, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-rose-brand mt-0.5">•</span> 
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ideal Answer */}
      {result.ideal_answer && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-lg">⭐</span> Ideal Answer Example
          </h4>
          <p className="text-sm text-slate-600 italic leading-relaxed">
            "{result.ideal_answer}"
          </p>
        </div>
      )}

      {/* Action */}
      <div className="pt-4">
        <Button
          onClick={onNextQuestion}
          className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-transform hover:scale-[1.02]"
        >
          {isLastQuestion ? 'Finish Interview 🎉' : 'Next Question →'}
        </Button>
      </div>
    </div>
  );
}
