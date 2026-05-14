// localStorage persistence for the refresh token only. The access token lives
// in memory (Zustand) so a tab close clears it; the refresh token survives
// reloads so the user stays logged in across sessions.
//
// Caveat: localStorage is XSS-reachable. The "right" home for a refresh token
// is an httpOnly cookie set by the backend, but that requires a backend
// change. Tracked as Phase-5 cleanup.
 
const REFRESH_TOKEN_KEY = 'school-mngt:refresh-token';
 
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
 
export const authStorage = {
  getRefreshToken: (): string | null => {
    if (!isBrowser) {
      return null;
    }
    try {
      return window.localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
 
  setRefreshToken: (token: string): void => {
    if (!isBrowser) {
      return;
    }
    try {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch {
      // Storage quota / disabled; degrade silently.
    }
  },
 
  clearRefreshToken: (): void => {
    if (!isBrowser) {
      return;
    }
    try {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
