import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  notificationCount: number;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
  setNotificationCount: (count: number) => void;
  incrementNotificationCount: () => void;
  decrementNotificationCount: () => void;
  resetNotificationCount: () => void;
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    sidebarOpen: true,
    theme: 'system',
    notifications: true,
    notificationCount: 0,

    toggleSidebar: () =>
      set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

    setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),

    setNotifications: (enabled: boolean) => set({ notifications: enabled }),

    setNotificationCount: (count: number) => set({ notificationCount: count }),

    incrementNotificationCount: () =>
      set((state) => ({ notificationCount: state.notificationCount + 1 })),

    decrementNotificationCount: () =>
      set((state) => ({
        notificationCount: Math.max(0, state.notificationCount - 1),
      })),

    resetNotificationCount: () => set({ notificationCount: 0 }),
  }))
);
