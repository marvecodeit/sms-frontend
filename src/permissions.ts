/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines permissions for each role
 */

export const PERMISSIONS = {
  // Super Admin
  'super_admin:manage_schools': 'Manage all schools',
  'super_admin:manage_users': 'Manage all users',
  'super_admin:view_analytics': 'View platform analytics',
  'super_admin:manage_subscription': 'Manage subscriptions',
  'super_admin:manage_support': 'Manage support tickets',

  // School Admin
  'school_admin:manage_staff': 'Manage school staff',
  'school_admin:manage_students': 'Manage school students',
  'school_admin:manage_classes': 'Manage classes',
  'school_admin:manage_academics': 'Manage academic settings',
  'school_admin:manage_fees': 'Manage fees',
  'school_admin:view_reports': 'View school reports',

  // Principal
  'principal:manage_staff': 'Manage staff',
  'principal:manage_students': 'Manage students',
  'principal:manage_classes': 'Manage classes',
  'principal:manage_timetable': 'Manage timetable',
  'principal:manage_results': 'Manage results',
  'principal:make_announcements': 'Make announcements',

  // Vice Principal
  'vice_principal:manage_classes': 'Manage classes',
  'vice_principal:manage_results': 'Manage results',
  'vice_principal:manage_attendance': 'Manage attendance',
  'vice_principal:manage_assignments': 'Manage assignments',

  // Secretary
  'secretary:manage_students': 'Manage students',
  'secretary:manage_records': 'Manage records',
  'secretary:create_reports': 'Create reports',
  'secretary:manage_documents': 'Manage documents',

  // Instructor/Teacher
  'instructor:manage_classes': 'Manage classes',
  'instructor:manage_attendance': 'Manage attendance',
  'instructor:upload_results': 'Upload results',
  'instructor:manage_assignments': 'Manage assignments',
  'instructor:communicate_students': 'Communicate with students',

  // Staff
  'staff:view_students': 'View students',
  'staff:view_classes': 'View classes',
  'staff:manage_attendance': 'Manage attendance',

  // Student
  'student:view_results': 'View results',
  'student:view_classes': 'View classes',
  'student:view_attendance': 'View attendance',
  'student:submit_assignments': 'Submit assignments',
  'student:communicate_teacher': 'Communicate with teacher',

  // Parent
  'parent:view_child_results': 'View child results',
  'parent:view_child_attendance': 'View child attendance',
  'parent:communicate_teacher': 'Communicate with teacher',
  'parent:view_announcements': 'View announcements',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'super_admin:manage_schools',
    'super_admin:manage_users',
    'super_admin:view_analytics',
    'super_admin:manage_subscription',
    'super_admin:manage_support',
  ],

  school_admin: [
    'school_admin:manage_staff',
    'school_admin:manage_students',
    'school_admin:manage_classes',
    'school_admin:manage_academics',
    'school_admin:manage_fees',
    'school_admin:view_reports',
  ],

  principal: [
    'principal:manage_staff',
    'principal:manage_students',
    'principal:manage_classes',
    'principal:manage_timetable',
    'principal:manage_results',
    'principal:make_announcements',
  ],

  vice_principal: [
    'vice_principal:manage_classes',
    'vice_principal:manage_results',
    'vice_principal:manage_attendance',
    'vice_principal:manage_assignments',
  ],

  secretary: [
    'secretary:manage_students',
    'secretary:manage_records',
    'secretary:create_reports',
    'secretary:manage_documents',
  ],

  instructor: [
    'instructor:manage_classes',
    'instructor:manage_attendance',
    'instructor:upload_results',
    'instructor:manage_assignments',
    'instructor:communicate_students',
  ],

  staff: [
    'staff:view_students',
    'staff:view_classes',
    'staff:manage_attendance',
  ],

  student: [
    'student:view_results',
    'student:view_classes',
    'student:view_attendance',
    'student:submit_assignments',
    'student:communicate_teacher',
  ],

  parent: [
    'parent:view_child_results',
    'parent:view_child_attendance',
    'parent:communicate_teacher',
    'parent:view_announcements',
  ],
};

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role has permission
 */
export function hasPermission(role: string, permission: string): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const names: Record<string, string> = {
    super_admin: 'Super Admin',
    school_admin: 'School Admin',
    principal: 'Principal',
    vice_principal: 'Vice Principal',
    secretary: 'Secretary',
    instructor: 'Instructor',
    staff: 'Staff',
    student: 'Student',
    parent: 'Parent',
  };
  return names[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    super_admin: 'Manages the entire platform',
    school_admin: 'Manages school operations',
    principal: 'Manages academic and administrative functions',
    vice_principal: 'Assists principal with academic matters',
    secretary: 'Handles administrative tasks',
    instructor: 'Teaches classes and manages students',
    staff: 'Provides support services',
    student: 'Accesses learning materials',
    parent: 'Views child progress',
  };
  return descriptions[role] || '';
}

/**
 * Get role color
 */
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800',
    school_admin: 'bg-blue-100 text-blue-800',
    principal: 'bg-purple-100 text-purple-800',
    vice_principal: 'bg-indigo-100 text-indigo-800',
    secretary: 'bg-pink-100 text-pink-800',
    instructor: 'bg-green-100 text-green-800',
    staff: 'bg-yellow-100 text-yellow-800',
    student: 'bg-cyan-100 text-cyan-800',
    parent: 'bg-orange-100 text-orange-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}

/**
 * Get dashboard route for role
 */
export function getDashboardRoute(role: string): string {
  const routes: Record<string, string> = {
    super_admin: '/super-admin',
    school_admin: '/school-admin',
    principal: '/principal',
    vice_principal: '/vice-principal',
    secretary: '/secretary',
    instructor: '/instructor',
    staff: '/staff',
    student: '/student',
    parent: '/parent',
  };
  return routes[role] || '/dashboard';
}

/**
 * Roles that can approve new users
 */
export const APPROVAL_ROLES = [
  'super_admin',
  'school_admin',
  'principal',
];

/**
 * Roles that can upload results
 */
export const RESULT_UPLOAD_ROLES = [
  'super_admin',
  'school_admin',
  'principal',
  'vice_principal',
  'instructor',
];

/**
 * Roles that can view all students
 */
export const VIEW_ALL_STUDENTS_ROLES = [
  'super_admin',
  'school_admin',
  'principal',
  'vice_principal',
  'secretary',
  'instructor',
];

/**
 * Roles that can manage staff
 */
export const MANAGE_STAFF_ROLES = [
  'super_admin',
  'school_admin',
  'principal',
];

/**
 * Roles that can make announcements
 */
export const ANNOUNCEMENT_ROLES = [
  'super_admin',
  'school_admin',
  'principal',
];

/**
 * Permission matrix for quick reference
 * This helps understand who can do what
 */
export const PERMISSION_MATRIX = {
  'Manage Schools': ['super_admin'],
  'Manage Users': ['super_admin', 'school_admin'],
  'Manage Staff': ['super_admin', 'school_admin', 'principal'],
  'Manage Students': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'secretary',
  ],
  'Manage Classes': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'instructor',
  ],
  'Manage Attendance': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'instructor',
    'staff',
  ],
  'Upload Results': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'instructor',
  ],
  'View Results': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'secretary',
    'instructor',
    'student',
    'parent',
  ],
  'Manage Assignments': [
    'super_admin',
    'school_admin',
    'principal',
    'vice_principal',
    'instructor',
  ],
  'Make Announcements': ['super_admin', 'school_admin', 'principal'],
  'View Analytics': ['super_admin', 'school_admin', 'principal'],
};
