'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/stores-auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Initialize auth from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        initAuth({ ...userData, token });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="system"
          expand
          visibleToasts={5}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
