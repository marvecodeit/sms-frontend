import { BarChart3, TrendingUp, Users, BookOpen, GraduationCap } from 'lucide-react';

const BAR_DATA = [
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 74 },
  { month: 'May', value: 90 },
  { month: 'Jun', value: 85 },
  { month: 'Jul', value: 78 },
  { month: 'Aug', value: 92 },
];

const max = Math.max(...BAR_DATA.map(d => d.value));

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6 max-w-5xl">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">System-wide performance and usage metrics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users',    value: '1,245', Icon: Users,       color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Active Schools', value: '5',     Icon: BookOpen,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Teachers',       value: '148',   Icon: GraduationCap,color:'text-purple-600',  bg: 'bg-purple-50' },
          { label: 'Avg Score',      value: '78%',   Icon: TrendingUp,  color: 'text-orange-600',  bg: 'bg-orange-50' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-900">Monthly Student Enrollment</h2>
        </div>
        <div className="flex items-end gap-3 h-44">
          {BAR_DATA.map(({ month, value }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-gray-600">{value}</span>
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                style={{ height: `${(value / max) * 140}px` }}
              />
              <span className="text-xs text-gray-400">{month}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;
