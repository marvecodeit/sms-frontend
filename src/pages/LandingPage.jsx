import { useNavigate } from 'react-router-dom';
import { Code2, KeyRound, GraduationCap, UserCog, User, ArrowRight, Shield, BarChart3, Users, FileText } from 'lucide-react';

const roles = [
  { id: 'developer', label: 'Developer',  Icon: Code2,        bg: 'bg-purple-600', hover: 'hover:bg-purple-700', desc: 'System administration & oversight' },
  { id: 'admin',     label: 'Admin',       Icon: KeyRound,     bg: 'bg-blue-600',   hover: 'hover:bg-blue-700',   desc: 'Manage school staff & classes' },
  { id: 'principal', label: 'Principal',   Icon: UserCog,      bg: 'bg-emerald-600',hover: 'hover:bg-emerald-700',desc: 'School operations & approvals' },
  { id: 'teacher',   label: 'Teacher',     Icon: User,         bg: 'bg-orange-500', hover: 'hover:bg-orange-600', desc: 'Upload results & attendance' },
  { id: 'student',   label: 'Student',     Icon: GraduationCap,bg: 'bg-rose-500',   hover: 'hover:bg-rose-600',   desc: 'View results & assignments' },
];

const features = [
  { Icon: Shield,    title: 'Role-Based Access',      desc: 'Secure login for every role with tailored dashboards',          color: 'text-purple-500', bg: 'bg-purple-50' },
  { Icon: FileText,  title: 'Result Management',      desc: 'Upload, approve and download academic results with ease',        color: 'text-blue-500',   bg: 'bg-blue-50' },
  { Icon: Users,     title: 'Student Management',     desc: 'Register, organise and track all student records',              color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { Icon: BarChart3, title: 'Reports & Analytics',    desc: 'Broadsheets, report cards and cumulative performance charts',   color: 'text-orange-500', bg: 'bg-orange-50' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            School Management System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Modern ERP for<br />
            <span className="text-blue-400">Primary &amp; Secondary</span><br />
            Schools
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12">
            One platform for students, teachers, administrators and principals.
            Manage results, attendance, assignments and more.
          </p>

          {/* Role cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {roles.map(({ id, label, Icon, bg, hover, desc }) => (
              <button
                key={id}
                onClick={() => navigate(`/login/${id}`)}
                className={`${bg} ${hover} group flex flex-col items-center gap-3 p-5 rounded-2xl text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-black/30 focus:outline-none focus:ring-2 focus:ring-white/50`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-white/70 text-xs mt-0.5 hidden sm:block">{desc}</p>
                </div>
                <ArrowRight size={14} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <p className="text-slate-500 text-sm mt-8">Select your role to sign in</p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete school management solution built for Nigerian primary and secondary schools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, desc, color, bg }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SchoolMS. All rights reserved.
      </footer>
    </div>
  );
}
