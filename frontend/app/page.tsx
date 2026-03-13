'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col">
      {/* ─── Hero ─── */}
      <section className="relative flex-1 flex items-center overflow-hidden bg-slate-950">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #E11D48 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #0D9488 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up border border-white/10">
              <span className="w-2 h-2 rounded-full bg-teal-brand animate-pulse" />
              AI-Powered Career Re-Entry
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-in-up animate-delay-100"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your comeback
              <br />
              starts <span className="text-rose-brand hero-underline">here.</span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-10 animate-fade-in-up animate-delay-200 max-w-lg">
              Returning to tech after a career break? ReLaunchAI gives you a personalised
              skill gap analysis, learning roadmap, and interview coaching — built specifically for women re-entering the workforce.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-300">
              <Link
                href="/profile"
                id="start-journey-cta"
                className="inline-flex items-center justify-center gap-2 bg-rose-brand text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-rose-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-rose-900/30"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Analyze My Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/interview"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Practice Interview
              </Link>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in-up animate-delay-400">
            {[
              { value: '94%', label: 'Women report skill confidence boost', color: 'rose' },
              { value: '3×', label: 'Faster job search with roadmap', color: 'teal' },
              { value: '500+', label: 'Returnship programs mapped', color: 'teal' },
              { value: 'Free', label: '100% free for hackathon demo', color: 'rose' },
            ].map((s, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border bg-white/5 border-white/10 backdrop-blur-sm ${
                  i % 2 === 1 ? 'mt-6' : ''
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-1 ${s.color === 'rose' ? 'text-rose-400' : 'text-teal-400'}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Three steps to your next role
            </h2>
            <p className="text-slate-500 text-lg">No gatekeeping, no guesswork — just a clear path forward.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Analyze Your Profile',
                desc: 'Tell us your previous role, skills, and career break duration. Our AI identifies your exact skill gaps and builds a custom roadmap.',
                color: 'rose',
              },
              {
                step: '02',
                icon: '📄',
                title: 'Optimize Your Resume',
                desc: 'Upload your PDF resume and get an instant ATS score, missing keywords, and specific improvement suggestions.',
                color: 'teal',
              },
              {
                step: '03',
                icon: '🎤',
                title: 'Practice Interviews',
                desc: 'Get role-specific interview questions, submit your answers, and receive detailed feedback with a score out of 10.',
                color: 'rose',
              },
            ].map((item) => (
              <div key={item.step} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 card-hover">
                <div
                  className={`text-xs font-bold tracking-widest uppercase mb-4 ${
                    item.color === 'rose' ? 'text-rose-brand' : 'text-teal-brand'
                  }`}
                >
                  Step {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3
                  className="text-xl font-bold text-slate-900 mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-rose-brand py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to relaunch?
          </h2>
          <p className="text-rose-100 text-lg mb-8">
            Your career break is not a gap. It&#39;s a story — and it&#39;s time to tell it.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 bg-white text-rose-brand px-8 py-4 rounded-xl text-base font-bold hover:bg-rose-50 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Start For Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
