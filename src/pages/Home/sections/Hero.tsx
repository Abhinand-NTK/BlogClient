import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PenSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/buttons/Button';

const stats = [
  { label: 'Articles', value: '120+' },
  { label: 'Monthly readers', value: '48k' },
  { label: 'Topics', value: '13' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/20" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-600/20" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-highlight-400/10 blur-3xl" />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Fresh perspectives, published weekly
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
          >
            Ideas worth <span className="gradient-text">reading</span>,
            <br className="hidden sm:block" /> stories worth sharing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-6 max-w-xl text-base text-ink-800/70 dark:text-ink-100/60 sm:text-lg"
          >
            A modern publication covering technology, programming, artificial intelligence,
            and the craft of building great software.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/blog">
              <Button size="lg">
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline">
                <PenSquare className="h-4 w-4" />
                Write a post
              </Button>
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
            className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="font-display text-2xl font-extrabold sm:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-xs text-ink-800/60 dark:text-ink-100/50">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
