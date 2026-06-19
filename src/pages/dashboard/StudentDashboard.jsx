import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatCard, Button, PageHeader } from '../../components/common/UIComponents';
import { useApp } from '../../context/AppContext';
import { BarChart3, FileText, CheckCircle2, Trophy, RefreshCw, Download } from 'lucide-react';

const FALLBACK_RESULTS = [
  { subject: 'Mathematics', score: 85, grade: 'A', color: '#16a34a' },
  { subject: 'English', score: 78, grade: 'B+', color: '#2563eb' },
  { subject: 'Science', score: 92, grade: 'A+', color: '#16a34a' },
  { subject: 'History', score: 70, grade: 'B', color: '#d97706' },
  { subject: 'Geography', score: 88, grade: 'A-', color: '#16a34a' },
];

const FALLBACK_ASSIGNMENTS = [
  { _id: 'a1', title: 'Math Problem Set #5', subject: 'Mathematics', due: '2 days', status: 'pending' },
  { _id: 'a2', title: 'English Essay', subject: 'English', due: '4 days', status: 'pending' },
  { _id: 'a3', title: 'Science Project', subject: 'Science', due: '1 week', status: 'submitted' },
];

const FALLBACK_ANNOUNCEMENTS = [
  { _id: 'n1', title: 'Mid-term Exams Schedule', message: 'Exams begin Feb 20. Check timetable on notice board.', time: '2 hrs ago', icon: '📅' },
  { _id: 'n2', title: 'School Fees Reminder', message: 'Second term fees due by Feb 28. Visit the bursar.', time: '1 day ago', icon: '💰' },
  { _id: 'n3', title: 'Sports Day', message: 'Annual sports day is March 5. All students must participate.', time: '2 days ago', icon: '🏃' },
];

const gradeColor = (g) => g.startsWith('A') ? '#16a34a' : g.startsWith('B') ? '#2563eb' : '#d97706';

export const StudentDashboard = () => {
  const {
    myResults, resultsLoading, fetchMyResults,
    myAssignments, myAssignmentsLoading, fetchMyAssignments,
    myAnnouncements, myAnnouncementsLoading, fetchMyAnnouncements,
    myAttendance, fetchMyAttendance,
    downloadReportCard,
  } = useApp();

  useEffect(() => {
    fetchMyResults().catch(() => {});
    fetchMyAssignments().catch(() => {});
    fetchMyAnnouncements().catch(() => {});
    fetchMyAttendance().catch(() => {});
  }, []);

  const results = myResults.length > 0 ? myResults : FALLBACK_RESULTS;
  const assignments = myAssignments.length > 0 ? myAssignments : FALLBACK_ASSIGNMENTS;
  const announcements = myAnnouncements.length > 0 ? myAnnouncements : FALLBACK_ANNOUNCEMENTS;

  const avg = Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length);
  const pending = assignments.filter(a => a.status === 'pending').length;

  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        subtitle="Your academic overview"
        action={
          <Button variant="primary" onClick={downloadReportCard} className="flex items-center gap-2 justify-center">
            <Download size={16} /> Download Report Card
          </Button>
        }
      />

      <div className="sms-stats-grid">
        <StatCard icon={<BarChart3 size={20} />} title="Current Average" value={`${avg}%`} change="Term 2, 2024" color="#2563eb" delay={0} />
        <StatCard icon={<FileText size={20} />} title="Pending Tasks" value={pending} change="Due this week" color="#d97706" delay={0.05} />
        <StatCard icon={<CheckCircle2 size={20} />} title="Attendance" value="95%" change="Excellent" color="#16a34a" delay={0.1} />
        <StatCard icon={<Trophy size={20} />} title="Class Position" value="3rd" change="Out of 25" color="#7c3aed" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Results - spans 2 cols on lg, full on mobile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sms-card lg:col-span-2">
          <div className="sms-card-header">
            <span className="sms-card-title flex items-center gap-2"><FileText size={18} /> My Results — Term 2</span>
            <div className="flex gap-2 items-center">
              {resultsLoading && <span className="text-xs text-gray-500">Loading...</span>}
              <Button variant="outline" size="sm" onClick={fetchMyResults} className="flex items-center gap-1">
                <RefreshCw size={14} />
              </Button>
            </div>
          </div>
          <div className="space-y-0">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{r.subject}</div>
                  <div className="sms-progress h-2">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${r.score}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                      className="sms-progress-bar" style={{ background: gradeColor(r.grade) }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="font-bold text-lg" style={{ color: gradeColor(r.grade) }}>{r.score}%</div>
                  <span className="sms-badge text-xs" style={{ background: gradeColor(r.grade) + '18', color: gradeColor(r.grade) }}>{r.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          {/* Assignments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="sms-card">
            <div className="sms-card-header">
              <span className="sms-card-title flex items-center gap-2"><FileText size={18} /> Assignments</span>
              {myAssignmentsLoading && <span className="text-xs text-gray-500">Loading...</span>}
            </div>
            <div className="space-y-0">
              {assignments.map((a, i) => (
                <div key={a._id || i} className="flex items-center justify-between gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-gray-900 dark:text-white truncate">{a.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{a.subject}</div>
                  </div>
                  {a.status === 'submitted'
                    ? <span className="sms-badge sms-badge-success text-xs flex-shrink-0">Done</span>
                    : <Button variant="primary" size="sm" className="flex-shrink-0">Submit</Button>
                  }
                </div>
              ))}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sms-card">
            <div className="sms-card-header">
              <span className="sms-card-title flex items-center gap-2"><CheckCircle2 size={16} /> Announcements</span>
              {myAnnouncementsLoading && <span className="text-xs text-gray-500">Loading...</span>}
            </div>
            <div className="space-y-0 max-h-96 overflow-y-auto">
              {announcements.map((a, i) => (
                <div key={a._id || i} className="p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-lg mt-1">
                      {a.icon || '📢'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{a.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{a.message}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{a.time || a.createdAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
