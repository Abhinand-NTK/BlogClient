import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, FileText, Pencil, Plus, Trash2, TrendingUp, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBlogList, useDeleteBlog } from '@/hooks/useBlogs';
import { useDebounce } from '@/hooks/useDebounce';
import { useSEO } from '@/hooks/useSEO';
import type { Blog } from '@/types/blog';
import { CATEGORY_LABEL } from '@/constants/categories';
import { compactNumber, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { AdminShell } from '@/layouts/AdminShell';
import { Button } from '@/components/buttons/Button';
import { BlogCardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';

type Filter = 'ALL' | 'PUBLISHED' | 'DRAFT';

export default function Admin() {
  useSEO({ title: 'Admin Dashboard' });
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 350);
  const [toDelete, setToDelete] = useState<Blog | null>(null);

  const { data, isLoading, isError, refetch } = useBlogList({
    status: 'ALL',
    limit: 12,
    page,
    sort: 'newest',
    search: debounced || undefined,
  });

  const del = useDeleteBlog();

  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (filter === 'ALL') return list;
    return list.filter((b) => b.status === filter);
  }, [data, filter]);

  const stats = useMemo(() => {
    const list = data?.items ?? [];
    return {
      total: data?.pagination.total ?? 0,
      published: list.filter((b) => b.status === 'PUBLISHED').length,
      drafts: list.filter((b) => b.status === 'DRAFT').length,
      views: list.reduce((sum, b) => sum + b.views, 0),
    };
  }, [data]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      toast.success('Article deleted');
      setToDelete(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Manage your articles — no login required."
      actions={
        <Link to="/admin/new">
          <Button>
            <Plus className="h-4 w-4" /> New article
          </Button>
        </Link>
      }
    >
      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total articles', value: compactNumber(stats.total), icon: FileText, color: 'text-brand-500' },
          { label: 'Published (page)', value: stats.published, icon: Eye, color: 'text-green-500' },
          { label: 'Drafts (page)', value: stats.drafts, icon: Pencil, color: 'text-amber-500' },
          { label: 'Views (page)', value: compactNumber(stats.views), icon: TrendingUp, color: 'text-accent-500' },
        ].map((s) => (
          <div key={s.label} className="card-surface flex items-center gap-4 p-5">
            <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/5', s.color)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-ink-800/55 dark:text-ink-100/45">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl border border-ink-100 p-0.5 dark:border-white/10">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition',
                filter === f ? 'bg-brand-600 text-white' : 'text-ink-800/60 dark:text-ink-100/60',
              )}
            >
              {f.toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles…"
            className="h-10 w-full rounded-xl border border-ink-100 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-ink-900"
          />
        </div>
      </div>

      {/* Table */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No articles yet"
          message="Create your first article to get started."
          action={
            <Link to="/admin/new">
              <Button>
                <Plus className="h-4 w-4" /> New article
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="card-surface overflow-hidden">
            <div className="hidden grid-cols-[1fr_120px_100px_120px_120px] gap-4 border-b border-ink-100 px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink-800/50 dark:border-white/10 dark:text-ink-100/40 md:grid">
              <span>Article</span>
              <span>Category</span>
              <span>Status</span>
              <span>Published</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-ink-100 dark:divide-white/5">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 transition hover:bg-ink-50/60 dark:hover:bg-white/5 md:grid-cols-[1fr_120px_100px_120px_120px] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.featuredImage ?? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=200&q=60'}
                      alt=""
                      className="h-11 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold">{b.title}</p>
                      <p className="text-xs text-ink-800/50 dark:text-ink-100/40">
                        {compactNumber(b.views)} views · {b.readingTime}m
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-ink-800/60 dark:text-ink-100/50">
                    {CATEGORY_LABEL[b.category]}
                  </span>
                  <span>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold',
                        b.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
                      )}
                    >
                      {b.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                    </span>
                  </span>
                  <span className="text-xs text-ink-800/60 dark:text-ink-100/50">
                    {b.publishedAt ? formatDate(b.publishedAt) : '—'}
                  </span>
                  <div className="flex items-center gap-1 md:justify-end">
                    <Link
                      to={`/blog/${b.slug}`}
                      title="Preview"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-800/60 transition hover:bg-ink-100 hover:text-brand-600 dark:text-ink-100/60 dark:hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => navigate(`/admin/edit/${b.id}`)}
                      title="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-800/60 transition hover:bg-ink-100 hover:text-brand-600 dark:text-ink-100/60 dark:hover:bg-white/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToDelete(b)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-800/60 transition hover:bg-red-100 hover:text-red-600 dark:text-ink-100/60 dark:hover:bg-red-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={data?.pagination.totalPages ?? 1}
              onChange={setPage}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete article?"
        message={`“${toDelete?.title}” will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        loading={del.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </AdminShell>
  );
}
