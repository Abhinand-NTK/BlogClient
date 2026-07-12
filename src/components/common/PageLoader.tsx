import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-ink-800/70 dark:text-ink-100/60">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}
