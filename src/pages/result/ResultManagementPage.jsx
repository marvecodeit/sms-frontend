import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const RESULTS = [
  { id: 1, student: 'John Doe', serial: 'STU2024001', math: 85, english: 78, science: 92, history: 88, total: 343, avg: 85.75, grade: 'A' },
  { id: 2, student: 'Jane Smith', serial: 'STU2024002', math: 78, english: 85, science: 88, history: 72, total: 323, avg: 80.75, grade: 'B+' },
  { id: 3, student: 'Bob Johnson', serial: 'STU2024003', math: 92, english: 88, science: 95, history: 90, total: 365, avg: 91.25, grade: 'A+' },
  { id: 4, student: 'Alice Brown', serial: 'STU2024004', math: 70, english: 75, science: 68, history: 80, total: 293, avg: 73.25, grade: 'B' },
];

const gradeColor = (g) => g.startsWith('A') ? '#16a34a' : g.startsWith('B') ? '#2563eb' : '#d97706';

export const ResultManagementPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [tab, setTab] = useState('upload');
  const [search, setSearch] = useState('');

  const handleFile = (f) => {
    if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'))) {
      setFile(f);
      toast.success(`${f.name} selected`);
    } else {
      toast.error('Please upload .xlsx, .xls or .csv file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      toast.success('Results uploaded successfully!');
      setUploading(false);
      setFile(null);
      setTab('results');
    }, 1500);
  };

  const filtered = RESULTS.filter(r => r.student.toLowerCase().includes(search.toLowerCase()) || r.serial.includes(search));

  return (
    <div>
      <PageHeader title="Result Management" subtitle="Upload and manage student results" />

      {/* Tabs */}
      <div className="sms-tabs">
        {['upload', 'results'].map(t => (
          <button key={t} className={`sms-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'upload' ? '📤 Upload Results' : '📊 View Results'}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="sms-form-group" style={{ margin: 0 }}>
              <label className="sms-label">Select Class</label>
              <select className="sms-input sms-select">
                <option>Form 2A - Mathematics</option>
                <option>Form 3B - English</option>
                <option>Form 4A - Science</option>
              </select>
            </div>
            <div className="sms-form-group" style={{ margin: 0 }}>
              <label className="sms-label">Select Term</label>
              <select className="sms-input sms-select">
                <option>First Term 2024/2025</option>
                <option>Second Term 2024/2025</option>
                <option>Third Term 2024/2025</option>
              </select>
            </div>
          </div>

          <div
            className={`sms-upload-zone ${drag ? 'drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('result-file').click()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📊</div>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem', fontSize: '1rem' }}>
              {file ? `✅ ${file.name}` : 'Drag & drop or click to upload'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Supports Excel (.xlsx, .xls) and CSV files</div>
            <input id="result-file" type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {/* Template download */}
          <div className="sms-alert sms-alert-info" style={{ marginTop: '1rem' }}>
            💡 Download the <strong>result template</strong> to ensure correct format before uploading.
            <Button variant="outline" size="sm" style={{ marginLeft: '0.75rem' }}>📥 Download Template</Button>
          </div>

          {file && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button variant="ghost" onClick={() => setFile(null)}>Clear</Button>
              <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                {uploading ? '⏳ Uploading...' : '📤 Upload Results'}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {tab === 'results' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
              <input className="sms-input" style={{ paddingLeft: '2.4rem' }} placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="sms-input sms-select" style={{ width: 180 }}>
              <option>Form 2A</option><option>Form 3B</option>
            </select>
            <Button variant="ghost" size="sm">📥 Export PDF</Button>
          </div>

          <div className="sms-card">
            <div className="sms-table-wrap">
              <table className="sms-table">
                <thead>
                  <tr>
                    <th>#</th><th>Student</th><th>Serial</th><th>Math</th><th>English</th><th>Science</th><th>History</th><th>Total</th><th>Avg</th><th>Grade</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.student}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.serial}</td>
                      {[r.math, r.english, r.science, r.history].map((score, j) => (
                        <td key={j} style={{ fontWeight: 500, color: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626' }}>{score}</td>
                      ))}
                      <td style={{ fontWeight: 700 }}>{r.total}</td>
                      <td style={{ fontWeight: 700, color: gradeColor(r.grade) }}>{r.avg}%</td>
                      <td><span className="sms-badge" style={{ background: gradeColor(r.grade) + '18', color: gradeColor(r.grade) }}>{r.grade}</span></td>
                      <td><Button variant="ghost" size="sm">Approve</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
