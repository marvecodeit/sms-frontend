import { motion, AnimatePresence } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', dark = false }) => {
  const s = size === 'sm' ? 16 : size === 'lg' ? 36 : 22;
  return (
    <span style={{
      width: s, height: s, border: `2.5px solid ${dark ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.3)'}`,
      borderTopColor: dark ? 'var(--primary)' : '#fff',
      borderRadius: '50%', display: 'inline-block',
      animation: 'sms-spin 0.7s linear infinite',
    }} />
  );
};

export const StatCard = ({ icon, title, value, change, changeType = 'up', color = '#2563eb', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="sms-stat"
  >
    <div className="sms-stat-icon" style={{ background: color + '18', color }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
    </div>
    <div className="sms-stat-info">
      <div className="sms-stat-value">{value}</div>
      <div className="sms-stat-label">{title}</div>
      {change && <div className={`sms-stat-change ${changeType}`}>{changeType === 'up' ? '↑' : '↓'} {change}</div>}
    </div>
  </motion.div>
);

export const Button = ({ children, variant = 'primary', size = '', onClick, disabled, type = 'button', className = '', style = {} }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`sms-btn sms-btn-${variant} ${size ? `sms-btn-${size}` : ''} ${className}`}
    style={style}
  >
    {children}
  </button>
);

export const Modal = ({ isOpen, onClose, title, children, size = '' }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="sms-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`sms-modal ${size === 'lg' ? 'sms-modal-lg' : ''}`}
        >
          <div className="sms-modal-header">
            <span className="sms-modal-title">{title}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1 }}>✕</button>
          </div>
          <div className="sms-modal-body">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Badge = ({ children, type = 'primary' }) => (
  <span className={`sms-badge sms-badge-${type}`}>{children}</span>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="sms-page-header">
    <div>
      <h1 className="sms-page-title">{title}</h1>
      {subtitle && <p className="sms-page-subtitle">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div className="sms-card" style={style}>{children}</div>
);

export const EmptyState = ({ icon = '📭', text = 'No data found' }) => (
  <div className="sms-empty">
    <div className="sms-empty-icon">{icon}</div>
    <div className="sms-empty-text">{text}</div>
  </div>
);

export const Avatar = ({ name = 'U', color = '#2563eb', size = 'sm' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`sms-avatar ${size === 'lg' ? 'sms-avatar-lg' : ''}`}
      style={{ background: color + '22', color, border: `2px solid ${color}44` }}>
      {initials}
    </div>
  );
};
