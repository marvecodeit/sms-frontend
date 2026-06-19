'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/hooks-auth';
import { Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils-helpers';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Detect if this is the student login route
  const isStudentLogin = pathname?.includes('student');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'super@sms.edu',
      password: isStudentLogin ? '' : 'SuperAdmin@123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    if (!isStudentLogin && (!data.password || data.password.length < 6)) {
      return toast.error('Password is required and must be at least 6 characters');
    }

    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (response) => {
          // Save remember me preference
          if (data.rememberMe) {
            localStorage.setItem('rememberEmail', data.email);
          } else {
            localStorage.removeItem('rememberEmail');
          }

          toast.success('Login successful!');
          reset();

          // Redirect based on role
          const role = response.user.role;
          const routes: Record<string, string> = {
            super_admin: '/dashboard/super-admin',
            school_admin: '/dashboard/school-admin',
            principal: '/dashboard/principal',
            vice_principal: '/dashboard/principal',
            secretary: '/dashboard/staff',
            instructor: '/dashboard/teacher',
            staff: '/dashboard/staff',
            student: '/dashboard/student',
            parent: '/dashboard/parent',
          };

          const redirectUrl = routes[role] || '/dashboard';
          router.push(redirectUrl);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Login failed. Please try again.';
          setServerError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          disabled={isPending}
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-colors',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            errors.email
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          )}
          placeholder="you@example.com"
        />
        {errors.email && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </div>
        )}
      </div>

      {/* Password Field */}
      {!isStudentLogin && (
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              disabled={isPending}
              className={cn(
                'w-full px-4 py-3 pr-12 rounded-lg border transition-colors',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                errors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.password.message}
            </div>
          )}
        </div>
      )}

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            {...register('rememberMe')}
            type="checkbox"
            disabled={isPending}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Remember me
          </span>
        </label>
        {!isStudentLogin && (
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-200">
                Login Failed
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {serverError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200',
          'bg-gradient-to-r from-blue-600 to-blue-700',
          'text-white shadow-lg hover:shadow-xl',
          'focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'flex items-center justify-center gap-2'
        )}
      >
        {isPending && <Loader className="w-5 h-5 animate-spin" />}
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Demo Credentials Info */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 text-sm">
          📝 Demo Credentials
        </h4>
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <p>
            <strong>Email:</strong> super@sms.edu
          </p>
          <p>
            <strong>Password:</strong> SuperAdmin@123
          </p>
          <p className="mt-2 text-blue-600 dark:text-blue-400">
            Other roles: admin@school.edu, teacher@school.edu, student@school.edu
          </p>
        </div>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
