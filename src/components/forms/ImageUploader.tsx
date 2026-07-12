import { useCallback, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from '@/services/upload.service';
import { cn } from '@/utils/cn';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}

/** Single-image drag-drop uploader with preview and progress bar. */
export function ImageUploader({ value, onChange, label = 'Cover image', aspect = 'aspect-[16/9]' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image must be under 8MB');
        return;
      }
      setUploading(true);
      setProgress(0);
      try {
        const res = await uploadService.upload(file, setProgress);
        onChange(res.url);
        toast.success('Image uploaded');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      {value ? (
        <div className={cn('group relative overflow-hidden rounded-xl border border-ink-100 dark:border-white/10', aspect)}>
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/50 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-900"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition',
            aspect,
            dragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
              : 'border-ink-100 hover:border-brand-300 dark:border-white/10',
          )}
        >
          {uploading ? (
            <div className="w-full max-w-xs">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-500" />
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-800/60">Uploading… {progress}%</p>
            </div>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-ink-800/40 dark:text-ink-100/40" />
              <p className="mt-2 text-sm font-semibold">Drop an image or click to upload</p>
              <p className="mt-1 text-xs text-ink-800/50 dark:text-ink-100/40">PNG, JPG or WebP up to 8MB</p>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/** Multi-image uploader for a gallery. */
export function GalleryUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const res = await uploadService.upload(file);
        uploaded.push(res.url);
      }
      onChange([...value, ...uploaded]);
      if (uploaded.length) toast.success(`${uploaded.length} image(s) added`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">Gallery images</label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((src) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border border-ink-100 dark:border-white/10">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((s) => s !== src))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink-100 text-ink-800/50 transition hover:border-brand-300 dark:border-white/10"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="mt-1 text-[11px]">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
