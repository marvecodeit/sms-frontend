import apiClient from './axios';

export const resultsAPI = {
  // Upload results
  uploadResults: (formData) => 
    apiClient.post('/results/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        return progress;
      }
    }),

  // Get student results
  getStudentResults: () => 
    apiClient.get('/results/student'),

  // Get results by class and term
  getClassResults: (classId, term) => 
    apiClient.get('/results/class', { params: { classId, term } }),

  // Get pending results (for principal)
  getPendingResults: () => 
    apiClient.get('/approval/pending'),

  // Get approved results
  getApprovedResults: (studentId) => 
    apiClient.get(`/results/approved/${studentId}`),

  // Approve result
  approveResult: (resultId, comment) => 
    apiClient.post('/approval/approve', { resultId, comment }),

  // Reject result
  rejectResult: (resultId, comment) => 
    apiClient.post('/approval/reject', { resultId, comment }),

  // Generate broadsheet (class results)
  generateBroadsheet: (classId, term) => 
    apiClient.post('/broadsheet/generate', { classId, term }),

  // Generate cumulative results (yearly)
  generateCumulative: (studentId, year) => 
    apiClient.post('/cumulative/generate', { studentId, year }),

  // Generate report card (PDF)
  generateReportCard: (studentId, term) => 
    apiClient.post('/report/generate', { studentId, term }, {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' }
    }),

  // Download broadsheet as Excel
  downloadBroadsheet: (broadsheetId) => 
    apiClient.get(`/broadsheet/download/${broadsheetId}`, {
      responseType: 'blob',
      headers: { Accept: 'application/vnd.ms-excel' }
    }),
};

export default resultsAPI;
