import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import adminAPI from '../../api/admin.api';
import { toast } from 'react-toastify';
import {
  Shield, Users, BarChart3, Settings, LayoutDashboard,
  KeyRound, Download, RefreshCw, Eye, EyeOff,
} from 'lucide-react';

const TABS = [
  { id: 'overview',   label: 'Overview',   Icon: LayoutDashboard },
  { id: 'key-access', label: 'Key Access', Icon: KeyRound },
];

const ROLE_COLOR = {
  developer: 'bg-purple-100 text-purple-700',
  admin:      'bg-blue-100 text-blue-700',
  principal:  'bg-emerald-100 text-emerald-700',
  hoa:        'bg-teal-100 text-teal-700',
  secretary:  'bg-amber-100 text-amber-700',
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Admins',   value: '—', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active Schools', value: '—', color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Total Users',    value: '—', color: 'text-emerald-600',bg: 'bg-emerald-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className={`text-xl font-bold ${color}`}>{value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">System Panels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Manage Admins', desc: 'Create, view and manage admin accounts for each school.',   Icon: Shield,   color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'System Users',  desc: 'View all registered users across all roles and schools.',   Icon: Users,    color: 'text-blue-600',   bg: 'bg-blue-50' },
            { title: 'Analytics',     desc: 'View system-wide usage metrics and performance reports.',   Icon: BarChart3,color: 'text-emerald-600',bg: 'bg-emerald-50' },
            { title: 'Settings',      desc: 'Configure system defaults, email and API integrations.',    Icon: Settings, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ title, desc, Icon, color, bg }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition">
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Key Access Tab ───────────────────────────────────────────────────────────
function KeyAccessTab() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [fetched, setFetched]   = useState(false);
  const [showHint, setShowHint] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getKeyUsers();
      setUsers(data.users || []);
      setFetched(true);
    } catch {
      toast.error('Failed to load key users');
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    if (!users.length) return;

    const now = new Date().toLocaleString('en-NG', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const lines = [
      '╔══════════════════════════════════════════════════╗',
      '║         SCHOOLMS — KEY ACCESS CREDENTIALS        ║',
      '╚══════════════════════════════════════════════════╝',
      `  Generated: ${now}`,
      `  Total accounts: ${users.length}`,
      '',
      '  NOTE: Passwords shown are defaults from seeder.',
      '  Change them immediately in production.',
      '',
      '══════════════════════════════════════════════════',
      '',
    ];

    const roleOrder = ['developer', 'admin', 'principal', 'hoa', 'secretary'];

    roleOrder.forEach(role => {
      const group = users.filter(u => u.role === role);
      if (!group.length) return;

      const roleLabel = role.toUpperCase().replace('HOA', 'HEAD OF ACTIVITIES').replace('SECRETARY', 'SECRETARY');
      lines.push(`── ${roleLabel} (${group.length}) ──────────────────────────`);
      lines.push('');

      group.forEach((u, i) => {
        lines.push(`  [${i + 1}] ${u.fullname}`);
        lines.push(`       Email    : ${u.email}`);
        lines.push(`       Role     : ${u.role}`);
        if (u.schoolName && u.schoolName !== 'Not Assigned') {
          lines.push(`       School   : ${u.schoolName}`);
        }
        lines.push(`       Password : 123456  (default — change if not updated)`);
        lines.push(`       Created  : ${new Date(u.createdAt).toLocaleDateString('en-NG')}`);
        lines.push('');
      });
    });

    lines.push('══════════════════════════════════════════════════');
    lines.push('  CONFIDENTIAL — Do not share outside dev team.');
    lines.push('══════════════════════════════════════════════════');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `schoolms-key-access-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  return (
    <div className="max-w-3xl space-y-5">

      {/* Header card */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <KeyRound size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Key Access</h2>
            <p className="text-purple-200 text-xs">Developer-only credential export</p>
          </div>
        </div>
        <p className="text-purple-100 text-sm leading-relaxed">
          View and download login credentials for all top-level system accounts —
          Developer, Admin, Principal, HOA and Secretary. Keep this file secure.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Loading…</>
            : <><RefreshCw size={15} /> {fetched ? 'Refresh' : 'Load Accounts'}</>
          }
        </button>

        {fetched && users.length > 0 && (
          <button
            onClick={downloadTxt}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold"
          >
            <Download size={15} /> Download .txt
          </button>
        )}
      </div>

      {/* Table */}
      {fetched && (
        users.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <KeyRound size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No top-level accounts found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Password hint toggle */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {users.length} account{users.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
              >
                {showHint ? <EyeOff size={13} /> : <Eye size={13} />}
                {showHint ? 'Hide' : 'Show'} default password
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    {(u.fullname || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{u.fullname}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  {/* School */}
                  {u.schoolName && u.schoolName !== 'Not Assigned' && (
                    <p className="text-xs text-gray-400 hidden md:block truncate max-w-[120px]">{u.schoolName}</p>
                  )}
                  {/* Default password */}
                  {showHint && (
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg flex-shrink-0">
                      123456
                    </span>
                  )}
                  {/* Role badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${ROLE_COLOR[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    {u.role === 'hoa' ? 'HOA' : u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {!fetched && !loading && (
        <p className="text-sm text-gray-400 text-center pt-4">
          Click <strong>Load Accounts</strong> to fetch all top-level users.
        </p>
      )}
    </div>
  );
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
export default function DeveloperDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  return (
    <MainLayout>
      <div className="space-y-5">

        {/* Page header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={22} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Welcome, {user?.fullname}. System-wide controls.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview'    && <OverviewTab />}
        {tab === 'key-access'  && <KeyAccessTab />}

      </div>
    </MainLayout>
  );
}
