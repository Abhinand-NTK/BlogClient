import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { FieldShell } from './Field';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  hint?: string;
  max?: number;
}

export function TagsInput({ value, onChange, label = 'Tags', hint, max = 20 }: Props) {
  const [input, setInput] = useState('');

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < max) onChange([...value, tag]);
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <FieldShell label={label} hint={hint ?? `Press Enter or comma to add. ${value.length}/${max}`}>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-ink-100 bg-white px-2 py-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/25 dark:border-white/10 dark:bg-ink-900">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
          >
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => input && add(input)}
          placeholder={value.length ? '' : 'react, typescript…'}
          className="flex-1 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
    </FieldShell>
  );
}
