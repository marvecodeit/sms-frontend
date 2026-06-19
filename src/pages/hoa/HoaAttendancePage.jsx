import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminAPI from '../../api/admin.api';
import { CheckSquare, Filter, Users, UserCheck, UserX, RefreshCw } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export default function HoaAttendancePage() {
  const [records, setRecords]     = useState([]);
  const [classes, setClasses]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [classId, setClassId]     = useState('');
  const [date, setDate]           = useState(today());

  useEffect(() => {
    adminAPI.getClasses()
      .then(({ data }) => setClasses(data.classes || []))
      .catch(() => {});
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (classId) params.classId = classId;
      if (date)    params.date    = date;
      const { data } = await adminAPI.getAttendanceView(params);
      setRecords(data.records || []);
    } catch {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;
  const total   = records.length;
  const rate    = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare size={22} className="text-teal-600" /> Attendance
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">View daily attendance records across all classes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-700">
          <Filter size={16} /> Filter Records
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={classId} onChange={e => setClassId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            <option value="">All Classes</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input
            type="date"
            value={date} onChange={e => setDate(e.target.value)}
            max={today()}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Loading…' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <Users size={20} className="text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total Records</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <UserCheck size={20} className="text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{present}</p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <UserX size={20} className="text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">{absent}</p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <CheckSquare size={20} className="text-teal-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-600">{rate}%</p>
            <p className="text-xs text-gray-500">Attendance Rate</p>
          </div>
        </div>
      )}

      {/* Records table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14 border border-gray-100" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CheckSquare size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No attendance records found</p>
          <p className="text-gray-400 text-sm mt-1">Try selecting a different class or date</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Student</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Reg. Number</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Class</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Marked By</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden xl:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${r.status === 'Present' ? 'bg-green-500' : 'bg-red-400'}`}>
                          {r.student?.fullname?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="font-medium text-gray-900 truncate">{r.student?.fullname ?? 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{r.student?.registrationNumber ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{r.class?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{r.markedBy?.fullname ?? '—'}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs hidden xl:table-cell">
                      {new Date(r.date).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            {records.length} record{records.length !== 1 ? 's' : ''} shown
          </div>
        </div>
      )}
    </div>
  );
}
