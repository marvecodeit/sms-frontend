import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, PageHeader } from '../../components/common/UIComponents';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({ schoolName: 'EduManage Portal', academicYear: '2024/2025', term: 'Second Term', notifications: true, maintenance: false });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const sections = [
    {
      title: '⚙️ System Settings', icon: '⚙️',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[['System Name', 'schoolName', 'text'], ['Academic Year', 'academicYear', 'text'], ['Current Term', 'term', 'text']].map(([label, key, type]) => (
            <div key={key} className="sms-form-group" style={{ margin: 0 }}>
              <label className="sms-label">{label}</label>
              <input className="sms-input" type={type} value={settings[key]} onChange={e => setSettings({ ...settings, [key]: e.target.value })} />
            </div>
          ))}
          <div className="sms-form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
                style={{ width: 44, height: 24, borderRadius: 99, background: settings.notifications ? 'var(--primary)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.notifications ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <span className="sms-label" style={{ margin: 0 }}>Enable Email Notifications</span>
            </label>
          </div>
        </div>
      )
    },
    {
      title: '🎨 Appearance', icon: '🎨',
      content: (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[['☀️ Light Mode', false], ['🌙 Dark Mode', true]].map(([label, dark]) => (
            <button key={label} onClick={() => dark !== isDark && toggleTheme()}
              style={{ flex: 1, padding: '1rem', borderRadius: 10, border: `2px solid ${isDark === dark ? 'var(--primary)' : 'var(--border)'}`, background: isDark === dark ? 'var(--primary-light)' : 'var(--surface2)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: isDark === dark ? 'var(--primary)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
      )
    },
    {
      title: '🔒 Change Password', icon: '🔒',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          {[['Current Password', 'current'], ['New Password', 'newPass'], ['Confirm Password', 'confirm']].map(([label, key]) => (
            <div key={key} className="sms-form-group" style={{ margin: 0 }}>
              <label className="sms-label">{label}</label>
              <input className="sms-input" type="password" placeholder="••••••••" value={passwords[key]} onChange={e => setPasswords({ ...passwords, [key]: e.target.value })} />
            </div>
          ))}
        </div>
      )
    },
    {
      title: '🛡️ Security', icon: '🛡️',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { title: 'Two-Factor Authentication', desc: 'Add extra security to your account', badge: 'Disabled' },
            { title: 'Login Activity', desc: 'View recent login sessions', badge: '3 active' },
            { title: 'API Access', desc: 'Manage API keys and tokens', badge: '2 keys' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="sms-badge sms-badge-warning">{item.badge}</span>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />
      <div style={{ maxWidth: 800 }}>
        {sections.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="sms-card" style={{ marginBottom: '1.25rem' }}>
            <div className="sms-card-header"><span className="sms-card-title">{s.title}</span></div>
            <div className="sms-card-body">{s.content}</div>
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={() => toast.success('Settings saved!')}>Save Changes</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
