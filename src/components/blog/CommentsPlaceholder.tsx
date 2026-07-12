import { MessageCircle } from 'lucide-react';

/** Visual placeholder — wire up a real comments backend later. */
export function CommentsPlaceholder() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-ink-100 p-8 text-center dark:border-white/10">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-800/60 dark:bg-white/5 dark:text-ink-100/50">
        <MessageCircle className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg font-bold">Comments coming soon</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-800/60 dark:text-ink-100/50">
        Join the conversation — a full commenting experience is on the way.
      </p>
    </div>
  );
}
