import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import MainLayout from '../../layouts/MainLayout';
import { teacherAPI } from '../../api/teacher.api';
import { toast } from 'react-toastify';
import {
  Upload, CheckCircle2, FileSpreadsheet, X, Download,
  Link, Eye, RefreshCw, Table2,
} from 'lucide-react';

const DEFAULT_SUBJECTS = [
  'Mathematics', 'English Language', 'Basic Science',
  'Social Studies', 'Civic Education', 'Agricultural Science',
  'Computer Studies', 'Physical & Health Education',
];

const MODES = [
  { id: 'file',   label: 'Excel File',     Icon: FileSpreadsheet },
  { id: 'sheets', label: 'Google Sheets',  Icon: Link },
];

export default function ResultsUpload() {
  const [mode, setMode] = useState('file');

  // shared
  const [classes, setClasses]             = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [term, setTerm]                   = useState('');
  const [session, setSession]             = useState('');
  const [loading, setLoading]             = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [templateLoading, setTemplateLoading] = useState(false);

  // file mode
  const [file, setFile]         = useState(null);
  const fileInputRef            = useRef(null);

  // sheets mode
  const [sheetsUrl, setSheetsUrl]       = useState('');
  const [fetchingSheet, setFetchingSheet] = useState(false);
  const [sheetPreview, setSheetPreview] = useState(null); // { rows, base64, headers }
  const [sheetFile, setSheetFile]       = useState(null); // converted File object

  useEffect(() => {
    teacherAPI.getAssignedClasses()
      .then(res => setClasses(res?.data?.classes || []))
      .catch(() => toast.error('Failed to load classes'));
  }, []);

  // ── Download Template ──────────────────────────────────────────────────────
  const handleDownloadTemplate = async () => {
    if (!selectedClass) { toast.error('Select a class first'); return; }
    if (!term)          { toast.error('Select a term first'); return; }
    setTemplateLoading(true);
    try {
      const classObj  = classes.find(c => c._id === selectedClass);
      const className = classObj?.name || 'Class';
      const res       = await teacherAPI.getClassStudents(selectedClass);
      const students  = res?.data?.students || [];
      if (!students.length) { toast.error('No students found in this class'); return; }

      const subjectCols = classObj?.subjects?.length ? classObj.subjects : DEFAULT_SUBJECTS;
      const headers     = ['Reg No', 'Term', 'Class', ...subjectCols];
      const dataRows    = students.map(s => {
        const row = { 'Reg No': s.registrationNumber || '', 'Term': term, 'Class': className };
        subjectCols.forEach(sub => { row[sub] = ''; });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(dataRows, { header: headers });
      ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 14) }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Results');
      XLSX.writeFile(wb, `Result_Template_${className.replace(/\s/g, '_')}_${term.replace(/\s/g, '_')}.xlsx`);
      toast.success(`Template downloaded — fill scores for ${students.length} student(s) then upload`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate template');
    } finally {
      setTemplateLoading(false);
    }
  };

  // ── File select ────────────────────────────────────────────────────────────
  const handleFileSelect = e => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.match(/\.(xlsx|xls)$/i)) { toast.error('Only .xlsx / .xls files allowed'); return; }
    if (selected.size > 10 * 1024 * 1024)        { toast.error('File must be under 10 MB'); return; }
    setFile(selected);
  };

  // ── Fetch Google Sheet ─────────────────────────────────────────────────────
  const handleFetchSheet = async () => {
    if (!sheetsUrl.trim()) { toast.error('Paste a Google Sheets link first'); return; }
    if (!sheetsUrl.includes('docs.google.com/spreadsheets')) {
      toast.error('That does not look like a Google Sheets URL'); return;
    }

    setFetchingSheet(true);
    setSheetPreview(null);
    setSheetFile(null);

    try {
      const res  = await teacherAPI.fetchSheetPreview(sheetsUrl.trim());
      const { rows, base64, sheetName } = res.data;

      if (!rows?.length) { toast.error('Sheet appears to be empty'); return; }

      // Derive headers from first row keys
      const headers = Object.keys(rows[0]);

      setSheetPreview({ rows, headers, sheetName });

      // Convert base64 → File so we can upload it with the same formData flow
      const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob      = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      setSheetFile(new File([blob], 'google_sheet_results.xlsx', { type: blob.type }));

      toast.success(`Sheet loaded — ${rows.length} row(s) from "${sheetName}"`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch sheet. Make sure it is set to "Anyone with the link can view".');
    } finally {
      setFetchingSheet(false);
    }
  };

  const clearSheet = () => {
    setSheetPreview(null);
    setSheetFile(null);
    setSheetsUrl('');
  };

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    const uploadFile = mode === 'file' ? file : sheetFile;
    if (!uploadFile)      { toast.error('No file ready to upload'); return; }
    if (!selectedClass)   { toast.error('Select a class'); return; }
    if (!term)            { toast.error('Select a term'); return; }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('classId', selectedClass);
      formData.append('term', term);
      if (session) formData.append('session', session);

      const interval = setInterval(() => {
        setUploadProgress(p => p >= 90 ? p : p + 10);
      }, 250);

      const res = await teacherAPI.uploadResults(formData);
      clearInterval(interval);
      setUploadProgress(100);

      toast.success(res?.data?.message || 'Results uploaded successfully');
      if (res?.data?.notFound?.length) {
        toast.warn(`${res.data.notFound.length} reg number(s) not matched: ${res.data.notFound.join(', ')}`);
      }

      setTimeout(() => {
        setFile(null); setSheetPreview(null); setSheetFile(null);
        setSheetsUrl(''); setSelectedClass(''); setTerm(''); setSession('');
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const readyToUpload = (mode === 'file' ? !!file : !!sheetFile) && !!selectedClass && !!term;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Results</h1>
          <p className="text-gray-500 mt-1">Upload via Excel file or paste a Google Sheets link.</p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setMode(id); setSheetPreview(null); setSheetFile(null); setFile(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className={`gap-6 ${sheetPreview ? 'grid grid-cols-1 xl:grid-cols-2' : 'flex flex-col'}`}>

          {/* ── LEFT: form ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

            {/* CLASS */}
            <div>
              <label className="block text-sm font-semibold mb-1">Class *</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select class</option>
                {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
              </select>
            </div>

            {/* TERM */}
            <div>
              <label className="block text-sm font-semibold mb-1">Term *</label>
              <select value={term} onChange={e => setTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select term</option>
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            {/* SESSION */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Academic Session <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input type="text" value={session} onChange={e => setSession(e.target.value)}
                placeholder="e.g. 2024/2025"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* ── FILE MODE ── */}
            {mode === 'file' && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Step 1 — Download template</p>
                  <p className="text-xs text-blue-600 mb-3">Select class &amp; term above, then download. Fill scores, then upload below.</p>
                  <button onClick={handleDownloadTemplate} disabled={templateLoading || !selectedClass || !term}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                    <Download size={15} /> {templateLoading ? 'Generating…' : 'Download Template'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Step 2 — Upload filled Excel *</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-2xl p-10 text-center cursor-pointer transition">
                    <input type="file" hidden ref={fileInputRef} accept=".xlsx,.xls" onChange={handleFileSelect} />
                    {file ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="mx-auto text-green-500" size={48} />
                        <p className="font-bold text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto text-green-400" size={44} />
                        <p className="font-semibold text-gray-700">Click to choose the filled Excel file</p>
                        <p className="text-sm text-gray-400">.xlsx or .xls — max 10 MB</p>
                      </div>
                    )}
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="text-green-600" size={22} />
                        <span className="text-sm font-medium text-gray-800">{file.name}</span>
                      </div>
                      <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="p-1 hover:bg-red-100 rounded-lg transition">
                        <X className="text-red-500" size={17} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── SHEETS MODE ── */}
            {mode === 'sheets' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-medium">
                    ⚠️ Make sure the sheet is set to <strong>"Anyone with the link can view"</strong> before fetching.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Google Sheets URL *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={sheetsUrl}
                      onChange={e => setSheetsUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button onClick={handleFetchSheet} disabled={fetchingSheet || !sheetsUrl.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition flex-shrink-0">
                      {fetchingSheet
                        ? <><RefreshCw size={15} className="animate-spin" /> Fetching…</>
                        : <><Eye size={15} /> Fetch & Preview</>
                      }
                    </button>
                  </div>
                </div>

                {sheetFile && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <span className="text-sm font-medium text-gray-800">Sheet loaded — ready to upload</span>
                    </div>
                    <button onClick={clearSheet} className="p-1 hover:bg-red-100 rounded-lg transition">
                      <X className="text-red-500" size={17} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PROGRESS */}
            {loading && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Uploading…</span>
                  <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <button onClick={handleUpload} disabled={loading || !readyToUpload}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Uploading…' : 'Upload Results'}
            </button>
          </div>

          {/* ── RIGHT: sheet preview table ── */}
          {sheetPreview && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <Table2 size={16} className="text-blue-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Preview — {sheetPreview.sheetName} ({sheetPreview.rows.length} rows)
                </p>
              </div>
              <div className="overflow-auto max-h-[520px]">
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-gray-800 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">#</th>
                      {sheetPreview.headers.map(h => (
                        <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetPreview.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-gray-400 font-mono">{i + 1}</td>
                        {sheetPreview.headers.map(h => (
                          <td key={h} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                            {row[h] !== undefined && row[h] !== '' ? String(row[h]) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
