import apiClient from '@/api-client';
import type { Student, ApiResponse, PaginatedResponse } from '@/types';

interface CreateStudentRequest {
  userId: string;
  registrationNumber: string;
  classId: string;
  dateOfBirth: string;
  gender: string;
  parentId?: string;
}

interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

interface StudentFilters {
  classId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class StudentService {
  async getStudents(filters?: StudentFilters) {
    const params = new URLSearchParams();
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Student>>>(
      '/students',
      { params }
    );
    return response.data.data!;
  }

  async getStudent(id: string): Promise<Student> {
    const response = await apiClient.get<ApiResponse<Student>>(
      `/students/${id}`
    );
    return response.data.data!;
  }

  async createStudent(data: CreateStudentRequest): Promise<Student> {
    const response = await apiClient.post<ApiResponse<Student>>(
      '/students',
      data
    );
    return response.data.data!;
  }

  async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await apiClient.put<ApiResponse<Student>>(
      `/students/${id}`,
      data
    );
    return response.data.data!;
  }

  async deleteStudent(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/students/${id}`
    );
    return response.data.data!;
  }

  async getStudentResults(studentId: string) {
    const response = await apiClient.get(
      `/students/${studentId}/results`
    );
    return response.data.data;
  }

  async getStudentAttendance(studentId: string, classId: string) {
    const response = await apiClient.get(
      `/students/${studentId}/attendance`,
      { params: { classId } }
    );
    return response.data.data;
  }

  async getStudentDocuments(studentId: string) {
    const response = await apiClient.get(
      `/students/${studentId}/documents`
    );
    return response.data.data;
  }

  async uploadStudentDocument(studentId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `/students/${studentId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  async generateStudentEmail(
    firstName: string,
    registrationNumber: string,
    classAbbr: string
  ): Promise<string> {
    return `${firstName.toLowerCase()}${registrationNumber}${classAbbr}@school.edu`;
  }

  async bulkCreateStudents(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/students/bulk-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }
}

export const studentService = new StudentService();
