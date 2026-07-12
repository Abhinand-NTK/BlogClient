import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, MessageSquare, Send, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO } from '@/hooks/useSEO';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/buttons/Button';
import { Input, Textarea } from '@/components/forms/Field';

const SITE = import.meta.env.VITE_SITE_URL as string | undefined;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  useSEO({
    title: 'Contact',
    description: 'Get in touch with the BlogCraft team.',
    url: SITE ? `${SITE}/contact` : undefined,
    canonical: SITE ? `${SITE}/contact` : undefined,
  });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name';
    if (!emailRe.test(form.email)) next.email = 'Enter a valid email';
    if (form.message.trim().length < 10) next.message = 'Message is too short';
    setErrors(next);
    if (Object.keys(next).length) return;

    // No backend for contact — simulate a successful send.
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent! We’ll be in touch. 📬');
    }, 800);
  };

  const channels = [
    { icon: Mail, label: 'Email', value: 'hello@blogcraft.dev' },
    { icon: MapPin, label: 'Location', value: 'Remote · Worldwide' },
    { icon: MessageSquare, label: 'Response time', value: 'Within 48 hours' },
  ];

  return (
    <PageTransition>
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink-800/70 dark:text-ink-100/60">
            Questions, feedback, or a story pitch? We’d love to hear from you.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="card-surface space-y-5 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Name" required value={form.name} onChange={set('name')} error={errors.name} />
              <Input label="Email" required type="email" value={form.email} onChange={set('email')} error={errors.email} />
            </div>
            <Input label="Subject" value={form.subject} onChange={set('subject')} placeholder="What’s this about?" />
            <Textarea
              label="Message"
              required
              rows={6}
              value={form.message}
              onChange={set('message')}
              error={errors.message}
              placeholder="Tell us more…"
            />
            <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto">
              <Send className="h-4 w-4" /> Send message
            </Button>
          </motion.form>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-surface space-y-5 p-6">
              {channels.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-ink-800/55 dark:text-ink-100/45">{c.label}</p>
                    <p className="text-sm font-semibold">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-surface p-6">
              <p className="mb-3 text-sm font-semibold">Follow us</p>
              <div className="flex gap-2">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-800/70 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-ink-100/60"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
