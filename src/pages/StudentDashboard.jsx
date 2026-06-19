import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import { FileText, ClipboardList, CheckSquare, Award, ArrowRight, LayoutDashboard } from 'lucide-react';

const StatCard = ({ label, value, color, bg }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
  </div>
);

const ActionCard = ({ title, desc, Icon, color, bg, btnLabel, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all"
  >
    <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
      <Icon size={20} className={color} />
    </div>
    <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
    <p className="text-gray-500 text-xs mb-4 leading-relaxed">{desc}</p>
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${color} group-hover:gap-2.5 transition-all`}>
      {btnLabel} <ArrowRight size={13} />
    </span>
  </button>
);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      title: 'My Results',
      desc: 'View your academic results uploaded by your teachers for each term.',
      Icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      btnLabel: 'View results',
      onClick: () => navigate('/student/results'),
    },
    {
      title: 'Assignments',
      desc: 'Check assignments posted by your teachers and download materials.',
      Icon: ClipboardList,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      btnLabel: 'View assignments',
      onClick: () => navigate('/student/assignments'),
    },
    {
      title: 'Attendance',
      desc: 'Review your attendance record across all school days this term.',
      Icon: CheckSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      btnLabel: 'View attendance',
      onClick: () => navigate('/student/attendance'),
    },
    {
      title: 'Report Card',
      desc: 'Download your official PDF report card for the current session.',
      Icon: Award,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      btnLabel: 'Download PDF',
      onClick: () => navigate('/student/report-card'),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl">

        {/* Greeting */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={22} className="text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.fullname?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your academics.</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="My Class"            value="—"   color="text-blue-600"    bg="bg-blue-50" />
          <StatCard label="Results Available"   value="—"   color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Pending Assignments" value="—"   color="text-orange-600"  bg="bg-orange-50" />
          <StatCard label="Attendance Rate"     value="—"   color="text-purple-600"  bg="bg-purple-50" />
        </div>

        {/* Action cards */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map(a => <ActionCard key={a.title} {...a} />)}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
