// User and Authentication types
export type UserRole = 'super_admin' | 'school_admin' | 'principal' | 'vice_principal' | 'secretary' | 'instructor' | 'staff' | 'student' | 'parent';

export type Gender = 'male' | 'female' | 'other';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type ResultStatus = 'draft' | 'published' | 'finalized';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  schoolId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
}

export interface School {
  id: string;
  name: string;
  abbreviation: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  logo?: string;
  website?: string;
  active: boolean;
  subscriptionStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  registrationNumber: string;
  classId: string;
  dateOfBirth: string;
  gender: Gender;
  parentId?: string;
  documents?: string[];
  enrollmentDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Staff {
  id: string;
  userId: string;
  employeeId: string;
  departmentId: string;
  designation: string;
  dateOfJoining: string;
  qualifications?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  abbreviation: string;
  level: string;
  classTutorId?: string;
  capacity: number;
  currentEnrollment: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  credits: number;
  instructorId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  score: number;
  grade: string;
  gradePoint: number;
  academicTermId: string;
  uploadedBy: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  groupId?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
