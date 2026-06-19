import { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  developerAPI, adminAPI, principalAPI,
  teacherAPI, studentAPI, classAPI, resultAPI
} from '../api/api';

const AppContext = createContext(null);

const initialState = {
  // Developer
  schools: [], schoolsLoading: false,
  analytics: null, analyticsLoading: false,
  allUsers: [], usersLoading: false,

  // Admin
  classes: [], classesLoading: false,
  students: [], studentsLoading: false,
  teachers: [], teachersLoading: false,
  sessions: [], sessionsLoading: false,

  // Principal
  schoolReports: null, reportsLoading: false,
  announcements: [], announcementsLoading: false,

  // Teacher
  assignedClasses: [], assignedLoading: false,
  assignments: [], assignmentsLoading: false,
  attendance: {}, attendanceLoading: false,

  // Student
  myResults: [], resultsLoading: false,
  myAssignments: [], myAssignmentsLoading: false,
  myAttendance: [], myAttendanceLoading: false,
  myAnnouncements: [], myAnnouncementsLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET': return { ...state, [action.key]: action.value };
    case 'SET_LOADING': return { ...state, [`${action.key}Loading`]: action.value };
    case 'APPEND': return { ...state, [action.key]: [action.value, ...state[action.key]] };
    case 'UPDATE': return { ...state, [action.key]: state[action.key].map(item => item._id === action.value._id ? action.value : item) };
    case 'REMOVE': return { ...state, [action.key]: state[action.key].filter(item => item._id !== action.id) };
    default: return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const set = (key, value) => dispatch({ type: 'SET', key, value });
  const setLoading = (key, value) => dispatch({ type: 'SET_LOADING', key, value });

  const withLoading = useCallback(async (key, fn) => {
    setLoading(key, true);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(key, false);
    }
  }, []);

  // ─── DEVELOPER ───────────────────────────────────────────
  const fetchSchools = useCallback(() =>
    withLoading('schools', async () => {
      const { data } = await developerAPI.getSchools();
      set('schools', data.schools || data);
    }), []);

  const createAdmin = useCallback(async (formData) => {
    const { data } = await developerAPI.createAdmin(formData);
    toast.success('Admin created successfully!');
    return data;
  }, []);

  const fetchAnalytics = useCallback(() =>
    withLoading('analytics', async () => {
      const { data } = await developerAPI.getAnalytics();
      set('analytics', data);
    }), []);

  const fetchAllUsers = useCallback(() =>
    withLoading('allUsers', async () => {
      const { data } = await developerAPI.getUsers();
      set('allUsers', data.users || data);
    }), []);

  // ─── ADMIN ───────────────────────────────────────────────
  const fetchClasses = useCallback(() =>
    withLoading('classes', async () => {
      const { data } = await adminAPI.getClasses();
      set('classes', data.classes || data);
    }), []);

  const createClass = useCallback(async (formData) => {
    const { data } = await adminAPI.createClass(formData);
    dispatch({ type: 'APPEND', key: 'classes', value: data.class || data });
    toast.success('Class created!');
    return data;
  }, []);

  const fetchStudents = useCallback(() =>
    withLoading('students', async () => {
      const { data } = await adminAPI.getStudents();
      set('students', data.students || data);
    }), []);

  const fetchTeachers = useCallback(() =>
    withLoading('teachers', async () => {
      const { data } = await adminAPI.getTeachers();
      set('teachers', data.teachers || data);
    }), []);

  const createPrincipal = useCallback(async (formData) => {
    const { data } = await adminAPI.createPrincipal(formData);
    toast.success('Principal created!');
    return data;
  }, []);

  const assignTeacher = useCallback(async (formData) => {
    const { data } = await adminAPI.assignTeacher(formData);
    toast.success('Teacher assigned!');
    return data;
  }, []);

  const fetchSessions = useCallback(() =>
    withLoading('sessions', async () => {
      const { data } = await adminAPI.getSessions();
      set('sessions', data.sessions || data);
    }), []);

  const createSession = useCallback(async (formData) => {
    const { data } = await adminAPI.createSession(formData);
    dispatch({ type: 'APPEND', key: 'sessions', value: data.session || data });
    toast.success('Session created!');
    return data;
  }, []);

  // ─── PRINCIPAL ───────────────────────────────────────────
  const registerStudent = useCallback(async (formData) => {
    const { data } = await principalAPI.registerStudent(formData);
    toast.success('Student registered!');
    return data;
  }, []);

  const fetchSchoolReports = useCallback(() =>
    withLoading('schoolReports', async () => {
      const { data } = await principalAPI.getSchoolReports();
      set('schoolReports', data);
    }), []);

  const approveResult = useCallback(async (resultId) => {
    await principalAPI.approveResults(resultId);
    toast.success('Result approved!');
  }, []);

  const sendAnnouncement = useCallback(async (formData) => {
    const { data } = await principalAPI.sendAnnouncement(formData);
    dispatch({ type: 'APPEND', key: 'announcements', value: data.announcement || data });
    toast.success('Announcement sent!');
    return data;
  }, []);

  // ─── TEACHER ─────────────────────────────────────────────
  const fetchAssignedClasses = useCallback(() =>
    withLoading('assignedClasses', async () => {
      const { data } = await teacherAPI.getAssignedClasses();
      set('assignedClasses', data.classes || data);
    }), []);

  const uploadAssignment = useCallback(async (formData) => {
    const { data } = await teacherAPI.uploadAssignment(formData);
    dispatch({ type: 'APPEND', key: 'assignments', value: data.assignment || data });
    toast.success('Assignment posted!');
    return data;
  }, []);

  const uploadResults = useCallback(async (formData) => {
    await teacherAPI.uploadResults(formData);
    toast.success('Results uploaded successfully!');
  }, []);

  const markAttendance = useCallback(async (formData) => {
    await teacherAPI.markAttendance(formData);
    toast.success('Attendance saved!');
  }, []);

  const fetchAssignments = useCallback(() =>
    withLoading('assignments', async () => {
      const { data } = await teacherAPI.getAssignments();
      set('assignments', data.assignments || data);
    }), []);

  // ─── STUDENT ─────────────────────────────────────────────
  const fetchMyResults = useCallback(() =>
    withLoading('myResults', async () => {
      const { data } = await studentAPI.getResults();
      set('myResults', data.results || data);
    }), []);

  const fetchMyAssignments = useCallback(() =>
    withLoading('myAssignments', async () => {
      const { data } = await studentAPI.getAssignments();
      set('myAssignments', data.assignments || data);
    }), []);

  const fetchMyAttendance = useCallback(() =>
    withLoading('myAttendance', async () => {
      const { data } = await studentAPI.getAttendance();
      set('myAttendance', data.attendance || data);
    }), []);

  const fetchMyAnnouncements = useCallback(() =>
    withLoading('myAnnouncements', async () => {
      const { data } = await studentAPI.getAnnouncements();
      set('myAnnouncements', data.announcements || data);
    }), []);

  const downloadReportCard = useCallback(async () => {
    const { data } = await studentAPI.downloadReportCard();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report-card.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report card downloaded!');
  }, []);

  const value = {
    ...state,
    // developer
    fetchSchools, createAdmin, fetchAnalytics, fetchAllUsers,
    // admin
    fetchClasses, createClass, fetchStudents, fetchTeachers,
    createPrincipal, assignTeacher, fetchSessions, createSession,
    // principal
    registerStudent, fetchSchoolReports, approveResult, sendAnnouncement,
    // teacher
    fetchAssignedClasses, uploadAssignment, uploadResults, markAttendance, fetchAssignments,
    // student
    fetchMyResults, fetchMyAssignments, fetchMyAttendance, fetchMyAnnouncements, downloadReportCard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
