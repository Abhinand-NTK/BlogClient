import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, PenSquare, Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/buttons/Button';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Articles' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-soft' : 'bg-transparent',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white">
            B
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Blog<span className="gradient-text">Craft</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'focus-ring rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-ink-800/80 hover:text-ink-900 dark:text-ink-100/70 dark:hover:text-white',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search articles"
            onClick={() => navigate('/blog')}
            className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-800 transition hover:bg-ink-50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-white/5 sm:flex"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <Link to="/admin" className="hidden sm:block">
            <Button size="sm" className="gap-1.5">
              <PenSquare className="h-4 w-4" />
              Write
            </Button>
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-800 dark:border-white/10 dark:bg-ink-900 dark:text-ink-100 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass overflow-hidden md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-semibold',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-400'
                        : 'text-ink-800 dark:text-ink-100',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Write a post
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
