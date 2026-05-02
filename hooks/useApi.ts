import { useState, useCallback } from 'react';

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export function useApi<T = any>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (overrideOptions?: UseApiOptions) => {
    setLoading(true);
    setError(null);

    try {
      const mergedOptions = { ...options, ...overrideOptions };
      const res = await fetch(url, {
        method: mergedOptions.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...mergedOptions.headers,
        },
        body: mergedOptions.body ? JSON.stringify(mergedOptions.body) : undefined,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'An error occurred');
        return null;
      }

      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, error, loading, execute };
}

