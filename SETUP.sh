#!/bin/bash

# School Management System (SMS) - Frontend Setup Script
# This script sets up the complete Next.js + TypeScript SMS frontend

# Project Structure
mkdir -p src/{app,components/{ui,layout,forms},features/{auth,dashboard,students,staff,results,chat,notifications},hooks,lib,services/{api,socket},stores,types,utils,config,styles}

# Create essential TypeScript files
cat > src/types/index.ts << 'EOF'
export type UserRole = 'super_admin' | 'school_admin' | 'principal' | 'vice_principal' | 'secretary' | 'instructor' | 'staff' | 'student' | 'parent';

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
}

export interface Student {
  id: string;
  userId: string;
  registrationNumber: string;
  classId: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
EOF

echo "✅ Project structure created successfully!"
echo "📦 Next step: npm install"
echo "🚀 Then run: npm run dev"
