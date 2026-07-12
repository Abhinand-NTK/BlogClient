import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Eye, Calendar } from 'lucide-react';
import { useBlog } from '@/hooks/useBlogs';
import { useSEO } from '@/hooks/useSEO';
import { extractToc } from '@/utils/toc';
import { compactNumber, formatDate, readingLabel } from '@/utils/format';
import { PageTransition } from '@/components/common/PageTransition';
import { PageLoader } from '@/components/common/PageLoader';
import { ErrorState } from '@/components/common/ErrorState';
import { CategoryChip } from '@/components/common/CategoryChip';
import { Avatar } from '@/components/common/Avatar';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { BlogCard } from '@/components/cards/BlogCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ImageGallery } from '@/components/blog/ImageGallery';
import { CommentsPlaceholder } from '@/components/blog/CommentsPlaceholder';

const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '');

export default function BlogDetails() {
  const { slug = '' } = useParams();
  const { data, isLoading, isError, refetch } = useBlog(slug);

  const toc = useMemo(() => (data ? extractToc(data.blog.content) : []), [data]);
  const pageUrl = SITE ? `${SITE}/blog/${slug}` : (typeof window !== 'undefined' ? window.location.href : '');

  const blog = data?.blog;

  useSEO(
    blog
      ? {
          title: blog.seoTitle ?? blog.title,
          description: blog.seoDescription ?? blog.excerpt,
          image: blog.ogImage ?? blog.featuredImage ?? undefined,
          url: pageUrl,
          type: 'article',
          keywords: blog.seoKeywords,
          canonical: blog.canonicalUrl || pageUrl,
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: blog.title,
              description: blog.excerpt,
              image: blog.featuredImage ?? undefined,
              author: { '@type': 'Person', name: blog.author },
              datePublished: blog.publishedAt ?? blog.createdAt,
              dateModified: blog.updatedAt,
              mainEntityOfPage: pageUrl,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
                { '@type': 'ListItem', position: 2, name: 'Articles', item: SITE ? `${SITE}/blog` : undefined },
                { '@type': 'ListItem', position: 3, name: blog.title, item: pageUrl },
              ],
            },
          ],
        }
      : { title: 'Loading…' },
  );

  if (isLoading) return <PageLoader />;
  if (isError || !blog)
    return (
      <div className="container-page py-20">
        <ErrorState
          title="Article not found"
          message="This story may have been moved or removed."
          onRetry={() => refetch()}
        />
        <div className="mt-6 text-center">
          <Link to="/blog" className="text-sm font-semibold text-brand-600">
            ← Back to all articles
          </Link>
        </div>
      </div>
    );

  const { related, navigation } = data;

  return (
    <PageTransition>
      <ReadingProgress />

      <article>
        {/* Header */}
        <header className="container-page pt-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-ink-800/60 dark:text-ink-100/50">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-brand-600">Articles</Link>
            <span>/</span>
            <span className="truncate text-ink-900 dark:text-ink-100">{blog.title}</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <CategoryChip category={blog.category} asLink size="md" />
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl"
            >
              {blog.title}
            </motion.h1>
            {blog.subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-800/70 dark:text-ink-100/60">
                {blog.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-800/60 dark:text-ink-100/50">
              <span className="flex items-center gap-2">
                <Avatar name={blog.author} className="h-7 w-7 text-[10px]" />
                <span className="font-semibold text-ink-900 dark:text-ink-100">{blog.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {readingLabel(blog.readingTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {compactNumber(blog.views)} views
              </span>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {blog.featuredImage && (
          <div className="container-page mt-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={blog.featuredImage}
              alt={blog.title}
              className="mx-auto max-h-[520px] w-full max-w-5xl rounded-3xl object-cover shadow-soft"
            />
          </div>
        )}

        {/* Body with TOC sidebar */}
        <div className="container-page mt-12">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0 max-w-3xl">
              <MarkdownRenderer content={blog.content} />

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {blog.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/blog?tag=${encodeURIComponent(t)}`}
                      className="rounded-full border border-ink-100 px-3 py-1 text-xs font-medium text-ink-800/70 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-ink-100/60"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 flex flex-col gap-4 border-y border-ink-100 py-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold">Share this article</p>
                <ShareButtons url={pageUrl} title={blog.title} />
              </div>

              <ImageGallery images={blog.galleryImages} />
              <CommentsPlaceholder />
            </div>

            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
                <div className="mt-8 border-t border-ink-100 pt-6 dark:border-white/10">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-800/50 dark:text-ink-100/50">
                    Share
                  </p>
                  <ShareButtons url={pageUrl} title={blog.title} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Prev / Next */}
        {(navigation.prev || navigation.next) && (
          <div className="container-page mt-16">
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
              {navigation.prev ? (
                <Link
                  to={`/blog/${navigation.prev.slug}`}
                  className="card-surface group flex items-center gap-3 p-5 transition hover:border-brand-300"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-brand-500 transition group-hover:-translate-x-1" />
                  <div>
                    <p className="text-xs text-ink-800/50 dark:text-ink-100/40">Previous</p>
                    <p className="line-clamp-1 font-semibold">{navigation.prev.title}</p>
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {navigation.next && (
                <Link
                  to={`/blog/${navigation.next.slug}`}
                  className="card-surface group flex items-center justify-end gap-3 p-5 text-right transition hover:border-brand-300"
                >
                  <div>
                    <p className="text-xs text-ink-800/50 dark:text-ink-100/40">Next</p>
                    <p className="line-clamp-1 font-semibold">{navigation.next.title}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-500 transition group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="container-page mt-20">
            <SectionHeading eyebrow="Keep reading" title="Related articles" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b, i) => (
                <BlogCard key={b.id} blog={b} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PageTransition>
  );
}
