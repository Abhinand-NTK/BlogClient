import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

interface Props {
  name: string;
  className?: string;
}

export function Avatar({ name, className }: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
