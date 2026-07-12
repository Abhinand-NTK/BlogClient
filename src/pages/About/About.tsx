import { motion } from 'framer-motion';
import { Compass, Feather, Heart, Rocket, Target, Users } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { PageTransition } from '@/components/common/PageTransition';
import { Newsletter } from '@/components/common/Newsletter';
import { Avatar } from '@/components/common/Avatar';

const SITE = import.meta.env.VITE_SITE_URL as string | undefined;

const values = [
  { icon: Target, title: 'Clarity over cleverness', text: 'We explain hard things simply, without dumbing them down.' },
  { icon: Heart, title: 'Reader-first', text: 'No clickbait, no fluff. Every article respects your time.' },
  { icon: Feather, title: 'Craft', text: 'Writing, design and code held to a high standard.' },
  { icon: Compass, title: 'Curiosity', text: 'We follow the interesting questions wherever they lead.' },
];

const team = [
  { name: 'Ada Lovelace', role: 'Editor-in-Chief' },
  { name: 'Alan Turing', role: 'AI & Research' },
  { name: 'Grace Hopper', role: 'Engineering' },
  { name: 'Marco Polo', role: 'Culture & Travel' },
];

export default function About() {
  useSEO({
    title: 'About',
    description: 'BlogCraft is a modern publication for curious minds. Learn about our mission and team.',
    url: SITE ? `${SITE}/about` : undefined,
    canonical: SITE ? `${SITE}/about` : undefined,
  });

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        </div>
        <div className="container-page py-20 text-center sm:py-28">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300"
          >
            <Rocket className="h-3.5 w-3.5" /> Our story
          </motion.span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            We publish <span className="gradient-text">ideas worth reading</span> for people who build the future
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-ink-800/70 dark:text-ink-100/60 sm:text-lg">
            BlogCraft started with a simple belief: technical writing can be both rigorous and a
            joy to read. We cover technology, programming, AI and the craft of building great
            software — always with clarity and care.
          </p>
        </div>
      </section>

      {/* Mission stats */}
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { k: '120+', v: 'Articles published' },
            { k: '48k', v: 'Monthly readers' },
            { k: '13', v: 'Topics covered' },
          ].map((s) => (
            <div key={s.v} className="card-surface p-8 text-center">
              <p className="font-display text-4xl font-extrabold gradient-text">{s.k}</p>
              <p className="mt-2 text-sm text-ink-800/60 dark:text-ink-100/50">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-page pb-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-extrabold">What we value</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-800/60 dark:text-ink-100/50">
            The principles behind everything we publish.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-surface p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-800/60 dark:text-ink-100/50">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page pb-20">
        <div className="mb-10 flex items-center justify-center gap-2">
          <Users className="h-5 w-5 text-accent-500" />
          <h2 className="font-display text-3xl font-extrabold">Meet the team</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-surface flex flex-col items-center p-6 text-center"
            >
              <Avatar name={m.name} className="h-16 w-16 text-lg" />
              <h3 className="mt-4 font-display font-bold">{m.name}</h3>
              <p className="text-xs text-ink-800/55 dark:text-ink-100/45">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="pb-4">
        <Newsletter />
      </div>
    </PageTransition>
  );
}
