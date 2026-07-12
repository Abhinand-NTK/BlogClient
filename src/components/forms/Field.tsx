import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const base =
  'w-full rounded-xl border border-ink-100 bg-white px-3.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 dark:border-white/10 dark:bg-ink-900 disabled:opacity-60';

export function FieldShell({
  label,
  hint,
  error,
  required,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-1 text-sm font-semibold">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-800/55 dark:text-ink-100/45">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, required, className, ...props }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <input ref={ref} className={cn(base, 'h-11', className)} {...props} />
    </FieldShell>
  ),
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, className, ...props }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <textarea ref={ref} className={cn(base, 'py-2.5', className)} {...props} />
    </FieldShell>
  ),
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, options, className, ...props }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <select ref={ref} className={cn(base, 'h-11', className)} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  ),
);
Select.displayName = 'Select';
