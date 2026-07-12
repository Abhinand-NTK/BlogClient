import { apiClient } from './client';
import type {
  Blog,
  BlogDetailResponse,
  CategoryInfo,
  HomeFeed,
  ListParams,
  Paginated,
} from '@/types/blog';

interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: unknown;
}

export const blogsApi = {
  async list(params: ListParams): Promise<Paginated<Blog>> {
    const { data } = await apiClient.get<Envelope<Blog[]>>('/blogs', { params });
    return {
      items: data.data,
      pagination: data.meta as Paginated<Blog>['pagination'],
    };
  },

  async home(): Promise<HomeFeed> {
    const { data } = await apiClient.get<Envelope<HomeFeed>>('/blogs/featured');
    return data.data;
  },

  async bySlug(slug: string): Promise<BlogDetailResponse> {
    const { data } = await apiClient.get<Envelope<BlogDetailResponse>>(`/blogs/${slug}`);
    return data.data;
  },

  async byId(id: string): Promise<Blog> {
    const { data } = await apiClient.get<Envelope<Blog>>(`/blogs/by-id/${id}`);
    return data.data;
  },

  async categories(): Promise<CategoryInfo[]> {
    const { data } = await apiClient.get<Envelope<CategoryInfo[]>>('/categories');
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Blog> {
    const { data } = await apiClient.post<Envelope<Blog>>('/blogs', payload);
    return data.data;
  },

  async update(id: string, payload: Record<string, unknown>): Promise<Blog> {
    const { data } = await apiClient.put<Envelope<Blog>>(`/blogs/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const { data } = await apiClient.delete<Envelope<{ id: string }>>(`/blogs/${id}`);
    return data.data;
  },
};
