import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/constants/categories';
import type { CategoryInfo } from '@/types/blog';
import { SectionHeading } from '@/components/common/SectionHeading';

export function CategoriesShowcase({ categories }: { categories?: CategoryInfo[] }) {
  const countFor = (value: string) =>
    categories?.find((c) => c.value === value)?.count ?? 0;

  return (
    <section className="container-page">
      <SectionHeading
        eyebrow="Browse"
        title="Explore by category"
        description="Find the topics you care about most."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.filter((c) => c.value !== 'OTHERS').map((c, i) => (
          <motion.div
            key={c.value}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <Link
              to={`/blog?category=${c.value}`}
              className={`group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-4 text-white shadow-soft transition-transform hover:-translate-y-1`}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15 blur-xl transition-transform group-hover:scale-150" />
              <span className="relative text-xs font-medium text-white/80">
                {countFor(c.value)} article{countFor(c.value) === 1 ? '' : 's'}
              </span>
              <span className="relative font-display text-lg font-bold leading-tight">
                {c.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
