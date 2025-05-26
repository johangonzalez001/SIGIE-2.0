import { ApiResponse } from '../types';

export const api = {
  async get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },

  async post<T>(url: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async put<T>(url: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async delete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
};

async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();
  return data;
}