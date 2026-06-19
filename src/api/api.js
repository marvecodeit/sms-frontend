import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  developerLogin: (data) => api.post('/auth/developer/login', data),
  studentLogin: (serialNumber) => api.post('/auth/student-login', { serialNumber }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ─── DEVELOPER ───────────────────────────────────────────
export const developerAPI = {
  createAdmin: (data) => api.post('/developer/admins', data),
  getSchools: () => api.get('/developer/schools'),
  createSchool: (data) => api.post('/developer/schools', data),
  updateSchool: (id, data) => api.put(`/developer/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/developer/schools/${id}`),
  getAnalytics: () => api.get('/developer/analytics'),
  getSubscriptions: () => api.get('/developer/subscriptions'),
  getUsers: () => api.get('/developer/users'),
  getSettings: () => api.get('/developer/settings'),
  updateSettings: (data) => api.put('/developer/settings', data),
};

// ─── ADMIN ───────────────────────────────────────────────
export const adminAPI = {
  createPrincipal: (data) => api.post('/admin/principals', data),
  getClasses: () => api.get('/admin/classes'),
  createClass: (data) => api.post('/admin/classes', data),
  updateClass: (id, data) => api.put(`/admin/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),
  createSubject: (data) => api.post('/admin/subjects', data),
  getSubjects: () => api.get('/admin/subjects'),
  assignTeacher: (data) => api.post('/admin/assign-teacher', data),
  getSessions: () => api.get('/admin/sessions'),
  createSession: (data) => api.post('/admin/sessions', data),
  updateSession: (id, data) => api.put(`/admin/sessions/${id}`, data),
  getStudents: () => api.get('/admin/students'),
  getTeachers: () => api.get('/admin/teachers'),
  createTeacher: (data) => api.post('/admin/teachers', data),
};

// ─── PRINCIPAL ───────────────────────────────────────────
export const principalAPI = {
  registerStudent: (data) => api.post('/principal/students', data),
  addStudentToClass: (data) => api.post('/principal/class-assignments', data),
  getSchoolReports: () => api.get('/principal/reports'),
  monitorClasses: () => api.get('/principal/classes'),
  approveResults: (resultId) => api.put(`/principal/results/${resultId}/approve`),
  rejectResults: (resultId) => api.put(`/principal/results/${resultId}/reject`),
  getPendingResults: () => api.get('/principal/results/pending'),
  sendAnnouncement: (data) => api.post('/principal/announcements', data),
  getAnnouncements: () => api.get('/principal/announcements'),
};

// ─── TEACHER ─────────────────────────────────────────────
export const teacherAPI = {
  getAssignedClasses: () => api.get('/teacher/classes'),
  getAssignments: () => api.get('/teacher/assignments'),
  uploadAssignment: (data) => api.post('/teacher/assignments', data),
  updateAssignment: (id, data) => api.put(`/teacher/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/teacher/assignments/${id}`),
  uploadResults: (formData) => api.post('/teacher/results/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  markAttendance: (data) => api.post('/teacher/attendance', data),
  getAttendance: (classId, date) => api.get(`/teacher/attendance?classId=${classId}&date=${date}`),
  sendReport: (data) => api.post('/teacher/reports', data),
  getStudents: (classId) => api.get(`/teacher/classes/${classId}/students`),
};

// ─── STUDENT ─────────────────────────────────────────────
export const studentAPI = {
  getResults: () => api.get('/results/student'),
  getAssignments: () => api.get('/student/assignments'),
  submitAssignment: (id, formData) => api.post(`/student/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAttendance: () => api.get('/student/attendance'),
  getAnnouncements: () => api.get('/student/announcements'),
  downloadReportCard: () => api.get('/student/report-card', { responseType: 'blob' }),
  getProfile: () => api.get('/student/profile'),
};

// ─── CLASS ───────────────────────────────────────────────
export const classAPI = {
  getClasses: () => api.get('/classes'),
  getClass: (id) => api.get(`/classes/${id}`),
  getClassStudents: (classId) => api.get(`/classes/${classId}/students`),
  addStudentToClass: (classId, studentId) => api.post(`/classes/${classId}/students`, { studentId }),
  removeStudentFromClass: (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}`),
};

// ─── RESULTS ─────────────────────────────────────────────
export const resultAPI = {
  uploadResults: (formData) => api.post('/results/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getResults: (classId, term) => api.get(`/results?classId=${classId}&term=${term}`),
  getStudentResults: (studentId) => api.get(`/results/student/${studentId}`),
  approveResult: (id) => api.put(`/results/${id}/approve`),
};

export default api;
