import { useState } from 'react';
import MainLayout from './../layouts/MainLayout';
import { principalAPI } from './../api/principal.api';
import { toast } from 'react-toastify';
import { Download } from 'lucide-react';

export default function GenerateBroadsheet() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);

  const handleGenerate = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    if (!selectedTerm) {
      toast.error('Please select a term');
      return;
    }

    setLoading(true);
    try {
      const response = await principalAPI.generateBroadsheet(selectedClass, selectedTerm);
      
      // Handle file download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Broadsheet_${selectedClass}_${selectedTerm}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setGeneratedFile(`Broadsheet_${selectedClass}_${selectedTerm}.xlsx`);
      toast.success('Broadsheet generated and downloaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate broadsheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Broadsheet</h1>
          <p className="text-gray-600 mt-2">Create a comprehensive broadsheet of class results</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
          <div className="space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a class...</option>
                <option value="form-1a">Form 1A</option>
                <option value="form-2a">Form 2A</option>
                <option value="form-3a">Form 3A</option>
                <option value="form-4b">Form 4B</option>
                <option value="form-5a">Form 5A</option>
              </select>
            </div>

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
                <strong>Note:</strong> The broadsheet will include all approved results for selected class and term,
                organized by student and subject with scores and grades.
              </p>
            </div>

            {/* Generated File Info */}
            {generatedFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
                <p className="text-sm text-green-900">
                  <strong>✓ Generated:</strong> {generatedFile}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                onClick={() => {
                  setSelectedClass('');
                  setSelectedTerm('');
                  setGeneratedFile(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !selectedClass || !selectedTerm}
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
                    Generate & Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="bg-gray-50 rounded-lg p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">What's Included:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Student names and ID numbers
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Subject scores and grades
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Cumulative scores per student
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Class statistics and rankings
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
