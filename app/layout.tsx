// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import GlobalStyles from './GlobalStyles';

// Configure Inter font with display swap
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A simple task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <GlobalStyles />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}