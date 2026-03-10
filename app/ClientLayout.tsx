// app/ClientLayout.tsx
'use client';

import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

type LayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <TaskProvider>
          <AppShell>{children}</AppShell>
        </TaskProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

function AppShell({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header
        className="relative isolate bg-black text-white shadow-lg"
        style={{ backgroundColor: '#bbbaba6a' }}
      >
        {/* User Actions */}
        <div className="fixed top-4 right-4 flex items-center gap-x-2 sm:gap-x-4 text-xs sm:text-sm font-semibold z-50">
          {user ? (
            <>
              <span className="hidden rounded-full bg-white/10 px-2 py-1 text-white/90 text-xs sm:inline sm:px-3">
                {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-sky-400 px-2 py-1 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(236,72,153,0.35)] transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:px-3"
              >
                Log out
              </button>
            </>
          ) : null}
        </div>
        
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:px-8 md:flex-row md:items-center">

          {/* Title */}
          <div className="flex flex-col items-center gap-2 text-center md:flex-1 md:items-start md:text-left">
            <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Task Manager
            </h1>
            <p className="text-xs text-white/80 sm:text-sm">
              Streamline your workflow
            </p>
          </div>

          {/* Navigation (MENU BUTTONS) */}
          <nav className="flex items-center justify-center gap-x-2 sm:gap-x-4 md:ml-auto md:justify-end">
            <Link
              href="/"
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white transition-all duration-200
                         hover:bg-white hover:text-slate-900 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white transition-all duration-200
                         hover:bg-white hover:text-slate-900 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
            >
              About
            </Link>

            <Link
              href="#footer"
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white transition-all duration-200
                         hover:bg-white hover:text-slate-900 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full flex-1">{children}</main>

      <footer id="footer" className="bg-slate-950 text-slate-100">
        <div className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute -top-20 left-10 -z-10 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 -z-10 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mt-8 flex flex-col items-center gap-3 pt-4 text-center text-xs text-slate-500 sm:mt-12 sm:pt-6">
              <div className="flex flex-col items-center gap-1 text-center">
                <span style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">Contact Us: 0760813231</span>
                <span style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">Email: james.kata@cs.unza.zm</span>
              </div>
              <p style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">&copy; {currentYear} All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <span style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">Privacy</span>
                <span style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">Terms</span>
                <span style={{ color: 'rgb(100, 116, 139)' }} className="text-xs sm:text-sm">Support Center</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
