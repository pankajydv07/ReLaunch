'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SkillGapCard from '@/components/SkillGapCard';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import ResumeUpload from '@/components/ResumeUpload';

interface Profile {
  previous_role: string;
  target_role: string;
  years_experience: number;
  break_duration: number;
}

interface AnalysisResult {
  missing_skills: string[];
  known_skills: string[];
  roadmap: string[];
  recommended_roles: string[];
  returnship_programs: { name: string; company: string; url: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const p = localStorage.getItem('relaunch_profile');
    const r = localStorage.getItem('relaunch_result');
    if (!p || !r) {
      router.push('/profile');
      return;
    }
    setProfile(JSON.parse(p));
    setResult(JSON.parse(r));
  }, [router]);

  if (!profile || !result) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
        <div className="animate-spin w-8 h-8 border-4 border-rose-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ✅ Analysis Complete
          </div>
          <h1
            className="text-4xl font-bold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Re-Entry Roadmap
          </h1>
          <p className="text-slate-500 mt-2">
            <span className="font-medium text-slate-700">{profile.previous_role}</span>
            {' → '}
            <span className="font-medium text-rose-brand">{profile.target_role}</span>
            {' '}&middot; {profile.break_duration} year break
          </p>
        </div>

        {/* Top grid: Skill Gap + Roadmap */}
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in-up animate-delay-100">
          <SkillGapCard
            missingSkills={result.missing_skills ?? []}
            knownSkills={result.known_skills ?? []}
          />
          <RoadmapTimeline roadmap={result.roadmap ?? []} />
        </div>

        {/* Opportunities */}
        {(result.recommended_roles?.length > 0 || result.returnship_programs?.length > 0) && (
          <div className="animate-fade-in-up animate-delay-200 space-y-6">
            <h2
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Opportunities Matched For You
            </h2>

            {/* Recommended Roles */}
            {result.recommended_roles?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommended Roles</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {result.recommended_roles.map((role, i) => (
                    <div
                      key={`role-${i}`}
                      className="bg-white rounded-xl border border-slate-100 p-4 card-hover"
                    >
                      <div className="text-2xl mb-2">💼</div>
                      <p
                        className="font-bold text-slate-800 text-sm"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Returnship Programs */}
            {result.returnship_programs?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Returnship Programs</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.returnship_programs.map((prog, i) => (
                    <a
                      key={`prog-${i}`}
                      href={prog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl border border-slate-100 p-4 card-hover flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                        🏢
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-bold text-slate-800 text-sm truncate group-hover:text-rose-brand transition-colors"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {prog.name}
                        </p>
                        <p className="text-slate-400 text-xs">{prog.company}</p>
                      </div>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-rose-brand ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resume section */}
        <div className="animate-fade-in-up animate-delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Resume Check
            </h2>
            <span className="badge-teal">Optional</span>
          </div>
          <ResumeUpload />
        </div>

        {/* Interview CTA */}
        <div className="animate-fade-in-up animate-delay-400 bg-slate-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to practice interviews?
            </h3>
            <p className="text-slate-400">Get role-specific questions and AI-powered feedback.</p>
          </div>
          <Link
            href="/interview"
            className="flex-shrink-0 bg-rose-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Start Interview Practice →
          </Link>
        </div>

      </div>
    </div>
  );
}
