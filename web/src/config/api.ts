// API Configuration for School Management System

export const API_CONFIG = {
  // Base URL for API calls
  baseURL: 'http://localhost:3000/api/v1',
  
  // API Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      me: '/auth/me',
    },
    
    // Users
    users: {
      list: '/users',
      create: '/users',
      get: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
      changePassword: (id: string) => `/users/${id}/change-password`,
      addRole: (id: string) => `/users/${id}/roles`,
      removeRole: (id: string, roleName: string) => `/users/${id}/roles/${roleName}`,
    },
    
    // Health check
    health: '/health',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
  },
} as const;

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;