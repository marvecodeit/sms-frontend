import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DollarSign, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import feeAPI from '../../api/fee.api';
import { teacherAPI } from '../../api/teacher.api';

const STATUS_STYLES = {
  paid:     { label: 'Paid',     cls: 'bg-emerald-100 text-emerald-700' },
  partial:  { label: 'Partial',  cls: 'bg-yellow-100  text-yellow-700' },
  not_paid: { label: 'Not Paid', cls: 'bg-red-100     text-red-700' },
};

export default function TeacherFeesPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [fees, setFees] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getMyClasses()
      .then(({ data }) => setClasses(data.classes || data || []))
      .catch(() => {})
      .finally(() => setClassLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClass) { setFees([]); return; }
    setLoading(true);
    feeAPI.getFees({ classId: selectedClass })
      .then(({ data }) => setFees(data.fees || []))
      .catch(() => toast.error('Failed to load fees'))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const toggleFee = async (fee) => {
    const id = fee._id;
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!payments[id]) {
      try {
        const { data } = await feeAPI.getFeePayments(id);
        setPayments((p) => ({ ...p, [id]: { list: data.payments || [], summary: data.summary } }));
      } catch {
        toast.error('Failed to load payment records');
      }
    }
  };

  const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Status</h1>
        <p className="text-gray-500 text-sm mt-1">View payment status for your classes</p>
      </div>

      {/* Class selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
        {classLoading ? (
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <select
            className="w-full sm:w-72 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setExpanded(null); }}
          >
            <option value="">Choose a class…</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {!selectedClass ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <DollarSign size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Select a class to view fee payments</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
          No fees set for this class yet
        </div>
      ) : (
        <div className="space-y-3">
          {fees.map((fee) => {
            const isOpen = expanded === fee._id;
            const pd = payments[fee._id];
            return (
              <div key={fee._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFee(fee)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{fee.title}</p>
                    <p className="text-xs text-gray-400">{fee.term} · {fmt(fee.amount)}</p>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100">
                    {!pd ? (
                      <div className="flex justify-center py-6">
                        <Loader2 size={20} className="animate-spin text-blue-400" />
                      </div>
                    ) : (
                      <>
                        {/* Summary row */}
                        <div className="grid grid-cols-3 gap-px bg-gray-100">
                          <div className="bg-white p-3 text-center">
                            <p className="text-lg font-bold text-emerald-600">{pd.summary?.paid || 0}</p>
                            <p className="text-xs text-gray-400">Paid</p>
                          </div>
                          <div className="bg-white p-3 text-center">
                            <p className="text-lg font-bold text-yellow-600">{pd.summary?.partial || 0}</p>
                            <p className="text-xs text-gray-400">Partial</p>
                          </div>
                          <div className="bg-white p-3 text-center">
                            <p className="text-lg font-bold text-red-600">{pd.summary?.not_paid || 0}</p>
                            <p className="text-xs text-gray-400">Not Paid</p>
                          </div>
                        </div>
                        {/* Student list */}
                        <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                          {pd.list.map((p) => {
                            const s = STATUS_STYLES[p.status] || STATUS_STYLES.not_paid;
                            return (
                              <div key={p._id} className="flex items-center justify-between px-4 py-2.5">
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{p.student?.fullname || '—'}</p>
                                  <p className="text-xs text-gray-400">{p.student?.registrationNumber}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.cls}`}>{s.label}</span>
                                  {p.status === 'partial' && (
                                    <p className="text-xs text-gray-400 mt-0.5">Bal: {fmt(p.balance)}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
