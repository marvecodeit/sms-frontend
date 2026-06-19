import { useState, useEffect } from 'react';
import MainLayout from './../layouts/MainLayout';
import { principalAPI } from './../api/principal.api';
import { toast } from 'react-toastify';
import { Check, X, AlertCircle } from 'lucide-react';

export default function ResultsApproval() {
  // ✅ ALWAYS KEEP RESULTS AS ARRAY
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    fetchPendingResults();
  }, []);

  // ✅ FIXED FETCH
  const fetchPendingResults = async () => {
    try {
      setLoading(true);

      const response = await principalAPI.getPendingResults();

      console.log('API RESPONSE:', response.data);

      // ✅ FIX:
      // Your backend is probably returning:
      // { success: true, results: [...] }

      const resultsData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setResults(resultsData);

    } catch (error) {
      console.log(error);

      toast.error('Failed to fetch pending results');

      // ✅ PREVENT FILTER ERROR
      setResults([]);

    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE RESULT
  const handleApprove = async () => {
    if (!selectedResult) return;

    try {
      await principalAPI.approveResult(selectedResult._id);

      toast.success('Result approved successfully');

      setShowApproveModal(false);
      setSelectedResult(null);

      fetchPendingResults();

    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to approve result'
      );
    }
  };

  // ✅ REJECT RESULT
  const handleReject = async () => {
    if (!selectedResult || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await principalAPI.rejectResult(
        selectedResult._id,
        rejectReason
      );

      toast.success('Result rejected successfully');

      setShowRejectModal(false);
      setSelectedResult(null);
      setRejectReason('');

      fetchPendingResults();

    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to reject result'
      );
    }
  };

  // ✅ SAFE COUNTS
  const approvedCount = results.filter(
    (r) => r.status === 'approved'
  ).length;

  const rejectedCount = results.filter(
    (r) => r.status === 'rejected'
  ).length;

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Results Approval
          </h1>

          <p className="text-gray-600 mt-2">
            Review and approve pending student results
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">
              Pending Results
            </p>

            <p className="text-3xl font-bold text-blue-600">
              {results.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">
              Approved
            </p>

            <p className="text-3xl font-bold text-green-600">
              {approvedCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">
              Rejected
            </p>

            <p className="text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-600">
                Loading results...
              </p>
            </div>

          ) : results.length === 0 ? (

            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              <p className="text-gray-600">
                No pending results to approve
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-gray-50 border-b">

                    <th className="px-6 py-3 text-left">
                      Student
                    </th>

                    <th className="px-6 py-3 text-left">
                      Class
                    </th>

                    <th className="px-6 py-3 text-left">
                      Subject
                    </th>

                    <th className="px-6 py-3 text-left">
                      Score
                    </th>

                    <th className="px-6 py-3 text-left">
                      Grade
                    </th>

                    <th className="px-6 py-3 text-left">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {results.map((result, idx) => (

                    <tr
                      key={result._id || idx}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        {result.studentName || 'N/A'}
                      </td>

                      <td className="px-6 py-4">
                        {result.className || result.class || 'N/A'}
                      </td>

                      <td className="px-6 py-4">
                        {result.subject || 'N/A'}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {result.score || 0}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {result.grade || '-'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : result.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 space-x-2">

                        {result.status === 'pending' && (
                          <>

                            {/* APPROVE */}
                            <button
                              onClick={() => {
                                setSelectedResult(result);
                                setShowApproveModal(true);
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>

                            {/* REJECT */}
                            <button
                              onClick={() => {
                                setSelectedResult(result);
                                setShowRejectModal(true);
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>

                          </>
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}
        </div>

        {/* APPROVE MODAL */}
        {showApproveModal && selectedResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg p-6 w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Approve Result
              </h2>

              <p className="mb-6">
                Approve result for{' '}
                <strong>
                  {selectedResult.studentName}
                </strong>
                ?
              </p>

              <div className="flex gap-4">

                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

              </div>

            </div>

          </div>
        )}

        {/* REJECT MODAL */}
        {showRejectModal && selectedResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg p-6 w-full max-w-md">

              <h2 className="text-xl font-bold mb-4">
                Reject Result
              </h2>

              <textarea
                value={rejectReason}
                onChange={(e) =>
                  setRejectReason(e.target.value)
                }
                placeholder="Reason for rejection..."
                rows={4}
                className="w-full border rounded-lg p-3 mb-6"
              />

              <div className="flex gap-4">

                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}