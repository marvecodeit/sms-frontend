# 🔌 API Integration Guide - School Management System

## Current Status: 2/5 Feature Modules Complete ✅

---

## ✅ CONNECTED MODULES

### 1. Authentication API ✅
**File**: `src/api/auth.api.js`

```javascript
// All 5 login methods working
loginDeveloper({ email, password })
loginAdmin({ email, password })
loginPrincipal({ email, password })
loginTeacher({ email, password })
loginStudent({ email, password })
```

**Usage in Context**:
```javascript
const { loginAdmin } = useAuth();
await loginAdmin({ email: 'admin@school.com', password: 'pass123' });
```

---

### 2. Admin Management API ✅
**File**: `src/api/admin.api.js`

```javascript
// Class Management
getClasses()                              // GET /admin/classes
createClass({ name, section, capacity }) // POST /admin/create-class
updateClass(id, data)                    // PUT /admin/classes/{id}
deleteClass(id)                          // DELETE /admin/classes/{id}

// Teacher Management
getAllTeachers()                          // GET /admin/teachers
assignTeacherToClass({ classId, teacherId }) // PUT /admin/assign-teacher
```

**Usage in Components**:
```javascript
import adminAPI from 'src/api/admin.api';

// Get all classes
const classes = await adminAPI.getClasses();

// Create class
const newClass = await adminAPI.createClass({
  name: 'Class 1A',
  section: 'A',
  capacity: 30
});

// Assign teacher
await adminAPI.assignTeacherToClass({
  classId: 'class-123',
  teacherId: 'teacher-456'
});
```

---

### 3. Principal Management API ✅ (Partial)
**File**: `src/api/principal.api.js`

```javascript
// Student Management
getStudents()                                 // GET /students/all
createStudent({ name, email, phone })        // POST /students/create
updateStudent(id, data)                      // PUT /students/{id}
assignStudentToClass({ studentId, classId }) // POST /students/assign-to-class
getStudentsByClass(classId)                  // GET /classes/{classId}/students

// Results Management (Scaffolded - Needs Implementation)
getPendingResults()                   // GET /approval/pending
approveResult(resultId)               // POST /approval/approve
rejectResult(resultId, { reason })    // POST /approval/reject

// Report Generation (Scaffolded)
generateBroadsheet(classId, term)     // POST /broadsheet/generate
generateCumulative(studentId)         // POST /cumulative/generate
```

---

## ⏳ PENDING MODULES (Ready to Connect)

### 4. Teacher API ⏳
**File**: `src/api/teacher.api.js`

**Endpoints to Implement**:
```javascript
// Results
uploadResults(formData)           // POST /results/upload (multipart)

// Assignments
uploadAssignment(formData)        // POST /teacher/assignment (multipart)

// Attendance
markAttendance({                  // POST /teacher/attendance
  date,
  classId,
  students: [{ studentId, status }]
})
```

**Implementation Template**:
```javascript
const uploadResults = async (formData) => {
  try {
    const { data } = await apiClient.post('/results/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    throw error;
  }
};
```

---

### 5. Student API ⏳
**File**: `src/api/student.api.js`

**Endpoints to Implement**:
```javascript
// Results
getResults()                      // GET /student/results

// Assignments
getAssignments()                  // GET /student/assignments

// Attendance
getAttendance()                   // GET /student/attendance

// Reports
downloadReportCard(term)          // POST /report/generate (returns PDF)
```

---

## 🔧 HOW TO INTEGRATE NEW ENDPOINTS

### Step 1: Add to API File
```javascript
// src/api/teacher.api.js
import apiClient from './axios';

const teacherAPI = {
  uploadResults: async (formData) => {
    const { data } = await apiClient.post('/results/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  
  markAttendance: async (attendanceData) => {
    const { data } = await apiClient.post('/teacher/attendance', attendanceData);
    return data;
  }
};

export default teacherAPI;
```

### Step 2: Use in Component
```javascript
// src/pages/teacher/UploadResults.jsx
import { useState } from 'react';
import teacherAPI from 'src/api/teacher.api';
import { toast } from 'react-toastify';

function UploadResults() {
  const [loading, setLoading] = useState(false);
  
  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', 'class-123');
      
      await teacherAPI.uploadResults(formData);
      toast.success('Results uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

export default UploadResults;
```

---

## 📊 Response Format Expectations

### Success Response (200)
```javascript
{
  success: true,
  data: { /* actual data */ },
  message: "Operation successful"
}
```

### Error Response (400/500)
```javascript
{
  success: false,
  message: "Error description",
  errors: { /* field errors */ }
}
```

### Authentication Response (200)
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "user-123",
    email: "user@school.com",
    role: "teacher",
    name: "John Doe"
  }
}
```

---

## ✨ Request Examples

### Authentication
```javascript
// POST /auth/teacher/login
{
  "email": "teacher@school.com",
  "password": "securePassword123"
}
```

### Create Class
```javascript
// POST /admin/create-class
{
  "name": "Class 1A",
  "section": "A",
  "capacity": 30,
  "subjects": ["Math", "Science", "English"]
}
```

### Create Student
```javascript
// POST /students/create
{
  "name": "John Student",
  "email": "john@school.com",
  "phone": "1234567890",
  "dateOfBirth": "2010-05-15"
}
```

### Upload Results (Excel)
```javascript
// POST /results/upload (multipart/form-data)
FormData:
  - file: <Excel file>
  - classId: "class-123"
  - term: 1
```

### Mark Attendance
```javascript
// POST /teacher/attendance
{
  "date": "2024-01-15",
  "classId": "class-123",
  "students": [
    { "studentId": "student-1", "status": "present" },
    { "studentId": "student-2", "status": "absent" },
    { "studentId": "student-3", "status": "leave" }
  ]
}
```

---

## 🔐 Security Headers (Auto-Injected)

All requests automatically include:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

The Axios interceptor in `src/api/axios.js` handles this automatically.

---

## 🚨 Error Handling Pattern

```javascript
import { toast } from 'react-toastify';

try {
  const result = await someAPI.doSomething();
} catch (error) {
  // Network error
  if (!error.response) {
    toast.error('Connection failed. Check your internet.');
    return;
  }
  
  // Server error
  const message = error.response?.data?.message || 'Operation failed';
  toast.error(message);
  
  // Handle specific status codes
  if (error.response?.status === 401) {
    // Token expired - will be handled by axios interceptor
  } else if (error.response?.status === 403) {
    toast.error('You do not have permission for this action');
  } else if (error.response?.status === 400) {
    // Validation error
    console.log(error.response?.data?.errors);
  }
}
```

---

## 📝 Checklist for Completing Remaining Features

### Results Upload Module
- [ ] Create `src/pages/teacher/UploadResults.jsx`
- [ ] Implement file upload with drag-drop
- [ ] Add file preview before upload
- [ ] Show upload progress bar
- [ ] Call `teacherAPI.uploadResults()`
- [ ] Handle success/error responses

### Results Approval Module
- [ ] Create `src/pages/principal/ResultsApproval.jsx`
- [ ] Fetch pending results: `principalAPI.getPendingResults()`
- [ ] Display in table with pagination
- [ ] Add Approve button: `principalAPI.approveResult()`
- [ ] Add Reject button: `principalAPI.rejectResult()`
- [ ] Real-time table refresh

### Attendance Module
- [ ] Create `src/pages/teacher/MarkAttendance.jsx`
- [ ] Date picker for attendance date
- [ ] Checkbox list of students
- [ ] Status selector (Present/Absent/Leave)
- [ ] Call `teacherAPI.markAttendance()`

### Assignment Module
- [ ] Create `src/pages/teacher/UploadAssignment.jsx`
- [ ] Title + Due date + File upload
- [ ] Call `teacherAPI.uploadAssignment()`
- [ ] Create `src/pages/student/ViewAssignments.jsx`
- [ ] Fetch and display: `studentAPI.getAssignments()`
- [ ] Download link per assignment

### Report Generation Module
- [ ] Create `src/pages/principal/GenerateBroadsheet.jsx`
- [ ] Class + Term selector
- [ ] Call `principalAPI.generateBroadsheet()`
- [ ] Create `src/pages/student/DownloadReportCard.jsx`
- [ ] Term selector
- [ ] Call `studentAPI.downloadReportCard()`
- [ ] Handle PDF download

---

## 🧪 Testing API Endpoints

### Using Browser Console
```javascript
// Import API
import authAPI from 'src/api/auth.api';
import adminAPI from 'src/api/admin.api';

// Test login
await authAPI.loginAdmin({
  email: 'admin@school.com',
  password: 'password123'
});

// Test get classes
const classes = await adminAPI.getClasses();
console.log(classes);
```

### Using Postman
1. Set base URL: `http://localhost:5000/api`
2. Set Authorization header: `Bearer {token}`
3. Test each endpoint before building UI

---

## 📞 Debugging Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] CORS enabled on backend
- [ ] JWT token being stored in localStorage
- [ ] Token attached to requests (check Network tab)
- [ ] Response format matches expected structure
- [ ] Error messages displaying in toast notifications
- [ ] Loading spinners showing during API calls
- [ ] Role-based access control working

---

**Last Updated**: 2024-01-XX  
**API Base URL**: http://localhost:5000/api  
**Frontend URL**: http://localhost:5173
