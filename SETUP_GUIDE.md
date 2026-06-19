# SMS Frontend - Complete Setup Guide

## Quick Start

```bash
# 1. Initialize project structure
npm run init-project

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Start development
npm run dev
```

## Project Structure Overview

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   └── forms/             # Form components
├── features/              # Feature modules
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
├── services/              # API & Socket services
├── stores/                # Zustand state stores
├── types/                 # TypeScript types
└── config/                # Configuration
```

## Core Files Created

✅ **Configuration**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS config
- `next.config.ts` - Next.js configuration
- `postcss.config.ts` - PostCSS setup
- `.env.example` - Environment template

✅ **Core Services**
- `api-client.ts` - Axios instance with interceptors
- `stores-auth.ts` - Authentication state
- `stores-ui.ts` - UI state management
- `config.ts` - App configuration
- `types.ts` - TypeScript interfaces
- `providers.tsx` - React providers
- `globals.css` - Global styles

✅ **Documentation**
- `README.md` - Project overview
- `IMPLEMENTATION_GUIDE.ts` - Detailed guide
- `SETUP.sh` - Shell setup script
- `init-project.js` - Node.js initialization

## What's Next

### Phase 1: Create Remaining Core Files
1. Create `src/app/layout.tsx` - Root layout
2. Create `src/app/page.tsx` - Landing page
3. Create error boundaries and loading states

### Phase 2: Authentication System
1. Auth context and hooks
2. Login/Register/Reset password pages
3. Protected route wrapper
4. Session management

### Phase 3: UI Components Library
Use Shadcn UI pattern or create custom components for:
- Button, Input, Select, Textarea
- Card, Modal, Dialog, Drawer
- Table, Tabs, Badge, Skeleton
- Toast notifications
- Alerts and confirmations

### Phase 4: Dashboard Templates
Create layouts for each role:
- Super Admin Dashboard
- School Admin Dashboard
- Principal Dashboard
- Teacher Dashboard
- Student Dashboard

### Phase 5: Feature Modules
- Student Management
- Staff Management
- Results Portal
- Chat System
- Notifications
- File Management

## Role-Based Permissions

```
Super Admin:
- All permissions
- Platform management
- Multi-school oversight

School Admin:
- manage_school
- manage_staff
- manage_students
- view_results
- manage_academics

Principal:
- manage_staff
- manage_students
- view_results
- manage_classes
- manage_timetable

Vice Principal:
- manage_students
- view_results
- manage_classes

Secretary:
- manage_students
- view_results
- create_reports

Instructor/Teacher:
- manage_classes
- upload_results
- view_students
- manage_assignments

Staff:
- view_students
- view_staff

Student:
- view_results
- view_classes
- submit_assignments

Parent:
- view_student_results
- view_attendance
- message_teacher
```

## API Integration Points

Backend should provide these endpoints:

```
Authentication:
POST /api/auth/login
POST /api/auth/register
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/verify-otp

Users:
GET /api/users/me
PUT /api/users/me
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Schools:
GET /api/schools
POST /api/schools
PUT /api/schools/:id
GET /api/schools/:id/stats

Students:
GET /api/students
POST /api/students
GET /api/students/:id
PUT /api/students/:id
GET /api/students/:id/results
GET /api/students/:id/attendance

Results:
POST /api/results/upload
GET /api/results
GET /api/results/:id
GET /api/results/:studentId

Staff:
GET /api/staff
POST /api/staff
GET /api/staff/:id

Chat:
GET /api/messages
POST /api/messages
GET /api/groups
POST /api/groups

Notifications:
GET /api/notifications
POST /api/notifications
PUT /api/notifications/:id/read
```

## Socket.IO Events

```
Client -> Server:
- user:online
- user:offline
- message:send
- message:read
- typing:start
- typing:stop

Server -> Client:
- message:received
- notification:new
- result:uploaded
- attendance:marked
- user:online
- user:offline
- typing:indicator
```

## Development Workflow

1. **Create new page**
   ```bash
   # Create app/(dashboard)/students/page.tsx
   # Add route to sidebar navigation
   # Create feature module in src/features/students
   ```

2. **Create new component**
   ```bash
   # Base UI: src/components/ui/ComponentName.tsx
   # Feature-specific: src/features/feature/components/ComponentName.tsx
   # Layout: src/components/layout/ComponentName.tsx
   ```

3. **Create new API service**
   ```bash
   # Add to src/services/api/serviceNamets
   # Create hook in src/features/feature/hooks
   # Use in component with React Query
   ```

4. **Add new store**
   ```bash
   # Create in src/stores/storeName.ts
   # Use Zustand with devtools
   # Import in components with hook
   ```

## Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_NAME="School Management System"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_SOCKET=true

# Authentication
NEXT_PUBLIC_AUTH_PROVIDER=jwt
```

## Common Tasks

### Add a new role
1. Update `UserRole` type in `types.ts`
2. Add role in `ROLE_CONFIG` in `config.ts`
3. Add role in hierarchy and permissions
4. Create dashboard page for role
5. Update sidebar navigation

### Add new API endpoint
1. Create service in `services/api/`
2. Create query hook in `features/feature/hooks`
3. Use `useQuery` or `useMutation`
4. Add to component

### Create protected page
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['principal', 'school_admin']}>
      {/* Page content */}
    </ProtectedRoute>
  );
}
```

### Add Socket.IO event
```tsx
import { useSocket } from '@/hooks/useSocket';

export function MyComponent() {
  const socket = useSocket();

  useEffect(() => {
    socket?.on('event:name', (data) => {
      // Handle event
    });

    return () => socket?.off('event:name');
  }, [socket]);
}
```

## Performance Optimization

- Code splitting with `dynamic()` imports
- Image optimization with Next.js `Image`
- API caching with React Query
- CSS-in-JS performance with Tailwind
- Lighthouse optimization
- SEO with next/head

## Testing

Recommended tools:
- Jest for unit tests
- React Testing Library for components
- Cypress for E2E tests

## Deployment

Built-in support for:
- Vercel (recommended for Next.js)
- Docker
- Traditional Node.js servers
- Static export

## Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**Happy coding! 🚀**
