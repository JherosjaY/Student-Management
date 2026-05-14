// Central registry for TanStack Query keys. Hierarchical so callers can
// invalidate at any granularity. Pattern follows TKDodo's effective-react-query
// guidance.
//
//   queryClient.invalidateQueries({ queryKey: usersKeys.all })       → all users data
//   queryClient.invalidateQueries({ queryKey: usersKeys.lists() })   → all list variants
//   queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) }) → just this user
 
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (query: Readonly<Record<string, unknown>>) => [...usersKeys.lists(), query] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
