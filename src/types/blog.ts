export type BlogStatus = 'DRAFT' | 'PUBLISHED';

export type CategoryValue =
  | 'TECHNOLOGY'
  | 'PROGRAMMING'
  | 'ARTIFICIAL_INTELLIGENCE'
  | 'MACHINE_LEARNING'
  | 'TRAVEL'
  | 'FOOD'
  | 'BUSINESS'
  | 'FINANCE'
  | 'TUTORIALS'
  | 'LIFESTYLE'
  | 'PERSONAL'
  | 'OPEN_SOURCE'
  | 'OTHERS';

export interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: string;
  category: CategoryValue;
  tags: string[];
  author: string;
  featuredImage: string | null;
  galleryImages: string[];
  readingTime: number;
  featured: boolean;
  status: BlogStatus;
  views: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  ogImage: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogNavItem {
  slug: string;
  title: string;
}

export interface BlogDetailResponse {
  blog: Blog;
  related: Blog[];
  navigation: {
    prev: BlogNavItem | null;
    next: BlogNavItem | null;
  };
}

export interface HomeFeed {
  featured: Blog | null;
  latest: Blog[];
  trending: Blog[];
}

export interface CategoryInfo {
  value: CategoryValue;
  label: string;
  count: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface ListParams {
  page?: number;
  limit?: number;
  category?: CategoryValue;
  search?: string;
  sort?: 'newest' | 'oldest' | 'popular';
  status?: BlogStatus | 'ALL';
  tag?: string;
  featured?: boolean;
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
  uploadUrl: string;
}
