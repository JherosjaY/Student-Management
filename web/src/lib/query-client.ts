import { QueryClient } from '@tanstack/react-query';
import { isApiError } from './api-error';
 
// Sensible defaults for a school admin app:
// - 30s stale time avoids flickering refetches when navigating between pages
// - retry only on transient failures (network / 5xx); never retry 4xx (auth, validation)
// - mutations don't retry (idempotency keys would be needed first; coming Phase 5+)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isApiError(error)) {
          // Don't retry client errors (auth, validation, conflict, etc.).
          if (error.statusCode >= 400 && error.statusCode < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    mutations: {
      retry: false,
    },
  },
});
