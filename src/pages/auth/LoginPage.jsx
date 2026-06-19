import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Eye, EyeOff, Lock, Mail,
  Code2, KeyRound, GraduationCap, UserCog, User,
} from 'lucide-react';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    role:    'admin',
    label:   'Admin',
    Icon:    KeyRound,
    color:   'blue',
    accent:  'bg-blue-600',
    ring:    'focus:ring-blue-400',
    tab:     'text-blue-600 border-blue-600',
    desc:    'Admin · HOA · Secretary',
    gradient:'from-blue-600 to-blue-800',
  },
  {
    role:    'principal',
    label:   'Principal',
    Icon:    UserCog,
    color:   'emerald',
    accent:  'bg-emerald-600',
    ring:    'focus:ring-emerald-400',
    tab:     'text-emerald-600 border-emerald-600',
    desc:    'School management',
    gradient:'from-emerald-600 to-emerald-800',
  },
  {
    role:    'teacher',
    label:   'Teacher',
    Icon:    User,
    color:   'orange',
    accent:  'bg-orange-500',
    ring:    'focus:ring-orange-400',
    tab:     'text-orange-600 border-orange-500',
    desc:    'Teaching staff',
    gradient:'from-orange-500 to-orange-700',
  },
  {
    role:    'student',
    label:   'Student',
    Icon:    GraduationCap,
    color:   'rose',
    accent:  'bg-rose-500',
    ring:    'focus:ring-rose-400',
    tab:     'text-rose-600 border-rose-500',
    desc:    'Student portal',
    gradient:'from-rose-500 to-rose-700',
  },
  {
    role:    'developer',
    label:   'Dev',
    Icon:    Code2,
    color:   'purple',
    accent:  'bg-purple-600',
    ring:    'focus:ring-purple-400',
    tab:     'text-purple-600 border-purple-600',
    desc:    'System developer',
    gradient:'from-purple-600 to-purple-800',
  },
];

const LOGIN_FN_MAP = {
  admin:     'loginAdmin',
  principal: 'loginPrincipal',
  teacher:   'loginTeacher',
  student:   'loginStudent',
  developer: 'loginDeveloper',
};

export function LoginPage() {
  const { role: paramRole } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const initialTab = TABS.find(t => t.role === paramRole) || TABS[0];
  const [activeTab, setActiveTab] = useState(initialTab);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setCredentials({ email: '', password: '' });
  };

  const handleChange = (e) => {
    setCredentials(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fnName = LOGIN_FN_MAP[activeTab.role] || 'loginAdmin';
      const returnedUser = await auth[fnName](credentials);
      const destRole = returnedUser?.role?.toLowerCase() || activeTab.role;
      navigate(`/${destRole}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = activeTab.role === 'student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Colored header strip */}
          <div className={`bg-gradient-to-r ${activeTab.gradient} px-8 pt-8 pb-6 text-white transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                <activeTab.Icon size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">SchoolMS</h1>
                <p className="text-white/70 text-xs">{activeTab.desc}</p>
              </div>
            </div>
            <p className="text-white/90 text-base font-semibold">Sign in to your account</p>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.role}
                onClick={() => switchTab(tab)}
                className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold transition-all border-b-2 ${
                  activeTab.role === tab.role
                    ? `${tab.tab} bg-white`
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.Icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {isStudent ? 'Email Address' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@school.com"
                    className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${activeTab.ring} transition bg-white`}
                  />
                </div>
              </div>

              {/* Password — hidden for student */}
              {!isStudent && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${activeTab.ring} transition bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {isStudent && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  Students log in using their email address only — no password needed.
                </p>
              )}

              {activeTab.role === 'admin' && (
                <p className="text-xs text-gray-400 bg-blue-50 rounded-xl p-3 border border-blue-100">
                  Head of Activities and Secretary also log in here.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${activeTab.accent} hover:opacity-90 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm mt-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  `Sign in as ${activeTab.label}`
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              © {new Date().getFullYear()} SchoolMS · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
