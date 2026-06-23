import apiClient from './axios';

export const adminAPI = {
  createAdmin: (data) => apiClient.post('/admin/create-admin', data),
  getAllAdmins: () => apiClient.get('/admin/all-admins'),
  getAllUsers: () => apiClient.get('/admin/all-users'),

  createPrincipal: (data) => apiClient.post('/admin/create-principal', data),

  createTeacher: (data) => apiClient.post('/admin/create-teacher', data),
  getAllTeachers: () => apiClient.get('/admin/teachers'),

  getClasses: () => apiClient.get('/admin/classes'),

  // ✅ FIXED: className standard
  createClass: (data) => {
    const payload = {
      name: data.className || data.name,
      capacity: data.capacity,
      section: data.section,
      subjects: data.subjects || [],
      teacher: data.teacher || null,
    };

    return apiClient.post('/admin/create-class', payload);
  },

  updateClass: (id, data) => {
    const payload = {
      name: data.className || data.name,
      capacity: data.capacity,
      section: data.section,
      subjects: data.subjects || [],
    };

    return apiClient.put(`/admin/classes/${id}`, payload);
  },

  deleteClass: (id) => apiClient.delete(`/admin/classes/${id}`),

  // ✅ FIXED: MUST be PUT (your backend uses router.put)
  assignTeacherToClass: (data) => {
    return apiClient.put('/admin/assign-teacher', {
      classId: data.classId,
      teacherId: data.teacherId,
    });
  },
  
  getAllStudents: () => apiClient.get('/admin/students'),
  getTeacherClasses: () => apiClient.get('/admin/teacher-classes'),

  // HOA
  createHOA: (data) => apiClient.post('/admin/create-hoa', data),

  // Secretary
  createSecretary: (data) => apiClient.post('/admin/create-secretary', data),
  getHoaStats: () => apiClient.get('/admin/hoa/stats'),
  getAttendanceView: (params) => apiClient.get('/admin/attendance', { params }),
  getTeachersResultStatus: (params) => apiClient.get('/admin/teachers/results-status', { params }),
  suspendTeacher: (id) => apiClient.put(`/admin/teachers/${id}/suspend`),
  deleteTeacher: (id) => apiClient.delete(`/admin/teachers/${id}`),
  deleteStudent: (id) => apiClient.delete(`/admin/students/${id}`),

  // Developer only
  getKeyUsers:  () => apiClient.get('/admin/key-users'),
  getAllStaff:  () => apiClient.get('/admin/all-staff'),
  resetSystem:  () => apiClient.delete('/admin/reset-system'),
};

export default adminAPI;