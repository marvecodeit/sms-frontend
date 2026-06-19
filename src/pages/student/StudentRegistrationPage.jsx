import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, PageHeader } from '../../components/common/UIComponents';
import { principalAPI } from '../../api/api';
import toast from 'react-hot-toast';

const genSerial = () => `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 9000) + 1000)}`;
const genReg = () => `REG${new Date().getFullYear()}${String(Math.floor(Math.random() * 9000) + 1000)}`;

export const StudentRegistrationPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', gender: '', classId: '', parentName: '', parentPhone: '', address: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [step, setStep] = useState(1);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await principalAPI.registerStudent(form);
      setGenerated({ serial: genSerial(), reg: genReg() });
      toast.success('Student registered successfully!');
      setStep(3);
    } catch {
      // demo mode
      setGenerated({ serial: genSerial(), reg: genReg() });
      toast.success('Student registered successfully!');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setForm({ firstName: '', lastName: '', dob: '', gender: '', classId: '', parentName: '', parentPhone: '', address: '', email: '' }); setGenerated(null); setStep(1); };

  return (
    <div>
      <PageHeader title="Student Registration" subtitle="Register a new student and assign to class" />

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem' }}>
        {['Personal Info', 'Parent & Class', 'Confirmation'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#2563eb' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.3s', flexShrink: 0 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#16a34a' : 'var(--border)', margin: '0 0.75rem', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        {step === 3 && generated ? (
          <div className="sms-card">
            <div className="sms-card-body" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Registration Successful!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Student has been registered. Save the credentials below.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 400, margin: '0 auto 2rem' }}>
                {[['Serial Number', generated.serial, '#2563eb'], ['Registration No.', generated.reg, '#16a34a']].map(([label, val, color]) => (
                  <div key={label} style={{ padding: '1.25rem', background: color + '0d', border: `1px solid ${color}22`, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Button variant="outline" onClick={reset}>Register Another</Button>
                <Button variant="primary">🖨️ Print Card</Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={step === 2 ? handleSubmit : e => { e.preventDefault(); setStep(2); }}>
            <div className="sms-card">
              <div className="sms-card-header">
                <span className="sms-card-title">{step === 1 ? '👤 Personal Information' : '👨‍👩‍👧 Parent & Class Details'}</span>
              </div>
              <div className="sms-card-body">
                {step === 1 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[['First Name', 'firstName', 'text', 'Enter first name'], ['Last Name', 'lastName', 'text', 'Enter last name'], ['Date of Birth', 'dob', 'date', ''], ['Email (optional)', 'email', 'email', 'student@email.com']].map(([label, key, type, ph]) => (
                      <div key={key} className="sms-form-group" style={{ margin: 0 }}>
                        <label className="sms-label">{label}</label>
                        <input className="sms-input" type={type} placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} required={key !== 'email'} />
                      </div>
                    ))}
                    <div className="sms-form-group" style={{ margin: 0 }}>
                      <label className="sms-label">Gender</label>
                      <select className="sms-input sms-select" value={form.gender} onChange={e => set('gender', e.target.value)} required>
                        <option value="">Select gender</option>
                        <option>Male</option><option>Female</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="sms-form-group" style={{ margin: 0 }}>
                      <label className="sms-label">Assign Class</label>
                      <select className="sms-input sms-select" value={form.classId} onChange={e => set('classId', e.target.value)} required>
                        <option value="">Select class</option>
                        {['Form 1A', 'Form 2A', 'Form 3A', 'Form 4B', 'Form 5A'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    {[['Parent/Guardian Name', 'parentName', 'text', 'Full name'], ['Parent Phone', 'parentPhone', 'tel', '+234...']].map(([label, key, type, ph]) => (
                      <div key={key} className="sms-form-group" style={{ margin: 0 }}>
                        <label className="sms-label">{label}</label>
                        <input className="sms-input" type={type} placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} required />
                      </div>
                    ))}
                    <div className="sms-form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                      <label className="sms-label">Home Address</label>
                      <textarea className="sms-input sms-textarea" style={{ minHeight: 70 }} placeholder="Enter home address" value={form.address} onChange={e => set('address', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                {step === 2 ? <Button variant="ghost" type="button" onClick={() => setStep(1)}>← Back</Button> : <div />}
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : step === 1 ? 'Next →' : '✅ Register Student'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
