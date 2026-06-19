import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, FileText,
  ClipboardList, CheckSquare, BarChart3, Shield, UserCog, Award,
  Upload, Settings, Menu, X, LogOut, ChevronLeft, CreditCard,
  Activity, UserX,
} from 'lucide-react';

const NAV = {
  developer: [
    { label: 'Dashboard', href: '/developer/dashboard', Icon: LayoutDashboard },
    { label: 'Analytics', href: '/developer/analytics', Icon: BarChart3 },
    { label: 'Schools',   href: '/developer/schools',   Icon: BookOpen },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', Icon: LayoutDashboard },
    { label: 'Classes',   href: '/admin/classes',   Icon: BookOpen },
    { label: 'Fees',      href: '/admin/fees',      Icon: CreditCard },
  ],
  hoa: [
    { label: 'Dashboard',  href: '/hoa/dashboard',  Icon: LayoutDashboard },
    { label: 'Classes',    href: '/hoa/classes',     Icon: BookOpen },
    { label: 'Teachers',   href: '/hoa/teachers',    Icon: UserCog },
    { label: 'Students',   href: '/hoa/students',    Icon: Users },
    { label: 'Attendance', href: '/hoa/attendance',  Icon: CheckSquare },
    { label: 'Fees',       href: '/hoa/fees',        Icon: CreditCard },
  ],
  secretary: [
    { label: 'Dashboard', href: '/secretary/dashboard', Icon: LayoutDashboard },
    { label: 'Fees',      href: '/secretary/fees',      Icon: CreditCard },
  ],
  principal: [
    { label: 'Dashboard',        href: '/principal/dashboard',        Icon: LayoutDashboard },
    { label: 'Students',         href: '/principal/students',         Icon: Users },
    { label: 'Fees',             href: '/principal/fees',             Icon: CreditCard },
    { label: 'Results Approval', href: '/principal/results-approval', Icon: CheckSquare },
    { label: 'Broadsheet',       href: '/principal/broadsheet',       Icon: BarChart3 },
    { label: 'Cumulative',       href: '/principal/cumulative',       Icon: FileText },
  ],
  teacher: [
    { label: 'Dashboard',      href: '/teacher/dashboard',      Icon: LayoutDashboard },
    { label: 'Upload Results', href: '/teacher/upload-results', Icon: Upload },
    { label: 'Assignments',    href: '/teacher/assignments',    Icon: ClipboardList },
    { label: 'Attendance',     href: '/teacher/attendance',     Icon: CheckSquare },
    { label: 'Fee Status',     href: '/teacher/fees',           Icon: CreditCard },
  ],
  student: [
    { label: 'Dashboard',   href: '/student/dashboard',  Icon: LayoutDashboard },
    { label: 'My Results',  href: '/student/results',    Icon: FileText },
    { label: 'My Fees',     href: '/student/fees',       Icon: CreditCard },
    { label: 'Assignments', href: '/student/assignments', Icon: ClipboardList },
    { label: 'Attendance',  href: '/student/attendance',  Icon: CheckSquare },
    { label: 'Report Card', href: '/student/report-card', Icon: Award },
  ],
};

const ROLE_COLORS = {
  developer: 'bg-purple-600',
  admin:     'bg-blue-600',
  principal: 'bg-green-600',
  hoa:       'bg-teal-600',
  secretary: 'bg-amber-600',
  teacher:   'bg-orange-500',
  student:   'bg-rose-500',
};

function SidebarContent({ collapsed, mobile, onClose, user, role, navItems, avatarColor, initials, onLogout }) {
  return (
    <div className={[
      'flex flex-col h-full bg-slate-900 text-white transition-all duration-300',
      mobile ? 'w-64' : collapsed ? 'w-20' : 'w-64',
    ].join(' ')}>

      {/* Logo area */}
      <div className={[
        'flex items-center gap-3 px-4 h-16 border-b border-slate-800 flex-shrink-0',
        collapsed && !mobile ? 'justify-center px-2' : '',
      ].join(' ')}>
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white font-bold text-base">S</span>
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm leading-tight truncate">SchoolMS</p>
            <p className="text-slate-400 text-xs truncate capitalize">{role} Portal</p>
          </div>
        )}
        {mobile && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition flex-shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ label, href, Icon }) => (
          <NavLink
            key={href}
            to={href}
            title={collapsed && !mobile ? label : undefined}
            className={({ isActive }) => [
              'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150',
              collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white',
            ].join(' ')}
          >
            <Icon size={18} className="flex-shrink-0" />
            {(!collapsed || mobile) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="border-t border-slate-800 p-3 flex-shrink-0 space-y-2">
        <div className={[
          'flex items-center gap-3',
          collapsed && !mobile ? 'justify-center' : '',
        ].join(' ')}>
          <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{user?.fullname || 'User'}</p>
              <p className="text-slate-400 text-xs truncate capitalize">{role}</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          title={collapsed && !mobile ? 'Logout' : undefined}
          className={[
            'flex items-center gap-2 w-full rounded-xl text-sm font-medium',
            'text-red-400 hover:bg-red-500/10 hover:text-red-300 transition py-2',
            collapsed && !mobile ? 'justify-center px-0' : 'px-3',
          ].join(' ')}
        >
          <LogOut size={16} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const role = user?.role?.toLowerCase() || 'student';
  const navItems = NAV[role] || [];
  const avatarColor = ROLE_COLORS[role] || 'bg-blue-600';
  const initials = (user?.fullname || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarProps = { user, role, navItems, avatarColor, initials, onLogout: handleLogout };

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50">

      {/* Mobile backdrop */}
      <div
        className={[
          'fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile sidebar drawer */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarContent {...sidebarProps} mobile onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar (in flex flow) */}
      <div className="hidden lg:flex flex-shrink-0">
        <SidebarContent {...sidebarProps} collapsed={collapsed} />
      </div>

      {/* Desktop collapse toggle (floating) */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="hidden lg:flex fixed bottom-20 left-0 z-30 items-center justify-center w-5 h-10 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition rounded-r-lg"
        style={{ left: collapsed ? '80px' : '256px', transition: 'left 0.3s' }}
      >
        <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 gap-3 flex-shrink-0 shadow-sm">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <span className="lg:hidden font-bold text-gray-800 text-base">SchoolMS</span>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.fullname || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
            <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shadow`}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
