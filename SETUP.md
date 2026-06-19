# 🚀 Frontend Setup Guide

## Phase 1-2 ✅ COMPLETE

### What's Been Built

#### ✅ Infrastructure (Phase 1)
- [x] **Vite React.js Project** - Fast build tool, modern HMR
- [x] **Tailwind CSS** - Utility-first styling
- [x] **Axios Configuration** - Base URL, JWT injection, 401 handling
- [x] **React Router v6** - 7 routes configured
- [x] **Package.json** - All dependencies configured (React Router, Axios, Toastify, React Icons)

#### ✅ Authentication System (Phase 2)
- [x] **AuthContext.jsx** - Full auth state management
  - 5 login methods (developer, admin, principal, teacher, student)
  - Token storage in localStorage
  - Role checks (isDeveloper, isAdmin, etc.)
  - Logout with cleanup

- [x] **Login Pages** - Beautiful UI for all 5 roles
  - Email/password form
  - Password visibility toggle
  - Loading states
  - Error messages
  - Back to role selection button

- [x] **Protected Routes** - Role-based access control
  - ProtectedRoute wrapper
  - Auto-redirect to login if not authenticated
  - Auto-redirect if wrong role
  - Loading spinner while checking auth

#### ✅ Layouts & Navigation (Phase 3)
- [x] **MainLayout.jsx** - Dashboard layout wrapper
  - Responsive sidebar (collapsible on mobile)
  - Top navbar with user info
  - Logout button
  - Role-based menu items

- [x] **Sidebar** - Collapsible navigation
  - Collapse/expand toggle
  - Role-specific menu
  - Hamburger icon on mobile

- [x] **Navbar** - Top navigation bar
  - User name/role display
  - Logout button
  - Responsive design

#### ✅ Dashboard Pages (Phase 4)
- [x] **Developer Dashboard** - Stats & admin management
- [x] **Admin Dashboard** - Stats & management buttons
- [x] **Principal Dashboard** - Student & result management
- [x] **Teacher Dashboard** - Results & assignment buttons
- [x] **Student Dashboard** - Results & learning resources

---

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- react, react-dom
- react-router-dom
- axios
- tailwindcss
- react-toastify
- react-icons
- All development dependencies

### 2. Environment Setup

The `.env` file is already created with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Management System
VITE_APP_URL=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

Output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### 4. Open in Browser

Navigate to: **http://localhost:5173**

---

## 📱 Testing the Frontend

### 1. Landing Page
- URL: `http://localhost:5173`
- Shows 5 role buttons
- Click any role to go to login page

### 2. Login Pages
- URL: `http://localhost:5173/login/developer` (or admin/principal/teacher/student)
- Beautiful gradient background matching role color
- Email/password form
- Back button to landing page

### 3. Dashboards (After Login)
- Will redirect to role-specific dashboard
- Shows sidebar and navbar
- Displays statistics cards
- Quick action buttons
- Responsive on mobile

### 4. Test Data Required
Backend needs to provide test login credentials. The API expects:

```json
POST /auth/developer/login
{
  "email": "developer@school.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "developer": {
    "id": "...",
    "email": "developer@school.com",
    "name": "Developer",
    "role": "developer"
  }
}
```

---

## 🔗 API Integration Checklist

### Authentication Endpoints
These need to be working on backend:

```
POST /auth/developer/login
POST /auth/admin/login
POST /auth/principal/login
POST /auth/teacher/login
POST /auth/student/login
```

**Expected Response:**
```json
{
  "token": "JWT_TOKEN_HERE",
  "developer|admin|principal|teacher|student": {
    "id": "user_id",
    "email": "email@school.com",
    "name": "User Name",
    "role": "developer|admin|..."
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

## 📁 Key Files Explained

### Core Configuration
```
src/api/axios.js           - Axios setup with interceptors
src/context/AuthContext.jsx - Authentication state
src/routes/index.jsx       - Router configuration
src/layouts/MainLayout.jsx - Dashboard layout
```

### Pages
```
src/pages/LandingPage.jsx              - Role selection
src/pages/auth/LoginPage.jsx           - Login forms (all roles)
src/pages/developer/Dashboard.jsx      - Developer dashboard
src/pages/PrincipalDashboard.jsx       - Principal dashboard
src/pages/TeacherDashboard.jsx         - Teacher dashboard
src/pages/StudentDashboard.jsx         - Student dashboard
```

### App Entry
```
src/main.jsx  - Entry point (React 18)
src/App.jsx   - Root component with ToastContainer
src/index.css - Global styles with Tailwind
```

---

## 🎨 UI Components Available

### Tailwind Utility Classes
```jsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-danger">Delete</button>

// Input
<input className="input-field" />

// Cards
<div className="card p-6">Content</div>

// Grid/Responsive
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

### React Icons
```jsx
import { FiEye, FiEyeOff, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
<FiEye size={20} />
```

### Toast Notifications
```jsx
import { toast } from 'react-toastify';
toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
```

---

## 🔐 Authentication Flow

### 1. User Visits Landing Page
```
/ → Shows 5 role buttons
```

### 2. User Clicks Role Button
```
/ → /login/developer (or admin/principal/teacher/student)
```

### 3. User Enters Credentials & Submits
```
Form → API /auth/developer/login → Response with token
```

### 4. Token Stored & User Logged In
```
localStorage: {
  "auth_token": "JWT_TOKEN",
  "user": { id, email, name, role }
}
```

### 5. Auto-Redirect to Dashboard
```
/login/developer → /developer/dashboard
```

### 6. Dashboard Loads with Auth Guard
```
ProtectedRoute checks:
✓ Token exists?
✓ User data exists?
✓ Role matches route?
→ If all ok, show dashboard
```

### 7. Logout
```
Click logout → Clear localStorage → Redirect to /
```

---

## 🚦 Next Steps (Phases 5+)

### Immediate (To Make it Functional)
- [ ] Test login with backend
- [ ] Implement remaining 4 dashboards
- [ ] Build class management forms
- [ ] Build student creation/assignment

### Core Features
- [ ] Excel upload for results
- [ ] Result approval workflow
- [ ] Assignment upload/view
- [ ] Attendance marking
- [ ] Report card download
- [ ] Broadsheet generation

### Polish
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states on buttons
- [ ] Responsive design refinements
- [ ] Dark mode (optional)
- [ ] Charts & analytics (optional)

---

## 🧪 Testing Checklist

### Phase 1-2 Testing
- [ ] Landing page loads with 5 role buttons
- [ ] Each role button navigates to correct login page
- [ ] Login form validates required fields
- [ ] Submitting form (without backend) shows API error
- [ ] Back button works
- [ ] Browser refresh keeps authentication
- [ ] Logout clears data
- [ ] Sidebar collapses on mobile
- [ ] Theme colors are correct for each role

### Phase 5+ Testing
- [ ] All API endpoints return expected data
- [ ] File uploads work with progress
- [ ] Forms validate before submission
- [ ] Error messages display correctly
- [ ] Loading states prevent double-click
- [ ] Responsive design works on all screen sizes

---

## 📊 Architecture Overview

```
Browser
  ↓
React App (Vite)
  ├─ App.jsx (ToastContainer)
  ├─ AuthProvider (Context)
  └─ Router
      ├─ Public Routes
      │  ├─ / (Landing)
      │  └─ /login/:role (Login)
      └─ Protected Routes
         ├─ /developer/dashboard
         ├─ /admin/dashboard
         ├─ /principal/dashboard
         ├─ /teacher/dashboard
         └─ /student/dashboard
             ↓
          MainLayout (Sidebar + Navbar)
             ↓
          Dashboard Content

Axios Interceptors
  ├─ Request: Inject Bearer token
  └─ Response: Handle 401 → Logout
```

---

## 💡 Pro Tips

### Add New Page
1. Create file in `src/pages/yourpage.jsx`
2. Import in `src/routes/index.jsx`
3. Add route:
```jsx
<Route path="/your/route" element={<YourPage />} />
```

### Use Auth in Component
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <p>Not logged in</p>;
  
  return <p>Hello {user.name}</p>;
}
```

### Make API Call
```jsx
import apiClient from '../api/axios';

const response = await apiClient.get('/endpoint');
const data = response.data;
```

### Show Toast
```jsx
import { toast } from 'react-toastify';

toast.success('Operation successful!');
toast.error('Something went wrong');
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Port 5173 in use | Another app using port | Change in `vite.config.js` or kill process |
| 404 on refresh | Router not handling | Check BrowserRouter is wrapping routes |
| Token not injecting | Axios config issue | Check `src/api/axios.js` interceptor |
| Auth not persisting | Storage issue | Check localStorage keys in AuthContext |
| CSS not loading | Tailwind not working | Run `npm install` and check tailwind.config.js |
| API calls failing | Backend not running | Ensure backend on localhost:5000 |

---

## 📞 Support Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for lint errors (when added)
npm run lint

# Install missing dependencies
npm install
```

---

**Status**: Phase 1-2 Complete
**Progress**: 12/39 tasks done (31%)
**Estimated Completion**: Full feature implementation in Phase 5-7

Next: Implement remaining 4 dashboards + feature components
