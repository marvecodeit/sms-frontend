import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import MainLayout from '../../layouts/MainLayout';
import { teacherAPI } from '../../api/teacher.api';
import { toast } from 'react-toastify';
import { Upload, CheckCircle2, FileSpreadsheet, X, Download } from 'lucide-react';

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Basic Science',
  'Social Studies',
  'Civic Education',
  'Agricultural Science',
  'Computer Studies',
  'Physical & Health Education',
];

export default function ResultsUpload() {
  const [file, setFile]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [templateLoading, setTemplateLoading] = useState(false);

  const [classes, setClasses]         = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [term, setTerm]               = useState('');
  const [session, setSession]         = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    teacherAPI.getAssignedClasses()
      .then((res) => setClasses(res?.data?.classes || []))
      .catch(() => toast.error('Failed to load classes'));
  }, []);

  // ──────────────────────────────────────────────────────────
  // Download Template
  // ──────────────────────────────────────────────────────────
  const handleDownloadTemplate = async () => {
    if (!selectedClass) { toast.error('Select a class first'); return; }
    if (!term)          { toast.error('Select a term first'); return; }

    setTemplateLoading(true);
    try {
      const classObj = classes.find((c) => c._id === selectedClass);
      const className = classObj?.name || 'Class';

      // Fetch students in the class
      const res = await teacherAPI.getClassStudents(selectedClass);
      const students = res?.data?.students || [];

      if (!students.length) {
        toast.error('No students found in this class. Ask admin to enroll students first.');
        return;
      }

      // Decide subject columns: use class subjects if defined, else defaults
      const subjectCols = (classObj?.subjects?.length ? classObj.subjects : DEFAULT_SUBJECTS);

      // Build rows — headers first, then one row per student
      const headers = ['Reg No', 'Term', 'Class', ...subjectCols];

      const dataRows = students.map((s) => {
        const row = {
          'Reg No': s.registrationNumber || '',
          'Term': term,
          'Class': className,
        };
        subjectCols.forEach((sub) => { row[sub] = ''; });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(dataRows, { header: headers });

      // Style header row bold by setting width hints
      ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 4, 14) }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Results');

      const safeClass = className.replace(/[^a-zA-Z0-9]/g, '_');
      const safeTerm  = term.replace(/\s+/g, '_');
      XLSX.writeFile(wb, `Result_Template_${safeClass}_${safeTerm}.xlsx`);

      toast.success(`Template downloaded — fill in scores for ${students.length} student(s) then upload.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate template');
    } finally {
      setTemplateLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────
  // File select
  // ──────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Only Excel files (.xlsx / .xls) are allowed');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB');
      return;
    }
    setFile(selected);
  };

  // ──────────────────────────────────────────────────────────
  // Upload
  // ──────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file)          { toast.error('Please select a file'); return; }
    if (!selectedClass) { toast.error('Please select a class'); return; }
    if (!term)          { toast.error('Please select a term'); return; }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', selectedClass);
      formData.append('term', term);
      if (session) formData.append('session', session);

      const interval = setInterval(() => {
        setUploadProgress((p) => (p >= 90 ? p : p + 10));
      }, 250);

      const res = await teacherAPI.uploadResults(formData);
      clearInterval(interval);
      setUploadProgress(100);

      const { totalSaved, notFound } = res?.data || {};
      toast.success(res?.data?.message || 'Results uploaded successfully');

      if (notFound?.length) {
        toast.warn(`${notFound.length} reg number(s) not matched: ${notFound.join(', ')}`);
      }

      setTimeout(() => {
        setFile(null);
        setSelectedClass('');
        setTerm('');
        setSession('');
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);

    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Results</h1>
          <p className="text-gray-500 mt-1">
            Download the template, fill in scores, then upload — each student sees only their own result.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* CLASS */}
          <div>
            <label className="block text-sm font-semibold mb-1">Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* TERM */}
          <div>
            <label className="block text-sm font-semibold mb-1">Term *</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select term</option>
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          {/* SESSION (optional) */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Academic Session <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              placeholder="e.g. 2024/2025"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* DOWNLOAD TEMPLATE */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">Step 1 — Download template</p>
            <p className="text-xs text-blue-600 mb-3">
              Select class &amp; term above, then download. The template comes pre-filled with student
              registration numbers. Fill in each student's score for every subject, then upload below.
            </p>
            <button
              onClick={handleDownloadTemplate}
              disabled={templateLoading || !selectedClass || !term}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <Download size={15} />
              {templateLoading ? 'Generating…' : 'Download Template'}
            </button>
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold mb-1">Step 2 — Upload filled Excel *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-2xl p-10 text-center cursor-pointer transition"
            >
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
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
                <button
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1 hover:bg-red-100 rounded-lg transition"
                >
                  <X className="text-red-500" size={17} />
                </button>
              </div>
            )}
          </div>

          {/* PROGRESS */}
          {loading && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Uploading…</span>
                <span className="text-blue-600 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleUpload}
            disabled={loading || !file || !selectedClass || !term}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading…' : 'Upload Results'}
          </button>

        </div>
      </div>
    </MainLayout>
  );
}
