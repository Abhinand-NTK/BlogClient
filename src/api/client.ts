import axios, { AxiosError } from 'axios';

/** Centralised Axios instance. Base URL comes from the environment. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://blogcraft-api-wa2w.onrender.com',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

export interface ApiError {
  message: string;
  details?: { field: string; message: string }[];
  status?: number;
}

/** Normalise every failure into a predictable ApiError shape. */
export function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const data = err.response?.data as
      | { message?: string; details?: { field: string; message: string }[] }
      | undefined;
    return {
      message: data?.message ?? err.message ?? 'Something went wrong',
      details: data?.details,
      status: err.response?.status,
    };
  }
  return { message: 'Unexpected error' };
}

// Unwrap the { success, data, meta } envelope in interceptors for convenience.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);
