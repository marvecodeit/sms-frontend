# Quick Reference Card - SMS Frontend

## 🚀 Getting Started (2 minutes)

```bash
cd frontend
npm install
npm run init-project
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

## 📂 Key File Locations

| Purpose | Location |
|---------|----------|
| Configuration | `config.ts` |
| TypeScript Types | `types.ts` |
| API Client | `api-client.ts` |
| Authentication Store | `stores-auth.ts` |
| UI Store | `stores-ui.ts` |
| Helper Functions | `utils-helpers.ts` |
| Excel Utilities | `utils-excel.ts` |
| Permissions Matrix | `permissions.ts` |
| Mock Data | `constants.ts` |
| Auth Service | `services-auth.ts` |
| Student Service | `services-students.ts` |
| Auth Hooks | `hooks-auth.ts` |

## 🔐 Common Hooks

```typescript
// Authentication
import { useLogin, useLogout, useCurrentUser } from '@/hooks-auth';
import { useAuth, useHasRole, useHasPermission } from '@/hooks-auth';

// Usage
const { mutate: login } = useLogin();
const logout = useLogout();
const { user } = useCurrentUser();
const { user: authUser } = useAuth();

if (useHasRole('admin')) {
  // Only admin sees this
}
```

## 🛠️ Common Patterns

### Create New Service
```typescript
// src/services-api/featureName.ts
import apiClient from '@/api-client';

export const featureService = {
  getAll: () => apiClient.get('/feature'),
  getById: (id) => apiClient.get(`/feature/${id}`),
  create: (data) => apiClient.post('/feature', data),
  update: (id, data) => apiClient.put(`/feature/${id}`, data),
  delete: (id) => apiClient.delete(`/feature/${id}`),
};
```

### Create New Hook
```typescript
// src/features/feature/hooks/useFeature.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { featureService } from '@/services-api/featureName';

export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => featureService.getAll(),
  });
}
```

### Use in Component
```typescript
'use client';

import { useFeatures } from '@/features/feature/hooks/useFeature';

export function MyComponent() {
  const { data: features, isLoading } = useFeatures();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {features?.map(f => (
        <div key={f.id}>{f.name}</div>
      ))}
    </div>
  );
}
```

## 📊 State Management

### Zustand Store
```typescript
import { create } from 'zustand';

interface State {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Use in component
const count = useStore((state) => state.count);
```

## 📝 Form Handling

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🎨 Styling with Tailwind

```jsx
// Responsive
<div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3">

// Colors
<div className="bg-blue-500 text-white">

// Spacing
<div className="p-4 m-2 gap-4">

// Dark mode
<div className="dark:bg-slate-900 dark:text-white">

// Hover effects
<button className="hover:bg-blue-600 transition-colors">
```

## 🔍 Debugging

```typescript
// Console logging
console.log('Debug:', data);

// React DevTools
// Install React DevTools browser extension

// Zustand DevTools
// Available in Redux DevTools browser extension

// React Query DevTools
// Built into the query provider

// Next.js DevTools
// F12 -> Network tab for API calls
```

## 📦 Commands Reference

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Production build
npm start              # Start production server

# Code Quality
npm run lint           # ESLint check
npm run type-check     # TypeScript check

# Project Setup
npm run init-project   # Create directory structure

# Utilities
npm install            # Install dependencies
npm update            # Update packages
npm audit             # Check for vulnerabilities
```

## 🔑 Environment Variables

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Optional
NEXT_PUBLIC_APP_NAME="School Management System"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_SOCKET=true
```

## 🧠 Remember

✅ Always use TypeScript types
✅ Use Tailwind CSS for styling
✅ Use React Query for server state
✅ Use Zustand for client state
✅ Check permissions before rendering
✅ Handle loading states
✅ Handle error states
✅ Use environment variables for config
✅ Follow the existing patterns
✅ Write comments for complex logic

## 🚨 Common Mistakes

❌ Don't use inline styles
❌ Don't forget error handling
❌ Don't make API calls in render
❌ Don't ignore TypeScript warnings
❌ Don't forget to invalidate queries
❌ Don't hardcode values
❌ Don't commit .env.local
❌ Don't use wrong hook names

## 📚 Documentation Links

- **Full Setup**: SETUP_GUIDE.md
- **Build Roadmap**: BUILD_INSTRUCTIONS.md
- **Implementation**: IMPLEMENTATION_GUIDE.ts
- **Status**: PROJECT_STATUS.md
- **Delivery**: DELIVERY_SUMMARY.md

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| API not connecting | Check `.env.local` NEXT_PUBLIC_API_URL |
| TypeScript error | Run `npm run type-check` |
| Styles not applying | Restart dev server |
| Import not found | Check file path and extension |
| Button not working | Check if component is marked 'use client' |
| No results | Check permissions with `useHasPermission()` |

---

**Bookmark this page for quick reference!**
