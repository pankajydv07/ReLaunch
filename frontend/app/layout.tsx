import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ReLaunchAI — AI Career Re-Entry for Women',
  description:
    'Skill gap analysis, personalised roadmaps, ATS resume feedback and AI interview coaching to help women re-enter the workforce with confidence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
