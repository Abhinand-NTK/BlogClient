import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
}

export function SectionHeading({ eyebrow, title, description, linkTo, linkLabel }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-ink-800/70 dark:text-ink-100/60">
            {description}
          </p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400"
        >
          {linkLabel ?? 'View all'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
