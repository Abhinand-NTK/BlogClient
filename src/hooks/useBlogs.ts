import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { blogsApi } from '@/api/blogs';
import type { ListParams } from '@/types/blog';

export const blogKeys = {
  all: ['blogs'] as const,
  list: (params: ListParams) => ['blogs', 'list', params] as const,
  home: () => ['blogs', 'home'] as const,
  detail: (slug: string) => ['blogs', 'detail', slug] as const,
  categories: () => ['categories'] as const,
};

export function useBlogList(params: ListParams) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useHomeFeed() {
  return useQuery({
    queryKey: blogKeys.home(),
    queryFn: blogsApi.home,
    staleTime: 60_000,
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogsApi.bySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useBlogById(id?: string) {
  return useQuery({
    queryKey: ['blogs', 'by-id', id],
    queryFn: () => blogsApi.byId(id as string),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: blogsApi.categories,
    staleTime: 5 * 60_000,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => blogsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      blogsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}
