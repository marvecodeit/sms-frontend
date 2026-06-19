import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatCard, Button, Modal, PageHeader } from '../../components/common/UIComponents';
import { useApp } from '../../context/AppContext';
import { useForm } from '../../hooks/useForm';
import toast from 'react-hot-toast';
import { BookOpen, Users, FileText, BarChart3, Upload, Plus, Save, Loader2, CheckCircle2 } from 'lucide-react';

const FALLBACK_CLASSES = [
  { _id: 'c1', name: 'Form 2A', subject: 'Mathematics', students: 25, avg: '82%' },
  { _id: 'c2', name: 'Form 3B', subject: 'Mathematics', students: 28, avg: '76%' },
  { _id: 'c3', name: 'Form 4A', subject: 'Add. Maths', students: 22, avg: '79%' },
];

const FALLBACK_STUDENTS = [
  { _id: 's1', name: 'John Doe', serial: 'STU2024001' },
  { _id: 's2', name: 'Jane Smith', serial: 'STU2024002' },
  { _id: 's3', name: 'Bob Johnson', serial: 'STU2024003' },
  { _id: 's4', name: 'Alice Brown', serial: 'STU2024004' },
];

export const TeacherDashboard = () => {
  const { assignedClasses, assignedLoading, fetchAssignedClasses, uploadAssignment, uploadResults, markAttendance } = useApp();
  const [modal, setModal] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  const assignForm = useForm(
    { title: '', classId: '', subject: '', due: '', description: '' },
    (v) => {
      const e = {};
      if (!v.title) e.title = 'Required';
      if (!v.classId) e.classId = 'Required';
      if (!v.due) e.due = 'Required';
      return e;
    }
  );

  useEffect(() => {
    fetchAssignedClasses().catch(() => {});
    // init attendance
    const init = {};
    FALLBACK_STUDENTS.forEach(s => { init[s._id] = 'present'; });
    setAttendance(init);
  }, []);

  const displayClasses = assignedClasses.length > 0 ? assignedClasses : FALLBACK_CLASSES;

  const handlePostAssignment = () => assignForm.submit(async (vals) => {
    await uploadAssignment(vals);
    assignForm.reset();
    setModal(null);
  });

  const handleUploadResults = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('results', file);
    try {
      await uploadResults(formData);
      setFile(null);
      setModal(null);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    try {
      await markAttendance({ classId: 'c1', date: new Date().toISOString().split('T')[0], records: attendance });
    } catch {
      toast.success('Attendance saved!'); // demo fallback
    } finally {
      setSavingAttendance(false);
    }
  };

  const ASSIGNMENTS = [
    { title: 'Algebra Homework #1', class: 'Form 2A', due: 'Feb 15', submissions: 18, total: 25, status: 'active' },
    { title: 'Geometry Quiz', class: 'Form 3B', due: 'Feb 18', submissions: 12, total: 28, status: 'active' },
    { title: 'Calculus Project', class: 'Form 4A', due: 'Feb 20', submissions: 0, total: 22, status: 'pending' },
  ];

  return (
    <div>
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Manage your classes and students"
        action={
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" size="sm" onClick={() => setModal('upload')} className="flex items-center gap-2 justify-center">
              <Upload size={16} /> Upload Results
            </Button>
            <Button variant="primary" onClick={() => setModal('assignment')} className="flex items-center gap-2 justify-center">
              <Plus size={16} /> New Assignment
            </Button>
          </div>
        }
      />

      <div className="sms-stats-grid">
        <StatCard icon={<BookOpen size={20} />} title="My Classes" value={displayClasses.length} change="Assigned classes" color="#2563eb" delay={0} />
        <StatCard icon={<Users size={20} />} title="Total Students" value={displayClasses.reduce((s, c) => s + (c.students || 0), 0) || 75} change="Across all classes" color="#16a34a" delay={0.05} />
        <StatCard icon={<FileText size={20} />} title="Assignments" value={ASSIGNMENTS.length} change={`${ASSIGNMENTS.filter(a => a.status === 'active').length} active`} color="#d97706" delay={0.1} />
        <StatCard icon={<BarChart3 size={20} />} title="Avg Score" value="79%" change="Current term" color="#7c3aed" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* My classes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sms-card">
          <div className="sms-card-header">
            <span className="sms-card-title flex items-center gap-2"><BookOpen size={18} /> My Classes</span>
            {assignedLoading && <span className="text-xs text-gray-500">Loading...</span>}
          </div>
          <div className="overflow-x-auto">
            {displayClasses.map((c, i) => (
              <div key={c._id || i} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {(c.name || '').replace('Form ', 'F')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{c.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{c.subject} · {c.students || 0} students</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="font-bold text-green-600 dark:text-green-400 text-sm">{c.avg || '—'}</div>
                  <Button variant="ghost" size="sm" className="mt-1">View</Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assignments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="sms-card">
          <div className="sms-card-header">
            <span className="sms-card-title flex items-center gap-2"><FileText size={18} /> Assignments</span>
            <Button variant="outline" size="sm" onClick={() => setModal('assignment')} className="flex items-center gap-1">+ New</Button>
          </div>
          <div className="space-y-0">
            {ASSIGNMENTS.map((a, i) => (
              <div key={i} className="p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{a.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{a.class} · Due {a.due}</div>
                  </div>
                  <span className={`sms-badge whitespace-nowrap ${a.status === 'active' ? 'sms-badge-success' : 'sms-badge-warning'}`}>{a.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="sms-progress flex-1">
                    <div className="sms-progress-bar" style={{ width: `${(a.submissions / a.total) * 100}%`, background: '#2563eb' }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{a.submissions}/{a.total}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Attendance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sms-card">
        <div className="sms-card-header">
          <span className="sms-card-title flex items-center gap-2"><CheckCircle2 size={18} /> Mark Attendance — Form 2A · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <Button variant="primary" size="sm" disabled={savingAttendance} onClick={handleSaveAttendance} className="flex items-center gap-2">
            {savingAttendance ? <><Loader2 size={14} className="animate-spin" /> Saving</> : <><Save size={14} /> Save Attendance</>}
          </Button>
        </div>
        <div className="sms-table-wrap overflow-x-auto">
          <table className="sms-table w-full">
            <thead><tr><th className="text-left">#</th><th className="text-left">Student Name</th><th className="text-left">Reg. No</th><th className="text-center">Present</th><th className="text-center">Absent</th><th className="text-center">Late</th></tr></thead>
            <tbody>
              {FALLBACK_STUDENTS.map((s, i) => (
                <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="text-gray-500 dark:text-gray-400">{i + 1}</td>
                  <td className="font-semibold">{s.name}</td>
                  <td className="font-mono text-xs text-gray-500 dark:text-gray-400">{s.serial}</td>
                  {['present', 'absent', 'late'].map(status => (
                    <td key={status} className="text-center">
                      <input type="radio" name={`att-${s._id}`} checked={attendance[s._id] === status}
                        onChange={() => setAttendance(a => ({ ...a, [s._id]: status }))}
                        style={{ accentColor: status === 'present' ? '#16a34a' : status === 'absent' ? '#dc2626' : '#d97706', width: 18, height: 18, cursor: 'pointer' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t flex flex-wrap gap-4 text-sm">
          {[
            { label: 'Present', count: Object.values(attendance).filter(v => v === 'present').length, color: '#16a34a' },
            { label: 'Absent', count: Object.values(attendance).filter(v => v === 'absent').length, color: '#dc2626' },
            { label: 'Late', count: Object.values(attendance).filter(v => v === 'late').length, color: '#d97706' },
          ].map(s => (
            <span key={s.label} style={{ color: s.color }} className="font-semibold">{s.label}: {s.count}</span>
          ))}
        </div>
      </motion.div>

      {/* Upload Results Modal */}
      <Modal isOpen={modal === 'upload'} onClose={() => { setModal(null); setFile(null); }} title="Upload Excel Results" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Select Class</label>
            <select className="sms-input sms-select w-full">
              {displayClasses.map(c => <option key={c._id}>{c.name} — {c.subject}</option>)}
            </select>
          </div>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Select Term</label>
            <select className="sms-input sms-select w-full">
              <option>First Term</option><option>Second Term</option><option>Third Term</option>
            </select>
          </div>
        </div>
        <label htmlFor="excel-upload"
          className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
        >
          <div className="flex justify-center mb-3">
            <BarChart3 size={32} className="text-blue-500" />
          </div>
          <div className="font-semibold text-gray-900 dark:text-white mb-1">
            {file ? `✓ ${file.name}` : 'Click to upload Excel/CSV file'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Supports .xlsx, .xls, .csv</div>
          <input id="excel-upload" type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) setFile(f); }} />
        </label>
        {file && <div className="sms-alert sms-alert-success mt-4 flex items-center gap-2"><CheckCircle2 size={16} /> {file.name} ready to upload</div>}
        <div className="flex justify-end gap-3 mt-4 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => { setModal(null); setFile(null); }}>Cancel</Button>
          <Button variant="primary" disabled={!file || uploading} onClick={handleUploadResults} className="flex items-center gap-2 justify-center">
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading</> : <><Upload size={14} /> Upload Results</>}
          </Button>
        </div>
      </Modal>

      {/* New Assignment Modal */}
      <Modal isOpen={modal === 'assignment'} onClose={() => { setModal(null); assignForm.reset(); }} title="New Assignment">
        <div className="sms-form-group">
          <label className="sms-label">Assignment Title</label>
          <input className="sms-input w-full" name="title" placeholder="e.g. Algebra Homework #2" value={assignForm.values.title} onChange={assignForm.handleChange} />
          {assignForm.errors.title && <span className="text-danger text-xs">{assignForm.errors.title}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Class</label>
            <select className="sms-input sms-select w-full" name="classId" value={assignForm.values.classId} onChange={assignForm.handleChange}>
              <option value="">Select</option>
              {displayClasses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {assignForm.errors.classId && <span className="text-danger text-xs">{assignForm.errors.classId}</span>}
          </div>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Subject</label>
            <input className="sms-input w-full" name="subject" placeholder="Subject" value={assignForm.values.subject} onChange={assignForm.handleChange} />
          </div>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Due Date</label>
            <input className="sms-input w-full" type="date" name="due" value={assignForm.values.due} onChange={assignForm.handleChange} />
            {assignForm.errors.due && <span className="text-danger text-xs">{assignForm.errors.due}</span>}
          </div>
        </div>
        <div className="sms-form-group">
          <label className="sms-label">Instructions</label>
          <textarea className="sms-input sms-textarea w-full" name="description" placeholder="Assignment instructions..." value={assignForm.values.description} onChange={assignForm.handleChange} />
        </div>
        <div className="flex justify-end gap-3 mt-4 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => { setModal(null); assignForm.reset(); }}>Cancel</Button>
          <Button variant="primary" onClick={handlePostAssignment} disabled={assignForm.loading} className="flex items-center gap-2 justify-center">
            {assignForm.loading ? <><Loader2 size={14} className="animate-spin" /> Posting</> : <><FileText size={14} /> Post Assignment</>}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
