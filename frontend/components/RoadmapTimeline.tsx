'use client';

interface RoadmapTimelineProps {
  roadmap: string[];
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2
        className="text-xl font-bold text-slate-900 mb-6"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Your Learning Roadmap
      </h2>

      <div className="relative pl-10 space-y-6">
        {/* Vertical line */}
        <div className="timeline-line" />

        {roadmap.map((item, i) => {
          const [label, ...rest] = item.split(':');
          const desc = rest.join(':').trim();
          return (
            <div
              key={i}
              className="flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Dot */}
              <div className="timeline-dot" style={{ marginLeft: '-40px' }}>
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div
                  className="font-bold text-slate-900 text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {label}
                </div>
                {desc && (
                  <div className="text-slate-500 text-sm mt-0.5">{desc}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
