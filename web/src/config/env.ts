// Environment Configuration

export const ENV_CONFIG = {
  // Environment mode
  mode: import.meta.env.MODE || 'development',
  
  // API Base URL (can be overridden by environment)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // Application info
  app: {
    name: 'School Management System',
    version: '1.0.0',
    description: 'Complete School Management Solution',
  },
  
  // Feature flags
  features: {
    enableMockData: false,
    enableDebugMode: true,
    enableAnalytics: false,
  },
  
  // Timeouts (in milliseconds)
  timeouts: {
    api: 10000,        // API request timeout
    session: 30 * 60 * 1000,  // 30 minutes
    notification: 5000,   // Auto-hide notifications
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // File upload limits
  upload: {
    maxFileSize: 5 * 1024 * 1024,  // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
} as const;

// Environment helpers
export const isDevelopment = ENV_CONFIG.mode === 'development';
export const isProduction = ENV_CONFIG.mode === 'production';
export const isTest = ENV_CONFIG.mode === 'test';