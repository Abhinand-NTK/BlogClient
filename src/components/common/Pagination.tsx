import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Builds a compact page range with ellipses, e.g. 1 … 4 5 6 … 20 */
function buildRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const range = buildRange(page, totalPages);

  const btn =
    'flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition';

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btn, 'border-ink-100 disabled:opacity-40 dark:border-white/10')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {range.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-ink-800/40 dark:text-ink-100/40">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              btn,
              p === page
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-ink-100 hover:border-brand-300 dark:border-white/10',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(btn, 'border-ink-100 disabled:opacity-40 dark:border-white/10')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
