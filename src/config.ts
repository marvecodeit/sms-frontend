// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Socket Configuration
export const SOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  RECONNECTION: true,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  RECONNECTION_ATTEMPTS: 5,
};

// Role Configuration
export const ROLE_CONFIG = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  PRINCIPAL: 'principal',
  VICE_PRINCIPAL: 'vice_principal',
  SECRETARY: 'secretary',
  INSTRUCTOR: 'instructor',
  STAFF: 'staff',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

// Role hierarchy (for permissions)
export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 9,
  school_admin: 8,
  principal: 7,
  vice_principal: 6,
  secretary: 5,
  instructor: 4,
  staff: 3,
  student: 2,
  parent: 1,
};

// Feature flags
export const FEATURES = {
  REAL_TIME: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === 'true',
  SOCKET: process.env.NEXT_PUBLIC_ENABLE_SOCKET === 'true',
  FILE_UPLOAD: true,
  EXCEL_IMPORT: true,
  CHAT: true,
  NOTIFICATIONS: true,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// File upload config
export const FILE_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif'],
};

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

// Cache configuration
export const CACHE_TIME = {
  INSTANT: 0,
  SHORT: 1 * TIME.MINUTE,
  MEDIUM: 5 * TIME.MINUTE,
  LONG: 10 * TIME.MINUTE,
  VERY_LONG: 1 * TIME.HOUR,
  INFINITE: 24 * TIME.HOUR,
};
