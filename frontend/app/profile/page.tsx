import ProfileForm from '@/components/ProfileForm';

export const metadata = {
  title: 'Analyze My Profile — ReLaunchAI',
  description: 'Tell us about your career background and we\'ll create a personalized re-entry plan.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-50 to-rose-50/30 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-brand px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎯 Step 1 of 3
          </div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Let&#39;s build your comeback plan
          </h1>
          <p className="text-slate-500 text-lg">
            Answer 4 quick questions and get your personalised skill gap analysis and roadmap.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-in-up animate-delay-100">
          <ProfileForm />
        </div>

        {/* Trust note */}
        <p className="text-center text-slate-400 text-sm mt-6 animate-fade-in-up animate-delay-200">
          🔒 Your data never leaves your browser session
        </p>
      </div>
    </div>
  );
}
