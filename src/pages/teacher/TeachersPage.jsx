import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Modal, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const TEACHERS = [
  { id: 1, name: 'Mr. Johnson', subject: 'Mathematics', classes: ['Form 2A', 'Form 3B'], email: 'johnson@school.edu', phone: '+234 801 234 5678', status: 'active' },
  { id: 2, name: 'Mrs. Smith', subject: 'English Language', classes: ['Form 1A', 'Form 2B'], email: 'smith@school.edu', phone: '+234 802 345 6789', status: 'active' },
  { id: 3, name: 'Mr. Brown', subject: 'Basic Science', classes: ['Form 3A', 'Form 4A'], email: 'brown@school.edu', phone: '+234 803 456 7890', status: 'active' },
  { id: 4, name: 'Mrs. Davis', subject: 'Social Studies', classes: ['Form 1B', 'Form 2A'], email: 'davis@school.edu', phone: '+234 804 567 8901', status: 'inactive' },
];

const COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#0891b2'];

export const TeachersPage = () => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', email: '', phone: '', password: '' });

  const filtered = TEACHERS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle={`${TEACHERS.length} teachers registered`}
        action={<Button variant="primary" onClick={() => setModal('add')}>➕ Add Teacher</Button>}
      />

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input className="sms-input" style={{ paddingLeft: '2.4rem' }} placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="ghost" size="sm">📥 Export</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sms-card">
        <div className="sms-table-wrap">
          <table className="sms-table">
            <thead>
              <tr><th>#</th><th>Teacher</th><th>Subject</th><th>Classes</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS[i % COLORS.length] + '18', color: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{t.name}</span>
                    </div>
                  </td>
                  <td><span className="sms-badge sms-badge-primary">{t.subject}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {t.classes.map(c => <span key={c} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 99, color: 'var(--text-muted)' }}>{c}</span>)}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.email}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.phone}</td>
                  <td><span className={`sms-badge ${t.status === 'active' ? 'sms-badge-success' : 'sms-badge-danger'}`}>{t.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Button variant="outline" size="sm" onClick={() => { setSelected(t); setModal('view'); }}>View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Teacher Modal */}
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="➕ Add Teacher">
        {[['Full Name', 'name', 'text', 'Mr./Mrs. Full Name'], ['Subject', 'subject', 'text', 'e.g. Mathematics'], ['Email', 'email', 'email', 'teacher@school.edu'], ['Phone', 'phone', 'tel', '+234...'], ['Password', 'password', 'password', 'Temporary password']].map(([label, key, type, ph]) => (
          <div key={key} className="sms-form-group">
            <label className="sms-label">{label}</label>
            <input className="sms-input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div className="sms-form-group">
          <label className="sms-label">Assign Classes</label>
          <select className="sms-input sms-select" multiple style={{ height: 90 }}>
            {['Form 1A', 'Form 2A', 'Form 3A', 'Form 4B', 'Form 5A'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => { toast.success('Teacher added!'); setModal(null); }}>Add Teacher</Button>
        </div>
      </Modal>

      {/* View Teacher Modal */}
      {selected && (
        <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="👨🏫 Teacher Profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface2)', borderRadius: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2563eb18', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
              {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{selected.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selected.subject}</div>
            </div>
          </div>
          {[['Email', selected.email], ['Phone', selected.phone], ['Classes', selected.classes.join(', ')], ['Status', selected.status]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setModal(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
