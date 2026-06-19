import { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { studentAPI } from '../../api/student.api';
import { toast } from 'react-toastify';
import { Filter } from 'lucide-react';

export default function ViewAttendance() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAttendance();
      setAttendanceData(response.data || {});
    } catch (error) {
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = attendanceData?.monthly || {};
  const currentMonthData = monthlyData[selectedMonth] || {
    present: 0,
    absent: 0,
    leave: 0,
  };

  const totalDays = currentMonthData.present + currentMonthData.absent + currentMonthData.leave;
  const attendancePercentage = totalDays > 0 ? ((currentMonthData.present / totalDays) * 100).toFixed(1) : 0;

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 80) return { color: 'text-green-600', bg: 'bg-green-50', status: 'Good' };
    if (percentage >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-50', status: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-50', status: 'Poor' };
  };

  const statusData = getAttendanceStatus(attendancePercentage);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-2">View your attendance record</p>
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-semibold">Select Month:</span>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading attendance...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 animate-fadeIn"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Present</p>
                <p className="text-3xl font-bold text-green-600">{currentMonthData.present}</p>
                <p className="text-xs text-gray-600 mt-2">Days</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Absent</p>
                <p className="text-3xl font-bold text-red-600">{currentMonthData.absent}</p>
                <p className="text-xs text-gray-600 mt-2">Days</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Leave</p>
                <p className="text-3xl font-bold text-yellow-600">{currentMonthData.leave}</p>
                <p className="text-xs text-gray-600 mt-2">Days</p>
              </div>

              <div className={`${statusData.bg} rounded-lg shadow p-6`}>
                <p className="text-gray-600 text-sm mb-2">Percentage</p>
                <p className={`text-3xl font-bold ${statusData.color}`}>{attendancePercentage}%</p>
                <p className={`text-xs ${statusData.color} mt-2 font-semibold`}>{statusData.status}</p>
              </div>
            </div>

            {/* Attendance Breakdown */}
            <div
              className="bg-white rounded-lg shadow-md p-6 animate-fadeIn"
              style={{ animationDelay: '0.1s' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Breakdown</h2>

              {/* Progress Bars */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Present</span>
                    <span className="text-sm text-gray-600">{currentMonthData.present} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      style={{
                        width:
                          totalDays > 0
                            ? `${(currentMonthData.present / totalDays) * 100}%`
                            : '0%',
                      }}
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Absent</span>
                    <span className="text-sm text-gray-600">{currentMonthData.absent} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      style={{
                        width:
                          totalDays > 0
                            ? `${(currentMonthData.absent / totalDays) * 100}%`
                            : '0%',
                      }}
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Leave</span>
                    <span className="text-sm text-gray-600">{currentMonthData.leave} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      style={{
                        width:
                          totalDays > 0
                            ? `${(currentMonthData.leave / totalDays) * 100}%`
                            : '0%',
                      }}
                      className="bg-yellow-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Summary */}
            <div
              className="bg-white rounded-lg shadow-md p-6 animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Yearly Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Present</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Absent</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Leave</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlyData).map(([month, data]) => {
                      const total = data.present + data.absent + data.leave;
                      const percentage = total > 0 ? ((data.present / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={month} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{month}</td>
                          <td className="px-4 py-3 text-sm text-green-600 font-semibold">{data.present}</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">{data.absent}</td>
                          <td className="px-4 py-3 text-sm text-yellow-600 font-semibold">{data.leave}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
