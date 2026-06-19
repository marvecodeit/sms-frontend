import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, User, FileText, CheckSquare } from 'lucide-react';

const ROLE_COLORS = {
  developer: '#7c3aed', admin: '#2563eb', principal: '#0891b2', teacher: '#16a34a', student: '#d97706',
};

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const roleColor = ROLE_COLORS[user?.role] || '#2563eb';
  const initials = (user?.fullname || user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'student': return <User size={16} />;
      case 'document': return <FileText size={16} />;
      case 'task': return <CheckSquare size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const notifications = [
    { id: 1, text: 'New student registered', time: '5 min ago', type: 'student' },
    { id: 2, text: 'Results uploaded for Form 2A', time: '1 hr ago', type: 'document' },
    { id: 3, text: 'Assignment due tomorrow', time: '3 hrs ago', type: 'task' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 md:px-5 gap-4 sticky top-0 z-50">
      {/* Left */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="truncate">
          <div className="font-bold text-base text-gray-900 dark:text-white capitalize truncate">{user?.role} Dashboard</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Welcome back, {user?.fullname?.split(' ')[0] || 'User'}</div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowUser(false); }} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotif && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg w-80 max-w-[calc(100vw-16px)] z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 font-bold text-sm text-gray-900 dark:text-white">Notifications</div>
              {notifications.map(n => (
                <div key={n.id} className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{n.text}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.time}</div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">View all</span>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => { setShowUser(!showUser); setShowNotif(false); }} className="flex items-center gap-1 md:gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <div className="w-8 h-8 rounded-full text-center" style={{ background: roleColor + '22', color: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', border: `2px solid ${roleColor}44` }}>{initials}</div>
            <span className="text-gray-500 dark:text-gray-400 text-xs ml-0 md:ml-1">▼</span>
          </button>
          {showUser && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg w-48 z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="font-bold text-sm text-gray-900 dark:text-white">{user?.fullname || user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
              </div>
              <div className="p-2">
                <button onClick={logout} className="w-full px-3 py-2 bg-none border-none cursor-pointer text-red-600 dark:text-red-400 font-semibold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left flex items-center gap-2 transition">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const iconBtn = {
  width: 38, height: 38, borderRadius: 8,
  background: 'var(--surface2)', border: '1px solid var(--border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: '1rem', position: 'relative',
};

const dropdown = {
  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 10, boxShadow: 'var(--shadow-lg)',
  minWidth: 280, zIndex: 200,
};
