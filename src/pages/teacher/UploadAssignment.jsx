import { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { teacherAPI } from '../../api/teacher.api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { connectSocket } from '../../utils/socket';
import {
  Plus, X, Upload, File, Download, ChevronDown, ChevronUp,
  Clock, CheckCircle, Loader2, BookOpen, Users,
} from 'lucide-react';
import { format } from 'date-fns';

const inputCls = "w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function UploadAssignment() {
  const { user } = useAuth();
  const [classes, setClasses]           = useState([]);
  const [assignments, setAssignments]   = useState([]);
  const [submissions, setSubmissions]   = useState({}); // assignmentId → []
  const [expanded, setExpanded]         = useState(null);
  const [loadingSubs, setLoadingSubs]   = useState({});
  const [modal, setModal]               = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', classId: '', file: null });
  const fileRef = useRef(null);

  // ── Fetch initial data ────────────────────────────────────────────────────
  const loadAssignments = useCallback(async () => {
    try {
      const { data } = await teacherAPI.getAssignments();
      setAssignments(data.assignments || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    teacherAPI.getMyClasses()
      .then(({ data }) => setClasses(data.classes || data || []))
      .catch(() => {});
    loadAssignments();
  }, [loadAssignments]);

  // ── Socket.IO — real-time submission notifications ─────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket();

    // join after connect; socket.io client may not be connected yet on first render
    const joinRoom = () => socket.emit('join_teacher_room', user._id);
    if (socket.connected) { joinRoom(); }
    else { socket.once('connect', joinRoom); }

    socket.on('new_submission', ({ assignmentId, assignmentTitle, studentName, submittedAt, fileUrl, filename }) => {
      toast.info(
        `📎 ${studentName} submitted "${assignmentTitle}"`,
        { autoClose: 5000 }
      );

      // Inject the new submission directly into state so count updates immediately
      setSubmissions((prev) => {
        const list = prev[assignmentId] || [];
        // avoid duplicate if already fetched
        const exists = list.some((s) => s.student?.fullname === studentName);
        if (exists) return prev;
        return {
          ...prev,
          [assignmentId]: [
            { _id: Date.now(), student: { fullname: studentName }, fileUrl, filename, createdAt: submittedAt },
            ...list,
          ],
        };
      });

      // Also bump the assignment count badge
      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId
            ? { ...a, _submissionCount: (a._submissionCount || 0) + 1 }
            : a
        )
      );
    });

    return () => {
      socket.off('connect', joinRoom);
      socket.off('new_submission');
    };
  }, [user?._id]);

  // ── Load submissions on expand ─────────────────────────────────────────────
  const toggleExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);

    if (!submissions[id]) {
      setLoadingSubs((p) => ({ ...p, [id]: true }));
      try {
        const { data } = await teacherAPI.getAssignmentSubmissions(id);
        setSubmissions((p) => ({ ...p, [id]: data.submissions || [] }));
        // sync count
        setAssignments((prev) =>
          prev.map((a) => a._id === id ? { ...a, _submissionCount: data.count } : a)
        );
      } catch {
        toast.error('Failed to load submissions');
      } finally {
        setLoadingSubs((p) => ({ ...p, [id]: false }));
      }
    }
  };

  // ── Create new assignment ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.dueDate)       return toast.error('Due date is required');
    if (!form.classId)       return toast.error('Select a class');
    if (!form.file)          return toast.error('Attach a file');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('description', form.description);
      fd.append('dueDate',     form.dueDate);
      fd.append('classId',     form.classId);
      fd.append('file',        form.file);

      await teacherAPI.uploadAssignment(fd);
      toast.success('Assignment created and sent!');
      setModal(false);
      setForm({ title: '', description: '', dueDate: '', classId: '', file: null });
      if (fileRef.current) fileRef.current.value = '';
      loadAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (deadline) => deadline && new Date() > new Date(deadline);

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-500 text-sm mt-1">Create assignments and track student submissions in real-time</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={15} /> New Assignment
          </button>
        </div>

        {/* Assignment list */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No assignments yet</p>
            <p className="text-gray-400 text-sm">Click "New Assignment" to create one</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => {
              const deadline = a.deadline || a.dueDate;
              const overdue  = isOverdue(deadline);
              const subList  = submissions[a._id] || [];
              const subCount = a._submissionCount ?? subList.length;
              const isOpen   = expanded === a._id;

              return (
                <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Row */}
                  <button
                    onClick={() => toggleExpand(a._id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {a.class?.name && <span className="text-xs text-gray-400">{a.class.name}</span>}
                        {deadline && (
                          <span className={`flex items-center gap-1 text-xs font-semibold ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                            <Clock size={10} />
                            {overdue ? 'Closed' : `Due ${format(new Date(deadline), 'MMM d, HH:mm')}`}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Submission badge */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                        <Users size={11} /> {subCount}
                      </span>
                      {isOpen ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Submissions panel */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {loadingSubs[a._id] ? (
                        <div className="flex justify-center py-6">
                          <Loader2 size={20} className="animate-spin text-blue-400" />
                        </div>
                      ) : subList.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-6">No submissions yet</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {subList.map((s) => (
                            <div key={s._id} className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-3">
                                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{s.student?.fullname || '—'}</p>
                                  <p className="text-xs text-gray-400">
                                    {s.createdAt ? format(new Date(s.createdAt), 'MMM d, yyyy HH:mm') : ''}
                                    {s.student?.registrationNumber && ` · ${s.student.registrationNumber}`}
                                  </p>
                                </div>
                              </div>
                              {s.fileUrl && (
                                <a
                                  href={s.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                                >
                                  <Download size={12} /> {s.filename || 'Download'}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Assignment Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Assignment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input className={inputCls} placeholder="e.g. Chapter 5 — Mathematics" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={2} className={inputCls + ' resize-none'} placeholder="Instructions…" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class *</label>
              <select className={inputCls} value={form.classId} onChange={(e) => setForm((p) => ({ ...p, classId: e.target.value }))}>
                <option value="">Select…</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date *</label>
              <input type="datetime-local" className={inputCls} value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </div>

          {/* File */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] || null }))} />
            {form.file ? (
              <>
                <File size={28} className="mx-auto text-blue-500 mb-1" />
                <p className="text-sm font-semibold text-gray-800">{form.file.name}</p>
                <p className="text-xs text-gray-400">{(form.file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <Upload size={28} className="mx-auto text-gray-300 mb-1" />
                <p className="text-sm text-gray-500 font-medium">Click to attach file</p>
                <p className="text-xs text-gray-400">PDF, Word, Images…</p>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Sending…' : 'Send to Class'}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
