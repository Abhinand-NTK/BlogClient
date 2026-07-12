import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useHomeFeed, useCategories } from '@/hooks/useBlogs';
import { useSEO } from '@/hooks/useSEO';
import { PageTransition } from '@/components/common/PageTransition';
import { BlogCard } from '@/components/cards/BlogCard';
import { BlogCardSkeletonGrid } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Newsletter } from '@/components/common/Newsletter';
import { Hero } from './sections/Hero';
import { FeaturedBlog } from './sections/FeaturedBlog';
import { CategoriesShowcase } from './sections/CategoriesShowcase';
import { Testimonials } from './sections/Testimonials';

const SITE = import.meta.env.VITE_SITE_URL as string | undefined;

export default function Home() {
  const { data, isLoading, isError, refetch } = useHomeFeed();
  const { data: categories } = useCategories();

  useSEO({
    title: 'Ideas worth reading',
    description:
      'BlogCraft is a modern publication covering technology, programming, AI, machine learning and more.',
    url: SITE,
    canonical: SITE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BlogCraft',
      url: SITE,
    },
  });

  return (
    <PageTransition>
      <Hero />

      <div className="space-y-20 pb-4">
        {isError && (
          <div className="container-page">
            <ErrorState
              message="We couldn't load the latest stories. The API may be waking up — try again."
              onRetry={() => refetch()}
            />
          </div>
        )}

        {data?.featured && <FeaturedBlog blog={data.featured} />}

        {/* Latest + Trending */}
        <section className="container-page">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="Fresh off the press"
                title="Latest articles"
                linkTo="/blog"
                linkLabel="Browse all"
              />
              {isLoading ? (
                <BlogCardSkeletonGrid count={4} />
              ) : data && data.latest.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {data.latest.slice(0, 4).map((b, i) => (
                    <BlogCard key={b.id} blog={b} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No articles yet"
                  message="Be the first to publish a story."
                  action={
                    <Link to="/admin" className="text-sm font-semibold text-brand-600">
                      Write a post →
                    </Link>
                  }
                />
              )}
            </div>

            {/* Trending sidebar */}
            <aside>
              <div className="mb-8 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-highlight-500" />
                <h2 className="font-display text-xl font-extrabold">Trending now</h2>
              </div>
              <div className="card-surface divide-y divide-ink-100 p-3 dark:divide-white/5">
                {(data?.trending ?? []).map((b, i) => (
                  <div key={b.id} className="flex items-start gap-3 py-2">
                    <span className="mt-2 font-display text-lg font-extrabold text-brand-500/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <BlogCard blog={b} variant="compact" />
                  </div>
                ))}
                {!isLoading && (data?.trending?.length ?? 0) === 0 && (
                  <p className="p-4 text-sm text-ink-800/50">No trending posts yet.</p>
                )}
              </div>
            </aside>
          </div>
        </section>

        <CategoriesShowcase categories={categories} />

        {/* About snippet */}
        <section className="container-page">
          <div className="card-surface grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                About BlogCraft
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
                A publication for people who build the future
              </h2>
              <p className="mt-4 text-sm text-ink-800/70 dark:text-ink-100/60">
                We write for engineers, designers, founders and lifelong learners. Every article
                is crafted to be practical, honest and worth your time — no fluff, no clickbait.
              </p>
              <Link
                to="/about"
                className="mt-6 inline-block text-sm font-bold text-brand-600 dark:text-brand-400"
              >
                Learn more about us →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: 'Weekly', v: 'New articles' },
                { k: 'In-depth', v: 'Original research' },
                { k: 'Open', v: 'Community driven' },
                { k: 'Free', v: 'Always accessible' },
              ].map((x) => (
                <div key={x.k} className="rounded-xl bg-ink-100/60 p-4 dark:bg-white/5">
                  <p className="font-display text-lg font-extrabold gradient-text">{x.k}</p>
                  <p className="text-xs text-ink-800/60 dark:text-ink-100/50">{x.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />

        <Newsletter />
      </div>
    </PageTransition>
  );
}
