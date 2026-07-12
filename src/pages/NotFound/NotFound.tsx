import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, Search } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Button } from '@/components/buttons/Button';

export default function NotFound() {
  useSEO({ title: 'Page not found' });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-50 px-4 text-center dark:bg-ink-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow"
      >
        <Compass className="h-10 w-10 animate-float" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 font-display text-7xl font-extrabold tracking-tight gradient-text sm:text-8xl"
      >
        404
      </motion.h1>
      <p className="mt-4 font-display text-2xl font-bold">This page went off the map</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-800/60 dark:text-ink-100/50">
        The page you’re looking for doesn’t exist or may have been moved. Let’s get you back on track.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/">
          <Button size="lg">
            <Home className="h-4 w-4" /> Back home
          </Button>
        </Link>
        <Link to="/blog">
          <Button size="lg" variant="outline">
            <Search className="h-4 w-4" /> Browse articles
          </Button>
        </Link>
      </div>
    </div>
  );
}
