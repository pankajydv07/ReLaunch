'use client';

import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: number;
  name: string;
  role: string;
  industry: string;
  breakDuration: string;
  targetRole: string;
  skills: string[];
  status: 'Actively Looking' | 'Open to Opportunities' | 'Just Started';
  avatar: string; // initials-based
  joinedDate: string;
  location: string;
  bio: string;
}

// ─── Mock Community Members ───────────────────────────────────────────────────

const MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Former Software Engineer',
    industry: 'Technology',
    breakDuration: '2 years',
    targetRole: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Node.js'],
    status: 'Actively Looking',
    avatar: 'PS',
    joinedDate: 'Jan 2025',
    location: 'Bangalore, India',
    bio: 'Took a break for my little one. Now rebuilding my skills in modern React and TypeScript. Excited to re-enter tech!',
  },
  {
    id: 2,
    name: 'Ananya Mehta',
    role: 'Former Marketing Manager',
    industry: 'Marketing',
    breakDuration: '3 years',
    targetRole: 'Digital Marketing Lead',
    skills: ['SEO', 'Content Strategy', 'Analytics'],
    status: 'Open to Opportunities',
    avatar: 'AM',
    joinedDate: 'Feb 2025',
    location: 'Mumbai, India',
    bio: 'Marketing professional with 6 years of experience pre-break. Learning new digital tools and platforms.',
  },
  {
    id: 3,
    name: 'Kavitha Reddy',
    role: 'Former Data Analyst',
    industry: 'Finance',
    breakDuration: '4 years',
    targetRole: 'Data Scientist',
    skills: ['Python', 'SQL', 'Tableau'],
    status: 'Just Started',
    avatar: 'KR',
    joinedDate: 'Mar 2025',
    location: 'Hyderabad, India',
    bio: 'Transitioning from data analyst to data scientist. Currently learning ML fundamentals and Python libraries.',
  },
  {
    id: 4,
    name: 'Sunita Joshi',
    role: 'Former HR Specialist',
    industry: 'Human Resources',
    breakDuration: '1.5 years',
    targetRole: 'HR Business Partner',
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    status: 'Actively Looking',
    avatar: 'SJ',
    joinedDate: 'Jan 2025',
    location: 'Pune, India',
    bio: 'Ready to bring my HR expertise back after a family caregiving break. Exploring hybrid work opportunities.',
  },
  {
    id: 5,
    name: 'Deepa Nair',
    role: 'Former UX Designer',
    industry: 'Design',
    breakDuration: '2.5 years',
    targetRole: 'Senior UX/Product Designer',
    skills: ['Figma', 'User Research', 'Prototyping'],
    status: 'Open to Opportunities',
    avatar: 'DN',
    joinedDate: 'Feb 2025',
    location: 'Chennai, India',
    bio: 'Passionate about accessible design. Rebuilding my portfolio with fresh case studies and Figma projects.',
  },
  {
    id: 6,
    name: 'Meera Iyer',
    role: 'Former Project Manager',
    industry: 'Technology',
    breakDuration: '3 years',
    targetRole: 'Product Manager',
    skills: ['Agile', 'JIRA', 'Roadmapping'],
    status: 'Just Started',
    avatar: 'MI',
    joinedDate: 'Mar 2025',
    location: 'Delhi, India',
    bio: 'PMP certified before break. Now exploring transition from project management to product management.',
  },
  {
    id: 7,
    name: 'Rohini Das',
    role: 'Former Financial Analyst',
    industry: 'Finance',
    breakDuration: '5 years',
    targetRole: 'Finance Manager',
    skills: ['Financial Modeling', 'Excel', 'Forecasting'],
    status: 'Actively Looking',
    avatar: 'RD',
    joinedDate: 'Jan 2025',
    location: 'Kolkata, India',
    bio: 'Five-year break to care for elderly parents. Upskilling in modern fintech tools and financial software.',
  },
  {
    id: 8,
    name: 'Pooja Kulkarni',
    role: 'Former Teacher',
    industry: 'Education',
    breakDuration: '2 years',
    targetRole: 'EdTech Curriculum Designer',
    skills: ['Curriculum Design', 'E-Learning', 'LMS'],
    status: 'Open to Opportunities',
    avatar: 'PK',
    joinedDate: 'Feb 2025',
    location: 'Nashik, India',
    bio: 'Transitioning from classroom teaching to EdTech. Love creating engaging digital learning experiences.',
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  'Actively Looking': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' },
  'Open to Opportunities': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' },
  'Just Started': { color: '#e8927c', bg: 'rgba(232,146,124,0.1)', border: 'rgba(232,146,124,0.25)' },
};

const INDUSTRIES = ['All', 'Technology', 'Marketing', 'Finance', 'Design', 'Human Resources', 'Education'];

// ─── Avatar Component ─────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#e8927c', '#7c9fe8', '#7ce8b8', '#e8d47c', '#c47ce8', '#e87ca3',
];

function Avatar({ initials, size = 48, idx = 0 }: { initials: string; size?: number; idx?: number }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${color}20`,
        border: `2px solid ${color}50`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700,
        fontSize: size * 0.33,
        color,
        flexShrink: 0,
        letterSpacing: '0.05em',
      }}
    >
      {initials}
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({ member, idx, isConnected, onConnect }: {
  member: Member;
  idx: number;
  isConnected: boolean;
  onConnect: (id: number) => void;
}) {
  const sc = STATUS_CONFIG[member.status];

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 2,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--rose)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Avatar initials={member.avatar} size={48} idx={idx} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--cream)' }}>
              {member.name}
            </h3>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.18rem 0.55rem',
                background: sc.bg,
                color: sc.color,
                border: `1px solid ${sc.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {member.status}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--cream-muted)', marginTop: '0.2rem' }}>
            {member.role}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginTop: '0.1rem' }}>
            📍 {member.location} · Joined {member.joinedDate}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.6, borderLeft: '2px solid var(--border)', paddingLeft: '0.75rem' }}>
        {member.bio}
      </p>

      {/* Info row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p className="section-label" style={{ fontSize: '0.62rem', marginBottom: '0.2rem' }}>Career Break</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--cream)' }}>{member.breakDuration}</p>
        </div>
        <div>
          <p className="section-label" style={{ fontSize: '0.62rem', marginBottom: '0.2rem' }}>Target Role</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--cream)' }}>{member.targetRole}</p>
        </div>
        <div>
          <p className="section-label" style={{ fontSize: '0.62rem', marginBottom: '0.2rem' }}>Industry</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--cream)' }}>{member.industry}</p>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {member.skills.map(skill => (
          <span
            key={skill}
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.2rem 0.55rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--cream-muted)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Connect button */}
      <button
        onClick={() => onConnect(member.id)}
        style={{
          background: isConnected ? 'rgba(74,222,128,0.1)' : 'transparent',
          color: isConnected ? '#4ade80' : 'var(--cream-muted)',
          border: isConnected ? '1px solid rgba(74,222,128,0.3)' : '1px solid var(--border)',
          fontFamily: 'Syne, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.55rem 1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          width: '100%',
        }}
        onMouseEnter={e => {
          if (!isConnected) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--rose)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream)';
          }
        }}
        onMouseLeave={e => {
          if (!isConnected) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--cream-muted)';
          }
        }}
      >
        {isConnected ? '✓ Connected' : '+ Connect'}
      </button>
    </div>
  );
}

// ─── Join Modal ───────────────────────────────────────────────────────────────

function JoinModal({ onClose, onJoin }: { onClose: () => void; onJoin: (name: string, role: string) => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) onJoin(name.trim(), role.trim());
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: '100%', maxWidth: 440, padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>Join the Community</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--cream)' }}>
            Your re-entry journey starts here
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginTop: '0.4rem' }}>
            Connect with thousands of women navigating the same path.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Your Name</label>
            <input
              className="input"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Previous / Current Role</label>
            <input
              className="input"
              placeholder="e.g. Software Engineer"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Industry</label>
            <select
              className="input"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.filter(i => i !== 'All').map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>
              Join Community →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [joined, setJoined] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleJoin = (name: string, role: string) => {
    setMemberName(name);
    setJoined(true);
    setShowModal(false);
  };

  const handleConnect = (id: number) => {
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return MEMBERS.filter(m => {
      const matchSearch = search === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.targetRole.toLowerCase().includes(search.toLowerCase()) ||
        m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchIndustry = filterIndustry === 'All' || m.industry === filterIndustry;
      const matchStatus = filterStatus === 'All' || m.status === filterStatus;
      return matchSearch && matchIndustry && matchStatus;
    });
  }, [search, filterIndustry, filterStatus]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '4rem 2rem 3rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, height: 200, background: 'var(--rose-muted)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>✦ Community</p>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--cream)',
              lineHeight: 1.1, marginBottom: '1rem',
            }}
          >
            You are not alone
            <br />
            <span style={{ color: 'var(--rose)' }}>in your comeback.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-body)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            A safe space for women re-entering the workforce — share stories, exchange resources, and lift each other higher.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { label: 'Members', value: `${joined ? MEMBERS.length + 1 : MEMBERS.length}` },
              { label: 'Industries', value: '10+' },
              { label: 'Connections Made', value: '2.4k+' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--rose)' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {joined ? (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                padding: '0.75rem 1.5rem', color: '#4ade80',
                fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 700,
              }}
            >
              ✓ Welcome, {memberName}! You are part of the community.
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ fontSize: '0.9rem' }}>
              Join the Community ✦
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: '1.5rem 2rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center',
        }}
      >
        <input
          className="input"
          style={{ flex: '1 1 240px', maxWidth: 320 }}
          placeholder="Search by name, role, or skill…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="input"
          style={{ flex: '0 1 180px', cursor: 'pointer' }}
          value={filterIndustry}
          onChange={e => setFilterIndustry(e.target.value)}
        >
          {INDUSTRIES.map(i => <option key={i} value={i}>{i === 'All' ? 'All Industries' : i}</option>)}
        </select>

        <select
          className="input"
          style={{ flex: '0 1 200px', cursor: 'pointer' }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {['All', 'Actively Looking', 'Open to Opportunities', 'Just Started'].map(s => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
          {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Member Grid */}
      <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-body)' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</p>
            <p>No members match your search. Try different filters.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* If user just joined, show their card at the top */}
            {joined && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--rose)',
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Avatar initials={memberName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()} size={48} idx={8} />
                  <div>
                    <p className="section-label" style={{ fontSize: '0.6rem', marginBottom: '0.2rem' }}>You · Just Joined</p>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--cream)' }}>{memberName}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--cream-muted)' }}>New member</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  Welcome to the community! Complete your profile to connect with others.
                </p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'var(--rose-muted)', color: 'var(--rose)',
                  border: '1px solid rgba(232,146,124,0.3)',
                  padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content',
                }}>
                  ✦ Your Profile
                </span>
              </div>
            )}

            {filtered.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                idx={idx}
                isConnected={connected.has(member.id)}
                onConnect={handleConnect}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      {!joined && (
        <div
          style={{
            margin: '0 2rem 3rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--rose)',
            padding: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1rem', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '0.3rem' }}>
              Ready to share your journey?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>
              Join {MEMBERS.length}+ women who have already taken the first step back.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Join Now →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && <JoinModal onClose={() => setShowModal(false)} onJoin={handleJoin} />}
    </div>
  );
}
