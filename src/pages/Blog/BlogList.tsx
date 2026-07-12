import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useBlogList, useCategories } from '@/hooks/useBlogs';
import { useDebounce } from '@/hooks/useDebounce';
import { useSEO } from '@/hooks/useSEO';
import type { CategoryValue, ListParams } from '@/types/blog';
import { CATEGORIES } from '@/constants/categories';
import { cn } from '@/utils/cn';
import { PageTransition } from '@/components/common/PageTransition';
import { SearchBox } from '@/components/common/SearchBox';
import { BlogCard } from '@/components/cards/BlogCard';
import { BlogCardSkeletonGrid } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';

const SITE = import.meta.env.VITE_SITE_URL as string | undefined;
const PAGE_SIZE = 9;

const sorts: { value: ListParams['sort']; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Popular' },
];

export default function BlogList() {
  const [params, setParams] = useSearchParams();

  const category = (params.get('category') as CategoryValue | null) ?? undefined;
  const sort = (params.get('sort') as ListParams['sort']) ?? 'newest';
  const page = Number(params.get('page') ?? 1);
  const tag = params.get('tag') ?? undefined;

  const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  // Push the debounced search term into the URL (and reset to page 1).
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set('search', debouncedSearch);
        else next.delete('search');
        if (next.get('search') !== prev.get('search')) next.delete('page');
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const query: ListParams = useMemo(
    () => ({ page, limit: PAGE_SIZE, category, sort, tag, search: debouncedSearch || undefined }),
    [page, category, sort, tag, debouncedSearch],
  );

  const { data, isLoading, isError, refetch, isFetching } = useBlogList(query);
  const { data: categories } = useCategories();

  useSEO({
    title: category ? `${category.replace(/_/g, ' ')} articles` : 'All Articles',
    description: 'Browse every article on BlogCraft — filter by category, search and sort.',
    url: SITE ? `${SITE}/blog` : undefined,
    canonical: SITE ? `${SITE}/blog` : undefined,
  });

  const patch = (updates: Record<string, string | null>) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(updates)) {
        if (v === null) next.delete(k);
        else next.set(k, v);
      }
      return next;
    });

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-ink-100 bg-white dark:border-white/10 dark:bg-ink-950">
        <div className="container-page py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {category ? CATEGORIES.find((c) => c.value === category)?.label : 'All Articles'}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-800/70 dark:text-ink-100/60">
              {tag
                ? `Articles tagged “${tag}”.`
                : 'Explore stories on technology, programming, AI and more.'}
            </p>
          </motion.div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
            <SearchBox value={searchInput} onChange={setSearchInput} className="lg:max-w-md" />
            <div className="flex items-center gap-2 lg:ml-auto">
              <SlidersHorizontal className="h-4 w-4 text-ink-800/50 dark:text-ink-100/50" />
              {sorts.map((s) => (
                <button
                  key={s.value}
                  onClick={() => patch({ sort: s.value!, page: null })}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                    sort === s.value
                      ? 'bg-brand-600 text-white'
                      : 'text-ink-800/70 hover:bg-ink-100 dark:text-ink-100/60 dark:hover:bg-white/5',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => patch({ category: null, page: null })}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                !category
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'border border-ink-100 text-ink-800/70 hover:border-brand-300 dark:border-white/10 dark:text-ink-100/60',
              )}
            >
              All
            </button>
            {CATEGORIES.map((c) => {
              const count = categories?.find((x) => x.value === c.value)?.count ?? 0;
              return (
                <button
                  key={c.value}
                  onClick={() => patch({ category: c.value, page: null })}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                    category === c.value
                      ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                      : 'border border-ink-100 text-ink-800/70 hover:border-brand-300 dark:border-white/10 dark:text-ink-100/60',
                  )}
                >
                  {c.label}
                  {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-page py-10">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <BlogCardSkeletonGrid count={9} />
        ) : data && data.items.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between text-sm text-ink-800/60 dark:text-ink-100/50">
              <p>
                {data.pagination.total} article{data.pagination.total === 1 ? '' : 's'}
                {isFetching && <span className="ml-2 animate-pulse">· updating…</span>}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((b, i) => (
                <BlogCard key={b.id} blog={b} index={i} />
              ))}
            </div>
            <div className="mt-12">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => patch({ page: String(p) })}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No articles found"
            message="Try adjusting your search or filters."
            action={
              <button
                onClick={() => {
                  setSearchInput('');
                  setParams({}, { replace: true });
                }}
                className="text-sm font-semibold text-brand-600"
              >
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </PageTransition>
  );
}
