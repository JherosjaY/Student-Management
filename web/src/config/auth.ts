// Authentication Configuration

export const AUTH_CONFIG = {
  // Token storage keys
  storage: {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user_data',
  },
  
  // Token management
  tokens: {
    // Refresh token 5 minutes before expiry
    refreshThreshold: 5 * 60 * 1000, // 5 minutes in ms
    
    // Auto-logout after inactivity (in milliseconds)
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    
    // Maximum session duration
    maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
  },
  
  // Login form configuration
  login: {
    // Field validation
    validation: {
      email: {
        required: true,
        minLength: 5,
        maxLength: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      },
    },
    
    // Auto-remember settings
    rememberMe: {
      enabled: true,
      duration: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  
  // Role-based access control
  roles: {
    admin: 'ADMIN',
    teacher: 'TEACHER',
    student: 'STUDENT',
    parent: 'PARENT',
    staff: 'STAFF',
  },
  
  // Redirects after login/logout
  redirects: {
    loginSuccess: '/dashboard',
    loginFailure: '/login?error=true',
    logoutSuccess: '/login',
    unauthorized: '/unauthorized',
  },
} as const;

// Authentication helpers
export const getStoredToken = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setStoredToken = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const removeStoredToken = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearAuthTokens = (): void => {
  Object.values(AUTH_CONFIG.storage).forEach(key => {
    localStorage.removeItem(key);
  });
};