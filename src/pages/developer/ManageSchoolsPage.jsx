import { useState } from 'react';
import { toast } from 'react-toastify';
import { Building2, MapPin, Users, GraduationCap, Plus, X, Loader2 } from 'lucide-react';

const DEMO_SCHOOLS = [
  { id: 1, name: 'Greenwood High School',  location: 'Lagos',         students: 1250, teachers: 48, status: 'active', plan: 'Premium' },
  { id: 2, name: 'Sunrise Academy',         location: 'Abuja',         students: 850,  teachers: 32, status: 'active', plan: 'Basic' },
  { id: 3, name: 'Bright Future School',    location: 'Kano',          students: 650,  teachers: 25, status: 'trial',  plan: 'Trial' },
  { id: 4, name: 'Royal College',           location: 'Port Harcourt', students: 920,  teachers: 36, status: 'active', plan: 'Premium' },
];

const STATUS_COLORS = {
  active: 'bg-emerald-50 text-emerald-700',
  trial:  'bg-yellow-50 text-yellow-700',
  inactive: 'bg-red-50 text-red-700',
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const inputCls = "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white";

export const ManageSchoolsPage = () => {
  const [schools, setSchools] = useState(DEMO_SCHOOLS);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', plan: 'Basic' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('School name is required');
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSchools(p => [{ id: Date.now(), ...form, students: 0, teachers: 0, status: 'trial' }, ...p]);
    toast.success(`${form.name} added successfully`);
    setForm({ name: '', location: '', plan: 'Basic' });
    setModal(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Schools</h1>
          <p className="text-gray-500 text-sm mt-1">All schools registered on the platform</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition shadow-sm"
        >
          <Plus size={15} /> Add School
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Schools', value: schools.length,                            color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active',        value: schools.filter(s => s.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'On Trial',      value: schools.filter(s => s.status === 'trial').length,  color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Total Students',value: schools.reduce((a, s) => a + s.students, 0),       color: 'text-blue-600',   bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Schools list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Schools ({schools.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {schools.map(s => (
            <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {s.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 ml-15 sm:ml-0">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Students</p>
                  <p className="text-sm font-bold text-gray-700 flex items-center gap-1"><Users size={12} /> {s.students}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Teachers</p>
                  <p className="text-sm font-bold text-gray-700 flex items-center gap-1"><GraduationCap size={12} /> {s.teachers}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[s.status] || STATUS_COLORS.inactive}`}>
                  {s.plan}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[s.status] || STATUS_COLORS.inactive}`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add school modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New School">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">School Name *</label>
            <input className={inputCls} placeholder="e.g. Greenwood High School" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
            <input className={inputCls} placeholder="e.g. Lagos" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plan</label>
            <select className={inputCls} value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}>
              <option value="Trial">Trial</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Adding…' : 'Add School'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSchoolsPage;
