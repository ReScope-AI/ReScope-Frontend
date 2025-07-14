// src/lib/httpClient.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
  body?: any;
  auth?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

async function request<T = any>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, auth = true, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : Array.isArray(headers)
        ? Object.fromEntries(headers)
        : headers || {})
  };

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseURL}${url}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const http = {
  get: <T = any>(url: string, options?: RequestOptions) =>
    request<T>('GET', url, options),

  post: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>('POST', url, { ...options, body }),

  patch: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>('PATCH', url, { ...options, body }),

  put: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>('PUT', url, { ...options, body }),

  delete: <T = any>(url: string, options?: RequestOptions) =>
    request<T>('DELETE', url, options)
};
