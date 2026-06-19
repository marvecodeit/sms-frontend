import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { studentAPI } from '../../api/student.api';
import { toast } from 'react-toastify';
import { Download, File } from 'lucide-react';

export default function DownloadReportCard() {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState(null);

  const handleDownload = async () => {
    if (!selectedTerm) {
      toast.error('Please select a term');
      return;
    }

    setLoading(true);
    try {
      const response = await studentAPI.downloadReportCard(selectedTerm);

      // Handle PDF download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ReportCard_${selectedTerm}_Term.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadedFile(`ReportCard_${selectedTerm}_Term.pdf`);
      toast.success('Report card downloaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download report card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Download Report Card</h1>
          <p className="text-gray-600 mt-2">Get your official report card in PDF format</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn"
        >
          <div className="space-y-6">
            {/* Term Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Term *</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a term...</option>
                <option value="1st">1st Term</option>
                <option value="2nd">2nd Term</option>
                <option value="3rd">3rd Term</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your report card includes all approved results, attendance record, and teacher
                comments for the selected term.
              </p>
            </div>

            {/* Downloaded File Info */}
            {downloadedFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fadeIn"
              >
                <File className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-900">
                    <strong>✓ Downloaded:</strong> {downloadedFile}
                  </p>
                  <p className="text-xs text-green-700 mt-1">The file is saved to your downloads folder</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                onClick={() => {
                  setSelectedTerm('');
                  setDownloadedFile(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                onClick={handleDownload}
                disabled={loading || !selectedTerm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Report Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div
          className="bg-gray-50 rounded-lg p-6 animate-fadeIn"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report Card Contents:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Personal information and class details
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              All subject scores and grades
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Cumulative performance and position in class
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Attendance summary for the term
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Teacher comments and promotion status
            </li>
          </ul>
        </div>

        {/* Download History */}
        <div
          className="bg-white rounded-lg shadow-md p-6 animate-fadeIn"
          style={{ animationDelay: '0.4s' }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Downloads</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">ReportCard_2nd_Term.pdf</p>
                  <p className="text-sm text-gray-600">Downloaded 2 days ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">ReportCard_1st_Term.pdf</p>
                  <p className="text-sm text-gray-600">Downloaded 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
