import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services-auth';
import { useAuthStore } from '@/stores-auth';
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for login
 */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setError = useAuthStore((state) => state.setError);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      setError(null);
      return authService.login({ email, password });
    },
    onSuccess: (data) => {
      const { user, token, refreshToken } = data;
      const userData = { ...user, token };

      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      toast.success('Login successful!');
      setLoading(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      queryClient.clear();
      window.location.href = '/auth/login';
    }
  }, [logout, queryClient]);
}

/**
 * Hook for current user
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    initialData: user || undefined,
    enabled: !!localStorage.getItem('token'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to send reset link';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for verify OTP
 */
export function useVerifyOTP() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyOTP({ email, otp }),
    onSuccess: () => {
      toast.success('OTP verified successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to check if user has role
 */
export function useHasRole(roles: string | string[]) {
  const hasRole = useAuthStore((state) => state.hasRole);
  return hasRole(roles as any);
}

/**
 * Hook to check if user has permission
 */
export function useHasPermission(permission: string) {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  return hasPermission(permission);
}

/**
 * Hook for auth state
 */
export function useAuth() {
  return useAuthStore();
}

/**
 * Hook for auth required pages
 */
export function useAuthRequired() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    isLoading: !user && isAuthenticated,
  };
}
