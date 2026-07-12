import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Save, Send, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogFormSchema, emptyBlogForm, type BlogFormValues } from '@/validators/blog.schema';
import { CATEGORIES } from '@/constants/categories';
import { slugify } from '@/utils/format';
import { useSEO } from '@/hooks/useSEO';
import { useBlogById, useCreateBlog, useUpdateBlog } from '@/hooks/useBlogs';
import { AdminShell } from '@/layouts/AdminShell';
import { Button } from '@/components/buttons/Button';
import { Input, Select, Textarea } from '@/components/forms/Field';
import { TagsInput } from '@/components/forms/TagsInput';
import { MarkdownEditor } from '@/components/forms/MarkdownEditor';
import { ImageUploader } from '@/components/forms/ImageUploader';
import { PageLoader } from '@/components/common/PageLoader';

const DRAFT_KEY = 'blogcraft:draft';

export default function AdminEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  useSEO({ title: isEdit ? 'Edit article' : 'New article' });

  const { data: existing, isLoading } = useBlogById(id);
  const create = useCreateBlog();
  const update = useUpdateBlog();

  const [tags, setTags] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: emptyBlogForm,
  });

  const title = watch('title');

  // Hydrate the form when editing an existing article.
  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        subtitle: existing.subtitle ?? '',
        slug: existing.slug,
        excerpt: existing.excerpt,
        content: existing.content,
        category: existing.category,
        author: existing.author,
        featuredImage: existing.featuredImage ?? '',
        featured: existing.featured,
        status: existing.status,
        seoTitle: existing.seoTitle ?? '',
        seoDescription: existing.seoDescription ?? '',
        canonicalUrl: existing.canonicalUrl ?? '',
        ogImage: existing.ogImage ?? '',
      });
      setTags(existing.tags);
      setSlugTouched(true);
    }
  }, [existing, reset]);

  // Restore an unsaved draft on a fresh "new article".
  useEffect(() => {
    if (isEdit) return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        reset(parsed.values);
        setTags(parsed.tags ?? []);
        toast('Restored unsaved draft', { icon: '📝' });
      } catch {
        /* ignore corrupt draft */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  // Auto-generate slug from title until the user edits it manually.
  useEffect(() => {
    if (!slugTouched && title) setValue('slug', slugify(title));
  }, [title, slugTouched, setValue]);

  // Autosave to localStorage (new articles only) every few seconds.
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (isEdit || !isDirty) return;
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: getValues(), tags }));
      setSavedAt(new Date().toLocaleTimeString());
    }, 2000);
    return () => clearTimeout(autosaveRef.current);
  }, [watch(), tags, isEdit, isDirty, getValues]);

  const buildPayload = (values: BlogFormValues, status: BlogFormValues['status']) => ({
    ...values,
    status,
    tags,
    seoKeywords: tags,
    subtitle: values.subtitle || undefined,
    excerpt: values.excerpt || undefined,
    slug: values.slug || undefined,
    featuredImage: values.featuredImage || undefined,
    ogImage: values.ogImage || values.featuredImage || undefined,
    seoTitle: values.seoTitle || undefined,
    seoDescription: values.seoDescription || undefined,
    canonicalUrl: values.canonicalUrl || undefined,
  });

  const submit = (status: BlogFormValues['status']) =>
    handleSubmit(async (values) => {
      const payload = buildPayload(values, status);
      try {
        if (isEdit && id) {
          await update.mutateAsync({ id, payload });
          toast.success('Article updated');
        } else {
          const blog = await create.mutateAsync(payload);
          localStorage.removeItem(DRAFT_KEY);
          toast.success(status === 'PUBLISHED' ? 'Published! 🎉' : 'Draft saved');
          navigate(`/admin/edit/${blog.id}`, { replace: true });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Save failed');
      }
    })();

  const saving = create.isPending || update.isPending;

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <AdminShell
      title={isEdit ? 'Edit article' : 'New article'}
      subtitle={savedAt ? `Autosaved at ${savedAt}` : 'Fill in the details and publish when ready.'}
      back={{ to: '/admin', label: 'Back to dashboard' }}
      actions={
        <>
          {watch('slug') && isEdit && (
            <a href={`/blog/${watch('slug')}`} target="_blank" rel="noreferrer">
              <Button variant="outline" type="button">
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </a>
          )}
          <Button variant="outline" type="button" loading={saving} onClick={() => submit('DRAFT')}>
            <Save className="h-4 w-4" /> Save draft
          </Button>
          <Button type="button" loading={saving} onClick={() => submit('PUBLISHED')}>
            <Send className="h-4 w-4" /> Publish
          </Button>
        </>
      }
    >
      <form className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="card-surface space-y-5 p-6">
            <Input
              label="Title"
              required
              placeholder="An unmissable headline"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Subtitle"
              placeholder="A supporting line that adds context"
              error={errors.subtitle?.message}
              {...register('subtitle')}
            />
            <Textarea
              label="Excerpt"
              rows={2}
              hint="Shown in cards and search results. Leave blank to auto-generate."
              error={errors.excerpt?.message}
              {...register('excerpt')}
            />
          </div>

          <div className="card-surface p-6">
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <MarkdownEditor value={field.value} onChange={field.onChange} error={errors.content?.message} />
              )}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-surface space-y-4 p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-800/60 dark:text-ink-100/50">
              Publishing
            </h3>
            <Controller
              control={control}
              name="featuredImage"
              render={({ field }) => (
                <ImageUploader value={field.value} onChange={field.onChange} />
              )}
            />
            <Select
              label="Category"
              options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              {...register('category')}
            />
            <Input label="Author" error={errors.author?.message} {...register('author')} />
            <TagsInput value={tags} onChange={setTags} />
            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                className="h-4 w-4 rounded border-ink-200 text-brand-600 focus:ring-brand-500"
                {...register('featured')}
              />
              <label htmlFor="featured" className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-highlight-500" /> Feature on homepage
              </label>
            </div>
          </div>

          <div className="card-surface space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-accent-500" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-800/60 dark:text-ink-100/50">
                SEO
              </h3>
            </div>
            <div className="flex items-end gap-2">
              <Input
                label="Slug"
                className="font-mono"
                error={errors.slug?.message}
                {...register('slug', { onChange: () => setSlugTouched(true) })}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mb-0.5"
                onClick={() => {
                  setValue('slug', slugify(getValues('title')));
                  setSlugTouched(true);
                }}
              >
                Generate
              </Button>
            </div>
            <Input label="Meta title" hint="≤ 70 characters" error={errors.seoTitle?.message} {...register('seoTitle')} />
            <Textarea
              label="Meta description"
              rows={3}
              hint="≤ 180 characters"
              error={errors.seoDescription?.message}
              {...register('seoDescription')}
            />
            <Input label="Canonical URL" placeholder="https://…" error={errors.canonicalUrl?.message} {...register('canonicalUrl')} />
            <Controller
              control={control}
              name="ogImage"
              render={({ field }) => (
                <ImageUploader label="Open Graph image" value={field.value} onChange={field.onChange} aspect="aspect-[1200/630]" />
              )}
            />
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
