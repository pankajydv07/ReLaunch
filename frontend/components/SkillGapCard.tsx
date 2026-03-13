'use client';

interface SkillGapCardProps {
  missingSkills: string[];
  knownSkills: string[];
}

export default function SkillGapCard({ missingSkills, knownSkills }: SkillGapCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2
        className="text-xl font-bold text-slate-900 mb-6"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Your Skill Gap Analysis
      </h2>

      {/* Skills to gain */}
      {missingSkills.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-rose-brand flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Skills to Gain</span>
            <span className="ml-auto text-xs text-slate-400">{missingSkills.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span key={skill} className="badge-rose animate-pop-in">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills you have */}
      {knownSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-teal-brand flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Skills You Already Have</span>
            <span className="ml-auto text-xs text-slate-400">{knownSkills.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {knownSkills.map((skill) => (
              <span key={skill} className="badge-teal animate-pop-in">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
