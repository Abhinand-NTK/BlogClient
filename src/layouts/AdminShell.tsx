import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface Props {
  title: string;
  subtitle?: string;
  back?: { to: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminShell({ title, subtitle, back, actions, children }: Props) {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/80">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-extrabold text-white">
                B
              </span>
              <span className="font-display text-lg font-extrabold">
                Blog<span className="gradient-text">Craft</span>
                <span className="ml-1 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-800/60 dark:bg-white/10 dark:text-ink-100/60">
                  Admin
                </span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden h-10 items-center gap-1.5 rounded-xl border border-ink-100 px-3 text-sm font-semibold text-ink-800/70 transition hover:bg-ink-100 dark:border-white/10 dark:text-ink-100/70 dark:hover:bg-white/5 sm:flex"
            >
              <Home className="h-4 w-4" /> View site
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        {back && (
          <Link
            to={back.to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800/70 hover:text-brand-600 dark:text-ink-100/60"
          >
            <ArrowLeft className="h-4 w-4" /> {back.label}
          </Link>
        )}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-ink-800/60 dark:text-ink-100/50">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
