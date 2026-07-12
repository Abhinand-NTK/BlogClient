import { useRef, useState } from 'react';
import {
  Bold,
  Code,
  Eye,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Table,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { uploadService } from '@/services/upload.service';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

type Wrap = { before: string; after?: string; placeholder?: string; block?: boolean };

const tools: { icon: typeof Bold; title: string; wrap: Wrap }[] = [
  { icon: Bold, title: 'Bold', wrap: { before: '**', after: '**', placeholder: 'bold text' } },
  { icon: Italic, title: 'Italic', wrap: { before: '_', after: '_', placeholder: 'italic text' } },
  { icon: Heading2, title: 'Heading', wrap: { before: '## ', placeholder: 'Heading', block: true } },
  { icon: Quote, title: 'Quote', wrap: { before: '> ', placeholder: 'Quote', block: true } },
  { icon: List, title: 'Bullet list', wrap: { before: '- ', placeholder: 'List item', block: true } },
  { icon: ListOrdered, title: 'Numbered list', wrap: { before: '1. ', placeholder: 'List item', block: true } },
  { icon: Code, title: 'Code block', wrap: { before: '```\n', after: '\n```', placeholder: 'code' } },
  { icon: Link2, title: 'Link', wrap: { before: '[', after: '](https://)', placeholder: 'link text' } },
  { icon: Table, title: 'Table', wrap: { before: '\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n', block: true } },
];

export function MarkdownEditor({ value, onChange, error }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [uploading, setUploading] = useState(false);

  const applyWrap = (w: Wrap) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || w.placeholder || '';
    const after = w.after ?? '';
    const insertion = `${w.before}${selected}${after}`;
    const next = value.slice(0, start) + insertion + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + w.before.length + selected.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const insertImage = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadService.upload(file);
      const md = `\n![${file.name}](${res.url})\n`;
      onChange(value + md);
      toast.success('Image inserted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-lg border border-ink-100 p-0.5 dark:border-white/10">
          {(['write', 'preview'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold capitalize transition',
                tab === t ? 'bg-brand-600 text-white' : 'text-ink-800/60 dark:text-ink-100/60',
              )}
            >
              {t === 'write' ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 dark:border-white/10">
        {tab === 'write' && (
          <div className="flex flex-wrap items-center gap-0.5 border-b border-ink-100 bg-ink-50/60 p-1.5 dark:border-white/10 dark:bg-white/5">
            {tools.map((t) => (
              <button
                key={t.title}
                type="button"
                title={t.title}
                onClick={() => applyWrap(t.wrap)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/70 transition hover:bg-white hover:text-brand-600 dark:text-ink-100/60 dark:hover:bg-white/10"
              >
                <t.icon className="h-4 w-4" />
              </button>
            ))}
            <label
              title="Upload image"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-ink-800/70 transition hover:bg-white hover:text-brand-600 dark:text-ink-100/60 dark:hover:bg-white/10"
            >
              <ImageIcon className={cn('h-4 w-4', uploading && 'animate-pulse')} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) insertImage(f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        )}

        {tab === 'write' ? (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your story in Markdown…"
            className="min-h-[420px] w-full resize-y bg-white p-4 font-mono text-sm leading-relaxed outline-none dark:bg-ink-900"
          />
        ) : (
          <div className="min-h-[420px] bg-white p-6 dark:bg-ink-900">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-sm text-ink-800/50">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
