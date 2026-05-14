// UI Configuration

export const UI_CONFIG = {
  // Theme configuration
  theme: {
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark', 'auto'],
    storageKey: 'app_theme',
  },
  
  // Layout configuration
  layout: {
    defaultSidebarCollapsed: false,
    sidebarWidth: 280,
    sidebarCollapsedWidth: 80,
    headerHeight: 64,
    footerHeight: 48,
  },
  
  // Navigation
  navigation: {
    // Main navigation items
    mainMenu: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'],
      },
      {
        key: 'users',
        label: 'Users',
        path: '/users',
        icon: 'Users',
        roles: ['ADMIN'],
      },
      {
        key: 'students',
        label: 'Students',
        path: '/students',
        icon: 'GraduationCap',
        roles: ['ADMIN', 'TEACHER'],
      },
      {
        key: 'classes',
        label: 'Classes',
        path: '/classes',
        icon: 'BookOpen',
        roles: ['ADMIN', 'TEACHER', 'STUDENT'],
      },
      {
        key: 'attendance',
        label: 'Attendance',
        path: '/attendance',
        icon: 'CalendarCheck',
        roles: ['ADMIN', 'TEACHER'],
      },
      {
        key: 'subjects',
        label: 'Subjects',
        path: '/subjects',
        icon: 'Book',
        roles: ['ADMIN', 'TEACHER'],
      },
      {
        key: 'grades',
        label: 'Grades',
        path: '/grades',
        icon: 'BarChart3',
        roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      },
      {
        key: 'reports',
        label: 'Reports',
        path: '/reports',
        icon: 'FileText',
        roles: ['ADMIN', 'TEACHER'],
      },
      {
        key: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
        roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF'],
      },
    ],
    
    // User menu items
    userMenu: [
      {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: 'User',
      },
      {
        key: 'password',
        label: 'Change Password',
        path: '/change-password',
        icon: 'Lock',
      },
      {
        key: 'logout',
        label: 'Logout',
        path: '/logout',
        icon: 'LogOut',
        action: 'logout',
      },
    ],
  },
  
  // Date and time formatting
  dateTime: {
    dateFormat: 'MMMM dd, yyyy',
    timeFormat: 'hh:mm a',
    dateTimeFormat: 'MMMM dd, yyyy hh:mm a',
    timezone: 'Asia/Manila',
  },
  
  // Table configuration
  table: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    sortable: true,
    filterable: true,
  },
  
  // Notification configuration
  notifications: {
    position: 'top-right',
    duration: 5000,
    maxCount: 5,
    types: {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    },
  },
  
  // Form configuration
  forms: {
    validation: {
      showErrors: true,
      showErrorSummary: true,
      validateOnBlur: true,
    },
    submission: {
      showLoading: true,
      disableOnSubmit: true,
    },
  },
} as const;

// UI helpers
export const getTheme = (): string => {
  return localStorage.getItem(UI_CONFIG.theme.storageKey) || UI_CONFIG.theme.defaultTheme;
};

export const setTheme = (theme: string): void => {
  localStorage.setItem(UI_CONFIG.theme.storageKey, theme);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-PH', {
    ...UI_CONFIG.dateTime,
  }).format(date);
};