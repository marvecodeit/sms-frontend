# School Management System Frontend

Modern React.js (Vite) frontend for a comprehensive School Management System with role-based dashboards.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Features

### Authentication System
- **Role-based login** for 5 user roles:
  - Developer (System administrator)
  - Admin (School administrator)
  - Principal (Principal)
  - Teacher (Teacher)
  - Student (Student)
- JWT token storage in localStorage
- Automatic token injection in API requests
- Protected routes with role validation
- Auto-logout on 401 responses

### Dashboards by Role

#### Developer Dashboard
- Manage system admins
- View all system users
- System analytics and settings

#### Admin Dashboard
- Create principals, teachers
- Manage classes
- Assign teachers to classes
- View all users and statistics

#### Principal Dashboard
- Create and manage students
- Assign students to classes
- Approve/reject student results
- Generate broadsheet (class results)
- Generate cumulative results
- View pending results

#### Teacher Dashboard
- Upload student results (Excel file)
- Upload assignments
- Mark student attendance
- View assigned class and students

#### Student Dashboard
- View approved results only
- View assignments
- Download report card (PDF)
- View attendance records
- View cumulative results

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Token Persistence**: Auto-restore authentication on page refresh
- **Auto-Logout**: Redirects to login on token expiration (401)
- **Authorization Headers**: Automatic Bearer token injection

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool (fast HMR)
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Socket.io Client** - Real-time features (optional)

## 📁 Project Structure

```
src/
├── api/                  # API service layer
│   ├── axios.js         # Axios config with interceptors
│   ├── auth.api.js      # Auth endpoints
│   ├── admin.api.js     # Admin operations
│   ├── principal.api.js # Principal operations
│   ├── teacher.api.js   # Teacher operations
│   └── student.api.js   # Student operations
│
├── components/          # Reusable components
│   ├── auth/           # Auth-related components
│   ├── common/         # Shared components
│   ├── forms/          # Form components
│   ├── tables/         # Table components
│   └── modals/         # Modal dialogs
│
├── pages/              # Page components
│   ├── auth/           # Login pages
│   ├── LandingPage.jsx # Landing page
│   ├── PrincipalDashboard.jsx
│   ├── TeacherDashboard.jsx
│   └── StudentDashboard.jsx
│
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Dashboard layout
│
├── context/            # Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── UIContext.jsx   # UI state (sidebar, etc)
│
├── routes/             # Routing configuration
│   ├── index.jsx       # Main router
│   └── ProtectedRoute.jsx # Protected route wrapper
│
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── styles/             # Global styles
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

## 🔌 API Integration

All API calls go through `src/api/axios.js` which:
- Sets `baseURL` to `http://localhost:5000/api`
- Automatically injects JWT token: `Authorization: Bearer TOKEN`
- Handles 401 responses (auto-logout)
- Supports file uploads (multipart/form-data)

### Example API Call

```javascript
import { authAPI } from '../api/auth.api';

// In component
const loginDeveloper = async () => {
  const { data } = await authAPI.loginDeveloper({ 
    email: 'dev@school.com', 
    password: '123456' 
  });
  // Token automatically stored and injected
};
```

## 📝 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Management System
VITE_APP_URL=http://localhost:5173
```

## 🎨 UI Components & Styling

- Tailwind CSS utility classes
- Custom component classes (see `src/index.css`)
- Responsive design (mobile-first)
- Sidebar collapse on mobile
- Loading states and spinners
- Toast notifications

## 🔄 State Management

### Authentication Context
```javascript
const { 
  user,              // Current user object
  token,             // JWT token
  loading,           // Loading state
  loginDeveloper,    // Login methods
  loginAdmin,
  loginPrincipal,
  loginTeacher,
  loginStudent,
  logout,            // Logout method
  isAuthenticated,   // Boolean
  isDeveloper,       // Role checks
  isAdmin,
  isPrincipal,
  isTeacher,
  isStudent,
} = useAuth();
```

## 📂 Features To Implement (Phase 5+)

- [ ] Class management UI
- [ ] Student creation/assignment forms
- [ ] Excel file upload with preview
- [ ] Result approval workflow
- [ ] Attendance marking UI
- [ ] Assignment upload/view
- [ ] PDF report card download
- [ ] Broadsheet generation
- [ ] Cumulative results calculation
- [ ] Dashboard charts and analytics
- [ ] Dark mode toggle
- [ ] Real-time notifications

## 🐛 Debugging

### Check Auth State
```javascript
console.log(localStorage.getItem('auth_token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### API Requests
Check browser Network tab → Headers section for `Authorization: Bearer ...`

### Protected Routes
If redirect loops, check user.role vs requiredRole in ProtectedRoute

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy to Vercel/Netlify
- Connect GitHub repository
- Set environment variables
- Deploy `dist` folder

## 📞 Support

For issues related to:
- **Frontend**: Check component implementation
- **API Integration**: Verify backend endpoints
- **Authentication**: Check token in localStorage
- **Styling**: Review Tailwind config and CSS

---

**Status**: Phase 1-2 Complete (Setup, Auth, Basic Dashboards)
**Next**: Implement feature components (Phase 5+)
