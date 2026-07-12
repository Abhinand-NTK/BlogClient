import type { CategoryValue } from '@/types/blog';

export const CATEGORIES: { value: CategoryValue; label: string; color: string }[] = [
  { value: 'TECHNOLOGY', label: 'Technology', color: 'from-blue-500 to-cyan-500' },
  { value: 'PROGRAMMING', label: 'Programming', color: 'from-indigo-500 to-blue-500' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence', color: 'from-violet-500 to-purple-500' },
  { value: 'MACHINE_LEARNING', label: 'Machine Learning', color: 'from-purple-500 to-fuchsia-500' },
  { value: 'TRAVEL', label: 'Travel', color: 'from-emerald-500 to-teal-500' },
  { value: 'FOOD', label: 'Food', color: 'from-orange-500 to-amber-500' },
  { value: 'BUSINESS', label: 'Business', color: 'from-slate-500 to-gray-600' },
  { value: 'FINANCE', label: 'Finance', color: 'from-green-500 to-emerald-600' },
  { value: 'TUTORIALS', label: 'Tutorials', color: 'from-rose-500 to-pink-500' },
  { value: 'LIFESTYLE', label: 'Lifestyle', color: 'from-pink-500 to-rose-400' },
  { value: 'PERSONAL', label: 'Personal', color: 'from-amber-500 to-yellow-500' },
  { value: 'OPEN_SOURCE', label: 'Open Source', color: 'from-teal-500 to-cyan-600' },
  { value: 'OTHERS', label: 'Others', color: 'from-gray-400 to-slate-500' },
];

export const CATEGORY_LABEL: Record<CategoryValue, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.value]: c.label }),
  {} as Record<CategoryValue, string>,
);

export const CATEGORY_COLOR: Record<CategoryValue, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.value]: c.color }),
  {} as Record<CategoryValue, string>,
);
