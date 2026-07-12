import { z } from 'zod';
import { CATEGORIES } from '@/constants/categories';

const categoryValues = CATEGORIES.map((c) => c.value) as [string, ...string[]];

export const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(160),
  subtitle: z.string().max(220).optional().or(z.literal('')),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Only lowercase letters, numbers and hyphens')
    .max(200)
    .optional()
    .or(z.literal('')),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(categoryValues),
  author: z.string().min(1, 'Author is required').max(80),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  seoTitle: z.string().max(70).optional().or(z.literal('')),
  seoDescription: z.string().max(180).optional().or(z.literal('')),
  canonicalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  ogImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const emptyBlogForm: BlogFormValues = {
  title: '',
  subtitle: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'TECHNOLOGY',
  author: 'Editorial Team',
  featuredImage: '',
  featured: false,
  status: 'DRAFT',
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  ogImage: '',
};
