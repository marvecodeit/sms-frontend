import apiClient from '@/api-client';
import type { AuthUser, ApiResponse } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  schoolId?: string;
}

interface ResetPasswordRequest {
  email: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      data
    );
    return response.data.data!;
  }

  async register(data: RegisterRequest): Promise<AuthUser> {
    const response = await apiClient.post<ApiResponse<AuthUser>>(
      '/auth/register',
      data
    );
    return response.data.data!;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return response.data.data!;
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<{ token: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/verify-otp',
      data
    );
    return response.data.data!;
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, newPassword }
    );
    return response.data.data!;
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      data
    );
    return response.data.data!;
  }

  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data!;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(
      '/auth/me'
    );
    return response.data.data!;
  }
}

export const authService = new AuthService();
