import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Modal, PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ASSIGNMENTS = [
  { id: 1, title: 'Algebra Homework #1', class: 'Form 2A', subject: 'Mathematics', due: '2025-02-15', status: 'active', submissions: 18, total: 25, file: 'algebra_hw1.pdf' },
  { id: 2, title: 'Geometry Quiz Prep', class: 'Form 3B', subject: 'Mathematics', due: '2025-02-18', status: 'active', submissions: 12, total: 28, file: 'geometry_quiz.pdf' },
  { id: 3, title: 'Calculus Project', class: 'Form 4A', subject: 'Add. Maths', due: '2025-02-20', status: 'pending', submissions: 0, total: 22, file: null },
  { id: 4, title: 'Trigonometry Practice', class: 'Form 2A', subject: 'Mathematics', due: '2025-01-30', status: 'closed', submissions: 25, total: 25, file: 'trig_practice.pdf' },
];

const statusColor = { active: '#16a34a', pending: '#d97706', closed: '#64748b' };
const daysLeft = (due) => {
  const d = Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24));
  return d > 0 ? `${d} days left` : d === 0 ? 'Due today' : 'Overdue';
};

export const AssignmentPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', class: '', subject: '', due: '', description: '' });
  const [file, setFile] = useState(null);

  const filtered = ASSIGNMENTS.filter(a => filter === 'all' || a.status === filter);

  const handlePost = () => {
    toast.success('Assignment posted successfully!');
    setModal(null);
    setForm({ title: '', class: '', subject: '', due: '', description: '' });
  };

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle={isTeacher ? 'Manage and post assignments' : 'View and submit assignments'}
        action={isTeacher && <Button variant="primary" onClick={() => setModal('create')}>📋 New Assignment</Button>}
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'active', 'pending', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '0.4rem 1rem', borderRadius: 99, border: '1.5px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'var(--primary)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--text-muted)',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${ASSIGNMENTS.length})` : `(${ASSIGNMENTS.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="sms-card" style={{ overflow: 'visible' }}>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: '#2563eb18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📋</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 99, background: statusColor[a.status] + '18', color: statusColor[a.status], textTransform: 'uppercase' }}>{a.status}</span>
              </div>

              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.3rem' }}>{a.title}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{a.class} · {a.subject}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', fontSize: '0.82rem', color: a.status === 'closed' ? 'var(--text-muted)' : '#d97706', fontWeight: 600 }}>
                📅 {daysLeft(a.due)} · Due {new Date(a.due).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>

              {isTeacher && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submissions</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>{a.submissions}/{a.total}</span>
                  </div>
                  <div className="sms-progress">
                    <div className="sms-progress-bar" style={{ width: `${(a.submissions / a.total) * 100}%`, background: '#2563eb' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                {a.file && <Button variant="outline" size="sm" style={{ flex: 1 }}>📥 Download</Button>}
                {isTeacher
                  ? <Button variant="ghost" size="sm" style={{ flex: 1 }}>👁️ View Submissions</Button>
                  : a.status === 'active'
                    ? <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => setModal('submit')}>📤 Submit</Button>
                    : <Button variant="ghost" size="sm" style={{ flex: 1 }} disabled>Closed</Button>
                }
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <div style={{ fontWeight: 600 }}>No assignments found</div>
        </div>
      )}

      {/* Create Assignment Modal */}
      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="📋 New Assignment" size="lg">
        <div className="sms-form-group">
          <label className="sms-label">Assignment Title</label>
          <input className="sms-input" placeholder="e.g. Algebra Homework #2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Class</label>
            <select className="sms-input sms-select" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
              <option value="">Select</option>
              <option>Form 2A</option><option>Form 3B</option><option>Form 4A</option>
            </select>
          </div>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Subject</label>
            <input className="sms-input" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="sms-form-group" style={{ margin: 0 }}>
            <label className="sms-label">Due Date</label>
            <input className="sms-input" type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} />
          </div>
        </div>
        <div className="sms-form-group">
          <label className="sms-label">Instructions</label>
          <textarea className="sms-input sms-textarea" placeholder="Assignment instructions..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="sms-form-group">
          <label className="sms-label">Attach File (optional)</label>
          <label htmlFor="assign-file" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1.5px dashed var(--border)', borderRadius: 8, cursor: 'pointer', background: 'var(--surface2)' }}>
            <span style={{ fontSize: '1.3rem' }}>📎</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{file ? file.name : 'Click to attach file'}</span>
            <input id="assign-file" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handlePost}>📋 Post Assignment</Button>
        </div>
      </Modal>

      {/* Submit Assignment Modal (student) */}
      <Modal isOpen={modal === 'submit'} onClose={() => setModal(null)} title="📤 Submit Assignment">
        <div className="sms-alert sms-alert-info">Upload your completed assignment file.</div>
        <label htmlFor="submit-file" className="sms-upload-zone" style={{ display: 'block', cursor: 'pointer', marginTop: '1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📤</div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{file ? file.name : 'Click to upload your work'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>PDF, Word, or image files</div>
          <input id="submit-file" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" disabled={!file} onClick={() => { toast.success('Assignment submitted!'); setModal(null); setFile(null); }}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};
