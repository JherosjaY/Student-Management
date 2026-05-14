// Cross-cutting API types shared by all features.
 
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
 
// Shape returned by the backend's global error handler.
// See api/src/shared/middleware/error-handler.ts.
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
    stack?: string;
  };
}
 
export type SortOrder = 'asc' | 'desc';
