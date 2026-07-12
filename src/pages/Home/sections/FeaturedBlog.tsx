import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import type { Blog } from '@/types/blog';
import { CategoryChip } from '@/components/common/CategoryChip';
import { Avatar } from '@/components/common/Avatar';
import { formatDate, readingLabel } from '@/utils/format';

const FALLBACK =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80';

export function FeaturedBlog({ blog }: { blog: Blog }) {
  return (
    <section className="container-page">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-surface group grid overflow-hidden lg:grid-cols-2"
      >
        <Link to={`/blog/${blog.slug}`} className="relative block overflow-hidden">
          <img
            src={blog.featuredImage ?? FALLBACK}
            alt={blog.title}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full"
          />
          <span className="absolute left-4 top-4 rounded-full bg-highlight-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
            Featured
          </span>
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10">
          <CategoryChip category={blog.category} size="md" className="w-fit" />
          <Link to={`/blog/${blog.slug}`}>
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400 sm:text-3xl">
              {blog.title}
            </h2>
          </Link>
          {blog.subtitle && (
            <p className="mt-3 text-base text-ink-800/70 dark:text-ink-100/60">{blog.subtitle}</p>
          )}
          <p className="mt-3 line-clamp-3 text-sm text-ink-800/60 dark:text-ink-100/50">
            {blog.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Avatar name={blog.author} />
            <div className="text-sm leading-tight">
              <p className="font-semibold">{blog.author}</p>
              <p className="flex items-center gap-2 text-xs text-ink-800/55 dark:text-ink-100/45">
                {formatDate(blog.publishedAt)}
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {readingLabel(blog.readingTime)}
                </span>
              </p>
            </div>
          </div>

          <Link
            to={`/blog/${blog.slug}`}
            className="group/link mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400"
          >
            Read the full story
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </motion.article>
    </section>
  );
}
