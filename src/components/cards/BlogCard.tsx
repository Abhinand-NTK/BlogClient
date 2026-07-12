import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import type { Blog } from '@/types/blog';
import { CategoryChip } from '@/components/common/CategoryChip';
import { Avatar } from '@/components/common/Avatar';
import { compactNumber, formatDate, readingLabel } from '@/utils/format';

const FALLBACK =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

interface Props {
  blog: Blog;
  index?: number;
  variant?: 'default' | 'compact';
}

export function BlogCard({ blog, index = 0, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/blog/${blog.slug}`}
        className="group flex gap-4 rounded-xl p-2 transition hover:bg-ink-100/60 dark:hover:bg-white/5"
      >
        <img
          src={blog.featuredImage ?? FALLBACK}
          alt=""
          loading="lazy"
          className="h-16 w-20 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {blog.title}
          </h4>
          <p className="mt-1 text-xs text-ink-800/60 dark:text-ink-100/50">
            {formatDate(blog.publishedAt)} · {readingLabel(blog.readingTime)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <Link to={`/blog/${blog.slug}`} className="relative block overflow-hidden">
        <img
          src={blog.featuredImage ?? FALLBACK}
          alt={blog.title}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <CategoryChip category={blog.category} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {blog.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-800/70 dark:text-ink-100/60">
          {blog.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <Avatar name={blog.author} />
            <div className="leading-tight">
              <p className="text-xs font-semibold">{blog.author}</p>
              <p className="text-[11px] text-ink-800/55 dark:text-ink-100/45">
                {formatDate(blog.publishedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-800/55 dark:text-ink-100/45">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.readingTime}m
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {compactNumber(blog.views)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
