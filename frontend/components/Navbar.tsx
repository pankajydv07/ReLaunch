'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/interview', label: 'Interview Coach' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span
            className="text-slate-900 font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ReLaunch<span className="text-rose-brand">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-rose-50 text-rose-brand'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 bg-rose-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Start Your Journey
        </Link>

        {/* Mobile hamburger placeholder */}
        <div className="sm:hidden flex items-center gap-4">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="text-xs text-slate-600 font-medium">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
