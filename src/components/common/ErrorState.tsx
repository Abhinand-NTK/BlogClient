import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/buttons/Button';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200/60 bg-red-50/50 py-16 text-center dark:border-red-500/20 dark:bg-red-500/5">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-800/60 dark:text-ink-100/50">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
