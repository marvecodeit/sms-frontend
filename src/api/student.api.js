import apiClient from './axios';

export const studentAPI = {
  getResults: () => apiClient.get('/results/student'),

  getAssignments: () => apiClient.get('/teacher/assignments/student'),

  getAttendance: () => apiClient.get('/student/attendance'),

  downloadReportCard: () => apiClient.get('/report/download', { responseType: 'blob' }),

  // Assignment submissions
  submitAssignment: (formData) =>
    apiClient.post('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMySubmissions: () => apiClient.get('/submissions/my'),
};

export default studentAPI;