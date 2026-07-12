import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { SectionHeading } from '@/components/common/SectionHeading';

const testimonials = [
  {
    quote:
      'BlogCraft is my go-to for staying current. The writing is sharp and the depth is exactly right — practical without being shallow.',
    name: 'Priya Sharma',
    role: 'Staff Engineer, Fintech',
  },
  {
    quote:
      'The AI and machine learning coverage helped me level up faster than any course. Clear explanations, real examples.',
    name: 'James Okoro',
    role: 'ML Researcher',
  },
  {
    quote:
      'Beautifully designed and genuinely useful. I read it every morning with my coffee. Highly recommended.',
    name: 'Elena Rossi',
    role: 'Product Designer',
  },
];

export function Testimonials() {
  return (
    <section className="container-page">
      <SectionHeading
        eyebrow="Loved by readers"
        title="What our community says"
        description="Join thousands of curious minds who read us every week."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="card-surface flex flex-col p-6"
          >
            <Quote className="h-8 w-8 text-brand-500/30" />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-800/80 dark:text-ink-100/70">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4 dark:border-white/5">
              <Avatar name={t.name} />
              <div className="text-sm leading-tight">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-ink-800/55 dark:text-ink-100/45">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
