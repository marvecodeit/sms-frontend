import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { feeAPI } from '../../api/fee.api';
import adminAPI from '../../api/admin.api';
import { CreditCard, Users, FileText, ArrowRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={22} className="text-white" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function SecretaryDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: null, totalPaid: null, totalFees: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getAllStudents(),
      feeAPI.getPaidStudents(),
      feeAPI.getFees(),
    ]).then(([sRes, pRes, fRes]) => {
      setStats({
        totalStudents: sRes.data.students?.length ?? 0,
        totalPaid:     pRes.data.payments?.length ?? 0,
        totalFees:     fRes.data.fees?.length ?? 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Secretary Portal</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome, {user?.fullname}. Manage fees and generate receipts.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse h-32" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users}      label="Total Students"   value={stats.totalStudents} color="bg-blue-500" />
          <StatCard icon={CreditCard} label="Students Paid"    value={stats.totalPaid}     color="bg-green-500" />
          <StatCard icon={FileText}   label="Total Fee Types"  value={stats.totalFees}     color="bg-amber-500" />
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/secretary/fees" className="flex items-center gap-3 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition group">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <CreditCard size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-amber-700">Record Cash Payment</p>
              <p className="text-xs text-gray-400">Mark a student's fee as paid (cash)</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-amber-500" />
          </Link>
          <Link to="/secretary/fees?tab=receipt" className="flex items-center gap-3 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition group">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-700">Generate Receipt</p>
              <p className="text-xs text-gray-400">Print a receipt for any payment</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-green-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
