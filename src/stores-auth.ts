import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser, UserRole } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user: AuthUser) =>
          set({ user, isAuthenticated: true, token: user.token }),

        setToken: (token: string) =>
          set({ token, isAuthenticated: true }),

        setLoading: (isLoading: boolean) => set({ isLoading }),

        setError: (error: string | null) => set({ error }),

        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          }),

        hasRole: (roles: UserRole | UserRole[]) => {
          const { user } = get();
          if (!user) return false;

          const roleArray = Array.isArray(roles) ? roles : [roles];
          return roleArray.includes(user.role);
        },

        hasPermission: (permission: string) => {
          const { user } = get();
          if (!user) return false;

          // Permission logic based on role
          const permissions: Record<UserRole, string[]> = {
            super_admin: ['*'],
            school_admin: ['manage_school', 'manage_staff', 'manage_students', 'view_results'],
            principal: ['manage_staff', 'manage_students', 'view_results', 'manage_classes'],
            vice_principal: ['manage_students', 'view_results', 'manage_classes'],
            secretary: ['manage_students', 'view_results'],
            instructor: ['manage_classes', 'upload_results', 'view_students'],
            staff: ['view_students'],
            student: ['view_results', 'view_classes'],
            parent: ['view_student_results'],
          };

          const userPermissions = permissions[user.role] || [];
          return userPermissions.includes('*') || userPermissions.includes(permission);
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
      }
    )
  )
);
