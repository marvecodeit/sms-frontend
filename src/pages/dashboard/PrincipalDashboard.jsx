import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatCard, Button, Modal, PageHeader } from '../../components/common/UIComponents';
import { useApp } from '../../context/AppContext';
import { useForm } from '../../hooks/useForm';
import { Users, FileText, BarChart3, Megaphone, Plus, Send, Loader2, CheckCircle2, TrendingUp } from 'lucide-react';

const PENDING_RESULTS = [
  { _id: 'r1', class: 'Form 2A', subject: 'Mathematics', teacher: 'Mr. Johnson', students: 25, date: 'Jan 20' },
  { _id: 'r2', class: 'Form 3B', subject: 'English', teacher: 'Mrs. Smith', students: 28, date: 'Jan 21' },
  { _id: 'r3', class: 'Form 1A', subject: 'Science', teacher: 'Mr. Brown', students: 22, date: 'Jan 22' },
];

export const PrincipalDashboard = () => {
  const { fetchSchoolReports, schoolReports, reportsLoading, approveResult, sendAnnouncement } = useApp();
  const [modal, setModal] = useState(null);
  const [pendingResults, setPendingResults] = useState(PENDING_RESULTS);
  const [approving, setApproving] = useState(null);

  const announceForm = useForm(
    { title: '', message: '', audience: 'all' },
    (v) => {
      const e = {};
      if (!v.title) e.title = 'Required';
      if (!v.message) e.message = 'Required';
      return e;
    }
  );

  useEffect(() => { fetchSchoolReports().catch(() => {}); }, []);

  const metrics = [
    { label: 'Overall Performance', value: schoolReports?.performance || 78, color: '#2563eb' },
    { label: 'Attendance Rate', value: schoolReports?.attendance || 92, color: '#16a34a' },
    { label: 'Assignment Completion', value: schoolReports?.assignments || 85, color: '#d97706' },
    { label: 'Results Approved', value: schoolReports?.approved || 60, color: '#7c3aed' },
  ];

  const handleApprove = async (resultId) => {
    setApproving(resultId);
    try {
      await approveResult(resultId);
      setPendingResults(prev => prev.filter(r => r._id !== resultId));
    } catch {
      // fallback: still remove from UI for demo
      setPendingResults(prev => prev.filter(r => r._id !== resultId));
    } finally {
      setApproving(null);
    }
  };

  const handleAnnounce = () => announceForm.submit(async (vals) => {
    await sendAnnouncement(vals);
    announceForm.reset();
    setModal(null);
  });

  return (
    <div>
      <PageHeader
        title="Principal Dashboard"
        subtitle="School performance and management"
        action={
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" size="sm" onClick={() => setModal('announce')} className="flex items-center gap-2 justify-center">
              <Megaphone size={16} /> Announce
            </Button>
            <Button variant="primary" onClick={() => setModal('approve')} className="flex items-center gap-2 justify-center">
              <CheckCircle2 size={16} /> Approve Results
            </Button>
          </div>
        }
      />

      <div className="sms-stats-grid">
        <StatCard icon={<Users size={20} />} title="Total Students" value={schoolReports?.totalStudents || 480} change="All classes" color="#2563eb" delay={0} />
        <StatCard icon={<FileText size={20} />} title="Pending Approvals" value={pendingResults.length} change="Results to approve" color="#d97706" delay={0.05} />
        <StatCard icon={<TrendingUp size={20} />} title="Average Score" value={`${schoolReports?.performance || 78}%`} change="5% from last term" color="#16a34a" delay={0.1} />
        <StatCard icon={<Megaphone size={20} />} title="Announcements" value="3" change="Active" color="#7c3aed" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sms-card">
          <div className="sms-card-header">
            <span className="sms-card-title flex items-center gap-2"><BarChart3 size={18} /> School Metrics</span>
            {reportsLoading && <span className="text-xs text-gray-500">Loading...</span>}
          </div>
          <div className="sms-card-body">
            <div className="flex flex-col gap-4">
              {metrics.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{m.label}</span>
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="sms-progress h-2">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      className="sms-progress-bar" style={{ background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="sms-card">
          <div className="sms-card-header"><span className="sms-card-title flex items-center gap-2"><Plus size={18} /> Quick Actions</span></div>
          <div className="sms-card-body">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <FileText size={20} />, label: 'Register Student', color: '#2563eb', action: () => window.location.href = '/principal/register-student' },
                { icon: <Megaphone size={20} />, label: 'Send Announcement', color: '#7c3aed', action: () => setModal('announce') },
                { icon: <CheckCircle2 size={20} />, label: 'Approve Results', color: '#16a34a', action: () => setModal('approve') },
                { icon: <BarChart3 size={20} />, label: 'View Reports', color: '#d97706', action: () => fetchSchoolReports() },
              ].map((a, i) => (
                <button key={i} onClick={a.action}
                  className="p-4 rounded-lg border transition-all hover:shadow-md"
                  style={{ borderColor: a.color + '44', background: a.color + '08' }}
                  onMouseEnter={e => e.currentTarget.style.background = a.color + '15'}
                  onMouseLeave={e => e.currentTarget.style.background = a.color + '08'}
                >
                  <div className="flex justify-center mb-2" style={{ color: a.color }}>
                    {a.icon}
                  </div>
                  <span className="text-xs font-semibold text-center block" style={{ color: a.color }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending results table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sms-card">
        <div className="sms-card-header"><span className="sms-card-title flex items-center gap-2"><CheckCircle2 size={18} /> Pending Result Approvals ({pendingResults.length})</span></div>
        {pendingResults.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500" />
            <div>All results have been approved!</div>
          </div>
        ) : (
          <div className="sms-table-wrap overflow-x-auto">
            <table className="sms-table w-full">
              <thead><tr><th className="text-left">Class</th><th className="text-left">Subject</th><th className="text-left">Teacher</th><th className="text-center">Students</th><th className="text-left">Submitted</th><th className="text-center">Action</th></tr></thead>
              <tbody>
                {pendingResults.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="font-semibold">{r.class}</td>
                    <td>{r.subject}</td>
                    <td className="text-gray-500 dark:text-gray-400">{r.teacher}</td>
                    <td className="text-center">{r.students}</td>
                    <td className="text-gray-500 dark:text-gray-400 text-sm">{r.date}</td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <Button variant="success" size="sm" disabled={approving === r._id} onClick={() => handleApprove(r._id)} className="flex items-center gap-1">
                          {approving === r._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
                        </Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Announcement Modal */}
      <Modal isOpen={modal === 'announce'} onClose={() => { setModal(null); announceForm.reset(); }} title="Send Announcement">
        <div className="sms-form-group">
          <label className="sms-label">Title</label>
          <input className="sms-input w-full" name="title" placeholder="Announcement title" value={announceForm.values.title} onChange={announceForm.handleChange} />
          {announceForm.errors.title && <span className="text-danger text-xs">{announceForm.errors.title}</span>}
        </div>
        <div className="sms-form-group">
          <label className="sms-label">Audience</label>
          <select className="sms-input sms-select w-full" name="audience" value={announceForm.values.audience} onChange={announceForm.handleChange}>
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="teachers">Teachers Only</option>
          </select>
        </div>
        <div className="sms-form-group">
          <label className="sms-label">Message</label>
          <textarea className="sms-input sms-textarea w-full" name="message" placeholder="Write your announcement..." value={announceForm.values.message} onChange={announceForm.handleChange} />
          {announceForm.errors.message && <span className="text-danger text-xs">{announceForm.errors.message}</span>}
        </div>
        <div className="flex justify-end gap-3 mt-4 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => { setModal(null); announceForm.reset(); }}>Cancel</Button>
          <Button variant="primary" onClick={handleAnnounce} disabled={announceForm.loading} className="flex items-center gap-2 justify-center">
            {announceForm.loading ? <><Loader2 size={14} className="animate-spin" /> Sending</> : <><Send size={14} /> Send</>}
          </Button>
        </div>
      </Modal>

      {/* Approve Results Modal */}
      <Modal isOpen={modal === 'approve'} onClose={() => setModal(null)} title="Approve Results">
        <div className="sms-alert sms-alert-info mb-4">Select results to approve for publishing to students.</div>
        {pendingResults.length === 0
          ? <div className="text-center p-4 text-gray-500 dark:text-gray-400">No pending results.</div>
          : <div className="space-y-2 max-h-96 overflow-y-auto">
              {pendingResults.map((r) => (
                <label key={r._id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
                  <input type="checkbox" className="w-4 h-4" style={{ accentColor: 'var(--primary)' }} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{r.class} — {r.subject}</span>
                </label>
              ))}
            </div>
        }
        <div className="flex justify-end gap-3 mt-4 flex-col sm:flex-row">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="success" onClick={() => { pendingResults.forEach(r => handleApprove(r._id)); setModal(null); }} className="flex items-center gap-2 justify-center">
            <CheckCircle2 size={14} /> Approve All
          </Button>
        </div>
      </Modal>
    </div>
  );
};
