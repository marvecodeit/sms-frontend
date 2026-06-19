import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/UIComponents';
import apiClient from '../../api/axios';
import MainLayout from '../../layouts/MainLayout';
import { toast } from 'react-toastify';
import {
  FileSpreadsheet,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

const gradeColor = (grade) => {
  if (grade === 'A') return 'text-green-700 bg-green-100';
  if (grade === 'B') return 'text-blue-700 bg-blue-100';
  if (grade === 'C') return 'text-yellow-700 bg-yellow-100';
  if (grade === 'D') return 'text-orange-700 bg-orange-100';
  return 'text-red-700 bg-red-100';
};

function ResultCard({ r }) {
  const [open, setOpen] = useState(false);
  const hasSubjects = r.subjects?.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <FileSpreadsheet size={28} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-base">{r.term}</p>
            {r.session && <p className="text-sm text-gray-500">Session: {r.session}</p>}
            {r.class?.name && <p className="text-sm text-gray-500">Class: {r.class.name}</p>}
            {r.teacher?.fullname && (
              <p className="text-sm text-gray-400">Teacher: {r.teacher.fullname}</p>
            )}
            {hasSubjects && (
              <p className="text-sm text-indigo-600 font-semibold mt-1">
                Average: {r.average}%
                {r.grandTotal > 0 && (
                  <span className="text-gray-400 font-normal ml-2">
                    (Total: {r.grandTotal})
                  </span>
                )}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Uploaded{' '}
              {new Date(r.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {hasSubjects && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 border border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg text-sm font-semibold transition"
            >
              <BookOpen size={14} />
              {open ? 'Hide Scores' : 'View Scores'}
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          {r.fileUrl && (
            <>
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <ExternalLink size={15} />
                View File
              </a>
              <a
                href={r.fileUrl}
                download
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Download size={15} />
                Download
              </a>
            </>
          )}
        </div>
      </div>

      {/* Expandable subject scores */}
      {open && hasSubjects && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Subject Scores
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-2 pr-4 font-semibold text-gray-600">Subject</th>
                  <th className="pb-2 pr-4 font-semibold text-gray-600 text-center">Score</th>
                  <th className="pb-2 pr-4 font-semibold text-gray-600 text-center">Grade</th>
                  <th className="pb-2 font-semibold text-gray-600 text-center">Remark</th>
                </tr>
              </thead>
              <tbody>
                {r.subjects.map((sub, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 font-medium text-gray-800">{sub.subjectName}</td>
                    <td className="py-2 pr-4 text-center font-bold text-gray-900">{sub.total}</td>
                    <td className="py-2 pr-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor(sub.grade)}`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2 text-center text-gray-500 text-xs">{sub.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary row */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="bg-indigo-50 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-500">Total Score</p>
              <p className="font-bold text-indigo-700 text-lg">{r.grandTotal}</p>
            </div>
            <div className="bg-green-50 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-500">Average</p>
              <p className="font-bold text-green-700 text-lg">{r.average}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-500">Subjects</p>
              <p className="font-bold text-gray-700 text-lg">{r.subjects.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const StudentResultsPage = () => {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    apiClient
      .get('/results/student')
      .then((res) => setResults(res?.data?.results || []))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await apiClient.get('/report/download', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'My_Report_Card.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report card downloaded!');
    } catch {
      toast.error('No results available to generate report card');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <PageHeader title="My Results" subtitle="Your personal results uploaded by your teacher" />

        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading || results.length === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            <Download size={15} />
            {downloading ? 'Generating…' : 'Download Report Card (PDF)'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading your results…</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <FileSpreadsheet size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No results yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your teacher has not uploaded results yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <ResultCard key={r._id} r={r} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
