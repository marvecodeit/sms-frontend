// Root layout wrapper - this goes in src/app/layout.tsx
import type { Metadata } from 'next';
import { Providers } from '@/providers';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'Modern School Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
