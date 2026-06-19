// Complete SMS Frontend Application Setup Guide
// This file contains all the code needed to build the frontend

// PHASE 1: Core Project Setup
// 1. Already done: package.json, tsconfig.json, tailwind.config.ts, next.config.ts
// 2. Already done: API client, auth store, UI store
// 3. Next: Create remaining core infrastructure

// PHASE 2: Component Structure
// All components follow this pattern:

// Example Button Component:
/*
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
*/

// PHASE 3: Auth Flow
/*
// 1. Login page
// - Email/Password form
// - Forgot password link
// - Role-based redirect

// 2. Registration pages (by role)
// - Super Admin only
// - School Admin via Super Admin
// - Staff/Students via School Admin
// - Parent self-registration

// 3. Password reset flow
// - Forgot password email
// - Reset password page
// - Change password settings

// 4. Protected routes
// - Route guards by role
// - Automatic redirects
// - Session validation
*/

// PHASE 4: Dashboard System
/*
// Each role has unique dashboard:

// Super Admin Dashboard:
// - Platform analytics
// - School management
// - Revenue tracking
// - User activity
// - System logs

// School Admin Dashboard:
// - School analytics
// - Staff management
// - Student management
// - Academic tracking
// - Fee tracking

// Principal Dashboard:
// - School overview
// - Staff list
// - Student performance
// - Announcements
// - Calendar

// Teacher Dashboard:
// - My classes
// - Student list
// - Results upload
// - Attendance
// - Assignments

// Student Dashboard:
// - My results
// - Attendance
// - Timetable
// - Announcements
// - Messages
*/

// PHASE 5: Student Management
/*
// Features:
// - Student registration form
// - Profile management
// - Document upload
// - Attendance tracking
// - Behavior reports
// - ID card generation

// Email generation system:
// Format: firstName + registrationNumber + classAbbr @ school.edu
// Example: john2026ss1@schoolname.edu

// Auto-generation logic:
// - Extract first name
// - Add registration year
// - Add class abbreviation
// - Validate uniqueness
// - Allow editing before save
*/

// PHASE 6: Results & Academic
/*
// Features:
// - Excel upload (drag-drop)
// - Result table display
// - Grade assignment
// - Report card generation
// - Transcript pages
// - Analytics charts

// Excel format:
// - Column: Student ID/Registration No
// - Column: Subject Name
// - Column: Score
// - Auto-compute Grade from score
// - Validate before upload
*/

// PHASE 7: Real-time Features (Socket.IO)
/*
// Events:
// - new_result_uploaded
// - new_assignment
// - class_announcement
// - attendance_marked
// - message_received
// - user_online/offline
// - typing_indicator

// Implementation:
// - Connect on app load
// - Reconnect on disconnect
// - Queue offline messages
// - Update UI in real-time
*/

// PHASE 8: Messaging System
/*
// Features:
// - Direct messages
// - Group chats
// - School announcements
// - Read receipts
// - Typing indicators
// - File sharing
// - Online status

// Components:
// - Chat list
// - Chat window
// - Message input
// - File upload in chat
*/

// BUILD INSTRUCTIONS:
/*
1. Install dependencies:
   npm install

2. Setup environment:
   cp .env.example .env.local

3. Create directory structure:
   mkdir -p src/{app,components/{ui,layout,forms},features,hooks,lib,services,stores,types,utils,config}

4. Copy configuration files:
   - tsconfig.json ✓
   - tailwind.config.ts ✓
   - next.config.ts ✓
   - postcss.config.ts ✓

5. Create core services:
   - API client (apiClient.ts) ✓
   - Socket service
   - Auth service
   - Query hooks

6. Create layouts:
   - Root layout
   - Auth layout
   - Dashboard layout with sidebar

7. Create auth pages:
   - Login page
   - Forgot password
   - Reset password
   - OTP verification

8. Create dashboards for each role

9. Create feature modules:
   - Student management
   - Staff management
   - Results portal
   - Chat system

10. Start dev server:
    npm run dev
*/

// FOLDER STRUCTURE:
/*
frontend/
├── public/
│   ├── logo.svg
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── otp-verify/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── super-admin/page.tsx
│   │   │   ├── school-admin/page.tsx
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── staff/page.tsx
│   │   │   ├── results/page.tsx
│   │   │   ├── chat/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   └── (API routes if using Next.js API)
│   │   └── error.tsx, not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── top-nav.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── footer.tsx
│   │   ├── forms/
│   │   │   ├── login-form.tsx
│   │   │   ├── student-form.tsx
│   │   │   ├── staff-form.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── components/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── staff/
│   │   ├── results/
│   │   ├── chat/
│   │   └── notifications/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useQuery.ts
│   │   ├── useSocket.ts
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   └── ...
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── staff.ts
│   │   │   ├── results.ts
│   │   │   └── ...
│   │   └── socket/
│   │       ├── client.ts
│   │       └── handlers.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── ui.ts
│   │   └── ...
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── file-upload.ts
│   │   ├── excel-parser.ts
│   │   ├── date-formatter.ts
│   │   └── ...
│   ├── config/
│   │   └── index.ts
│   ├── globals.css
│   ├── providers.tsx
│   ├── api-client.ts
│   └── ...
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
*/

export default {};
