import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plan PBN — litery ze styroduru (v2)',
  description: 'SEO Planner - plan budowy sieci PBN dla fraz związanych z literami ze styroduru',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
