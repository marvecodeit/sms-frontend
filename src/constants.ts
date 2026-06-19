/**
 * Mock Data Generator and Constants
 * Use this for development and testing
 */

import type { User, Student, Staff, School, Class, Result, Notification } from '@/types';

// App constants
export const APP_NAME = 'School Management System';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Comprehensive platform for managing schools, students, staff, and academics';

// Grade thresholds (adjust as needed)
export const GRADE_THRESHOLDS = {
  A: 90,
  'A-': 85,
  B: 80,
  'B-': 75,
  C: 70,
  'C-': 65,
  D: 60,
  'D-': 55,
  E: 50,
  F: 0,
};

export function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B';
  if (score >= 75) return 'B-';
  if (score >= 70) return 'C';
  if (score >= 65) return 'C-';
  if (score >= 60) return 'D';
  if (score >= 55) return 'D-';
  if (score >= 50) return 'E';
  return 'F';
}

export function getGradePoint(grade: string): number {
  const gradePoints: Record<string, number> = {
    A: 4.0,
    'A-': 3.7,
    B: 3.3,
    'B-': 3.0,
    C: 2.7,
    'C-': 2.3,
    D: 2.0,
    'D-': 1.7,
    E: 1.3,
    F: 0,
  };
  return gradePoints[grade] || 0;
}

// Mock data generators
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Lisa',
  'Robert', 'Mary', 'William', 'Patricia', 'Richard', 'Jennifer', 'Joseph', 'Linda',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
];

const domains = ['school.edu', 'academy.edu', 'institution.edu', 'learning.edu'];

export function generateMockUser(
  role: string = 'student',
  schoolId: string = 'school-001'
): User {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    role: role as any,
    schoolId,
    active: true,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockStudent(
  schoolId: string = 'school-001',
  classId: string = 'class-001'
): Student {
  const user = generateMockUser('student', schoolId);
  const registrationNumber = `STD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    id: `student-${Math.random().toString(36).substr(2, 9)}`,
    userId: user.id,
    registrationNumber,
    classId,
    dateOfBirth: new Date(2005 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    gender: Math.random() > 0.5 ? 'male' : 'female',
    enrollmentDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user,
  };
}

export function generateMockStaff(
  schoolId: string = 'school-001',
  role: string = 'instructor'
): Staff {
  const user = generateMockUser(role, schoolId);
  const employeeId = `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    id: `staff-${Math.random().toString(36).substr(2, 9)}`,
    userId: user.id,
    employeeId,
    departmentId: `dept-${Math.floor(Math.random() * 5)}`,
    designation: role === 'instructor' ? 'Teacher' : 'Staff',
    dateOfJoining: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user,
  };
}

export function generateMockSchool(): School {
  return {
    id: `school-${Math.random().toString(36).substr(2, 9)}`,
    name: `${['St.', 'Holy', 'Central', 'North', 'South', 'East', 'West'][Math.floor(Math.random() * 7)]} ${['High', 'Secondary', 'Primary', 'Academy'][Math.floor(Math.random() * 4)]} School`,
    abbreviation: Math.random().toString(36).substr(2, 3).toUpperCase(),
    email: `info@${Math.random().toString(36).substr(2, 8)}.edu`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    address: `${Math.floor(Math.random() * 1000)} School Street`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Boston'][Math.floor(Math.random() * 6)],
    state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'MA'][Math.floor(Math.random() * 6)],
    country: 'USA',
    zipCode: `${Math.floor(Math.random() * 90000 + 10000)}`,
    active: true,
    subscriptionStatus: 'active',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockClass(schoolId: string = 'school-001'): Class {
  const levels = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const level = levels[Math.floor(Math.random() * levels.length)];

  return {
    id: `class-${Math.random().toString(36).substr(2, 9)}`,
    schoolId,
    name: `${level}`,
    abbreviation: level,
    level,
    capacity: 50,
    currentEnrollment: Math.floor(Math.random() * 50) + 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockResult(
  studentId: string = 'student-001',
  subjectId: string = 'subject-001'
): Result {
  const score = Math.floor(Math.random() * 100);
  const grade = getGrade(score);

  return {
    id: `result-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    subjectId,
    classId: 'class-001',
    score,
    grade,
    gradePoint: getGradePoint(grade),
    academicTermId: 'term-001',
    uploadedBy: 'user-001',
    comments: ['Excellent performance', 'Good work', 'Needs improvement', 'Average'][Math.floor(Math.random() * 4)],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockNotification(userId: string = 'user-001'): Notification {
  const titles = [
    'New Result Published',
    'Assignment Due Soon',
    'New Announcement',
    'Attendance Marked',
    'Fee Payment Due',
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];

  return {
    id: `notif-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    title,
    message: `You have a new ${title.toLowerCase()}`,
    type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
    read: Math.random() > 0.5,
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// Batch generators
export function generateMockUsers(count: number, role: string = 'student', schoolId: string = 'school-001'): User[] {
  return Array.from({ length: count }, () => generateMockUser(role, schoolId));
}

export function generateMockStudents(count: number, schoolId: string = 'school-001', classId: string = 'class-001'): Student[] {
  return Array.from({ length: count }, () => generateMockStudent(schoolId, classId));
}

export function generateMockNotifications(count: number, userId: string = 'user-001'): Notification[] {
  return Array.from({ length: count }, () => generateMockNotification(userId));
}

// Statistics helpers
export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function calculateGPA(results: Result[]): number {
  if (results.length === 0) return 0;
  const totalPoints = results.reduce((sum, r) => sum + r.gradePoint, 0);
  return totalPoints / results.length;
}

export function getAttendancePercentage(presentDays: number, totalDays: number): number {
  if (totalDays === 0) return 0;
  return (presentDays / totalDays) * 100;
}

// Demo credentials (for login forms)
export const DEMO_CREDENTIALS = [
  {
    role: 'Super Admin',
    email: 'super@sms.edu',
    password: 'SuperAdmin@123',
  },
  {
    role: 'School Admin',
    email: 'admin@school.edu',
    password: 'SchoolAdmin@123',
  },
  {
    role: 'Principal',
    email: 'principal@school.edu',
    password: 'Principal@123',
  },
  {
    role: 'Teacher',
    email: 'teacher@school.edu',
    password: 'Teacher@123',
  },
  {
    role: 'Student',
    email: 'student@school.edu',
    password: 'Student@123',
  },
];

// Feature flags for development
export const DEV_FLAGS = {
  SHOW_DEMO_DATA: true,
  USE_MOCK_API: false,
  ENABLE_LOGGING: true,
  SHOW_PERFORMANCE_METRICS: false,
};
