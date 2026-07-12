import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/buttons/Button';

/** Front-end-only newsletter capture (wire to a provider later). */
export function Newsletter() {
  const [email, setEmail] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('You are subscribed! 🎉');
    setEmail('');
  };

  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 px-6 py-12 text-center shadow-glow sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent-400/20 blur-2xl" />
        <div className="relative mx-auto max-w-xl">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
            <Mail className="h-6 w-6" />
          </span>
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Never miss a story
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Get the best articles on technology, programming and AI delivered to your inbox.
            No spam, unsubscribe anytime.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-12 w-full rounded-xl border-0 bg-white/95 px-4 text-sm text-ink-900 outline-none ring-white/40 placeholder:text-ink-800/50 focus:ring-2"
            />
            <Button type="submit" size="lg" className="!bg-white !text-brand-700 hover:!bg-white/90">
              <Send className="h-4 w-4" />
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
