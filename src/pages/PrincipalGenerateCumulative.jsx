import { useState } from 'react';
import MainLayout from './../layouts/MainLayout';
import { principalAPI } from '../api/principal.api';
import { toast } from 'react-toastify';
import { Download, Search } from 'lucide-react';

export default function GenerateCumulative() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cumulativeData, setCumulativeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock student list
  const students = [
    { id: '1', name: 'John Doe', regNo: 'STU001' },
    { id: '2', name: 'Jane Smith', regNo: 'STU002' },
    { id: '3', name: 'Mike Johnson', regNo: 'STU003' },
    { id: '4', name: 'Emily Brown', regNo: 'STU004' },
    { id: '5', name: 'David Lee', regNo: 'STU005' },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCumulative = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setLoading(true);
    try {
      const response = await principalAPI.generateCumulative(selectedStudent);
      setCumulativeData(response.data);
      toast.success('Cumulative results loaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate cumulative results');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cumulativeData) return;

    const dataStr = JSON.stringify(cumulativeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Cumulative_${cumulativeData.studentName}.json`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Cumulative results downloaded successfully');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cumulative Results</h1>
          <p className="text-gray-600 mt-2">View student performance across all terms</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 animate-fadeIn">
          <div className="space-y-6">
            {/* Student Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Student *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or registration number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Student Dropdown */}
              {searchTerm && filteredStudents.length > 0 && (
                <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 animate-fadeIn">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student.id);
                        setSearchTerm('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.regNo}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Student Display */}
            {selectedStudent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Selected:</strong>{' '}
                  {students.find((s) => s.id === selectedStudent)?.name}
                </p>
              </div>
            )}

            {/* Generate Button */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                onClick={() => {
                  setSelectedStudent('');
                  setCumulativeData(null);
                  setSearchTerm('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                onClick={handleGenerateCumulative}
                disabled={loading || !selectedStudent}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Generate Results'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {cumulativeData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Student Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Student Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Student Name</p>
                  <p className="text-lg font-semibold text-gray-900">{cumulativeData.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Registration Number</p>
                  <p className="text-lg font-semibold text-gray-900">{cumulativeData.regNo}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Class</p>
                  <p className="text-lg font-semibold text-gray-900">{cumulativeData.class}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Promotion Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cumulativeData.promotionStatus === 'Promoted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {cumulativeData.promotionStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Cumulative Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Term 1</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Term 2</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Term 3</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Average</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cumulativeData.results?.map((result, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{result.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.term1}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.term2}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.term3}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{result.average}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {result.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Results
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
