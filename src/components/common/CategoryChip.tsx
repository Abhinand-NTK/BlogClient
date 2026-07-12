import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { CATEGORY_COLOR, CATEGORY_LABEL } from '@/constants/categories';
import type { CategoryValue } from '@/types/blog';

interface Props {
  category: CategoryValue;
  asLink?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

/** Gradient category badge, optionally linking to the filtered blog list. */
export function CategoryChip({ category, asLink, className, size = 'sm' }: Props) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gradient-to-r font-semibold text-white shadow-sm',
        CATEGORY_COLOR[category],
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        className,
      )}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );

  if (asLink) {
    return (
      <Link to={`/blog?category=${category}`} className="focus-ring rounded-full">
        {content}
      </Link>
    );
  }
  return content;
}
