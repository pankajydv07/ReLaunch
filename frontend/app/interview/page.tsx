import InterviewCoach from '@/components/InterviewCoach';

export const metadata = {
  title: 'Interview Coach — ReLaunchAI',
  description: 'Practice role-specific interview questions with AI feedback and scoring.',
};

export default function InterviewPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-50 to-teal-50/30 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-brand px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎤 Interview Coach
          </div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Practice Makes Confident
          </h1>
          <p className="text-slate-500 text-lg">
            Enter your target role, get a real interview question, and receive instant AI feedback.
          </p>
        </div>

        {/* Coach card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-in-up animate-delay-100">
          <InterviewCoach />
        </div>

        {/* Tips */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4 animate-fade-in-up animate-delay-200">
          {[
            { icon: '⭐', tip: 'Use the STAR method (Situation, Task, Action, Result)' },
            { icon: '⏱️', tip: 'Aim for 90–120 second answers in real interviews' },
            { icon: '🔄', tip: 'Practice 5+ questions per session for best results' },
          ].map((item) => (
            <div key={item.tip} className="bg-white rounded-xl border border-slate-100 p-4 text-center card-hover">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-slate-500 text-xs leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
