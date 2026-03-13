'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/resume', label: 'Resume' },
  { href: '/interview', label: 'Interview' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15,17,23,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--rose)',
            letterSpacing: '-0.01em',
          }}
        >
          ReLaunch
        </span>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 400,
            fontSize: '1.15rem',
            color: 'var(--cream)',
            letterSpacing: '-0.01em',
          }}
        >
          AI
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.4rem 0.85rem',
                color: active ? 'var(--rose)' : 'var(--cream-muted)',
                borderBottom: active ? '2px solid var(--rose)' : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
