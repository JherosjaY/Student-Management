// Main configuration export
export * from './api.js';
export * from './env.js';
export * from './auth.js';
export * from './ui.js';

// Re-export commonly used configurations
export { API_CONFIG, buildApiUrl, DEFAULT_HEADERS } from './api.js';
export { ENV_CONFIG, isDevelopment, isProduction, isTest } from './env.js';
export { AUTH_CONFIG, getStoredToken, setStoredToken, removeStoredToken, clearAuthTokens } from './auth.js';
export { UI_CONFIG, getTheme, setTheme, formatDateTime } from './ui.js';