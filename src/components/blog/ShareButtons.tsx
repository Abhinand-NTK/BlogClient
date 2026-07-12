import { Check, Link2, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const links = [
    { icon: Twitter, label: 'Twitter', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { icon: Linkedin, label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Share on ${l.label}`}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-800/70 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-ink-100/60 dark:hover:text-brand-400"
        >
          <l.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-800/70 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-ink-100/60 dark:hover:text-brand-400"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
