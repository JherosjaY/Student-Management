// Thrown by the api-client when the server returns a non-2xx response or when
// response validation fails. All UI error handling can switch on `code` for
// stable behaviour (e.g., toasts, retry hints) and inspect `statusCode` for
// HTTP-level decisions.
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;
  public readonly requestId: string | undefined;
 
  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: unknown = null,
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}
 
export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;
 
// Extract user-facing message from any thrown error. Falls back gracefully.
export const errorMessage = (err: unknown): string => {
  if (isApiError(err)) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred';
};
