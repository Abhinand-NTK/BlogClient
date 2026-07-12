import { Link } from 'react-router-dom';
import { Github, Linkedin, Rss, Twitter } from 'lucide-react';
import { CATEGORIES } from '@/constants/categories';

const socials = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Rss, href: '/sitemap.xml', label: 'RSS' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-white dark:border-white/10 dark:bg-ink-950">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white">
              B
            </span>
            <span className="font-display text-xl font-extrabold">
              Blog<span className="gradient-text">Craft</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-800/70 dark:text-ink-100/60">
            A modern publication for curious minds. Ideas worth reading on technology,
            programming, AI and more.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 text-ink-800/70 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-ink-100/60 dark:hover:text-brand-400"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900 dark:text-ink-100">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-800/70 dark:text-ink-100/60">
            <li><Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">Home</Link></li>
            <li><Link to="/blog" className="hover:text-brand-600 dark:hover:text-brand-400">All Articles</Link></li>
            <li><Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">Write</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900 dark:text-ink-100">
            Categories
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-ink-800/70 dark:text-ink-100/60">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.value}>
                <Link
                  to={`/blog?category=${c.value}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900 dark:text-ink-100">
            Colophon
          </h3>
          <p className="mt-4 text-sm text-ink-800/70 dark:text-ink-100/60">
            Built with React 19, Express and Prisma. Deployed on Netlify &amp; Render.
          </p>
        </div>
      </div>

      <div className="border-t border-ink-100 py-6 dark:border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-ink-800/60 dark:text-ink-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} BlogCraft. All rights reserved.</p>
          <p>Crafted with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
