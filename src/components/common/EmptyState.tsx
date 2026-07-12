import { FileQuestion } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'There are no items to display right now.',
  icon,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-100 py-16 text-center dark:border-white/10">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-800/60 dark:bg-white/5 dark:text-ink-100/50">
        {icon ?? <FileQuestion className="h-7 w-7" />}
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-800/60 dark:text-ink-100/50">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
