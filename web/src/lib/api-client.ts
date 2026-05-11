import { ZodType } from 'zod';

type QueryValue = string | number | boolean | undefined | null;

export interface RequestConfig<T> {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  schema?: ZodType<T>;        // required — validates the response
  skipAuth?: boolean;          // for /login, /refresh, /register
}

const BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = async <T>(config: RequestConfig<T>): Promise<T> => {
  const { path, method = 'GET', body, query, headers, schema } = config;

  let url = `${BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    url += `?${params.toString()}`;
  }

  const token = localStorage.getItem('token');
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token && !config.skipAuth) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
    signal: config.signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP Error ${response.status}`);
  }

  if (response.status === 24) return {} as T;

  const data = await response.json();
  
  if (schema) {
    return schema.parse(data);
  }

  return data as T;
};
