import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import type { TocItem } from '@/utils/toc';

/** Sticky TOC that highlights the section currently in view. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-800/50 dark:text-ink-100/50">
        On this page
      </p>
      <ul className="space-y-1 border-l border-ink-100 dark:border-white/10">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                '-ml-px block border-l-2 py-1 transition-colors',
                item.level === 3 ? 'pl-6' : 'pl-4',
                activeId === item.id
                  ? 'border-brand-500 font-semibold text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-ink-800/60 hover:text-ink-900 dark:text-ink-100/50 dark:hover:text-white',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
