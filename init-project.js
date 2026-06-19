#!/usr/bin/env node

/**
 * SMS Frontend - Automated Project Initialization
 * This script generates the complete folder structure and all necessary files
 */

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

// Define directory structure
const dirs = [
  'app',
  'app/(auth)',
  'app/(auth)/login',
  'app/(auth)/forgot-password',
  'app/(auth)/reset-password',
  'app/(auth)/otp-verify',
  'app/(dashboard)',
  'app/(dashboard)/super-admin',
  'app/(dashboard)/students',
  'app/(dashboard)/students/[id]',
  'app/(dashboard)/students/new',
  'app/(dashboard)/staff',
  'app/(dashboard)/staff/[id]',
  'app/(dashboard)/results',
  'app/(dashboard)/chat',
  'app/(dashboard)/notifications',
  'app/(dashboard)/settings',
  'components/ui',
  'components/layout',
  'components/forms',
  'components/common',
  'features/auth/hooks',
  'features/auth/services',
  'features/auth/components',
  'features/dashboard',
  'features/students',
  'features/staff',
  'features/results',
  'features/chat',
  'features/notifications',
  'hooks',
  'lib',
  'services/api',
  'services/socket',
  'stores',
  'types',
  'utils',
  'config',
];

// Create directories
console.log('📁 Creating directory structure...');
dirs.forEach(dir => {
  const fullPath = path.join(srcPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ ${dir}`);
  }
});

console.log('\n✅ Project structure created!');
console.log('\n📋 Next steps:');
console.log('1. npm install');
console.log('2. Create .env.local from .env.example');
console.log('3. npm run dev');
console.log('\n🚀 Happy coding!');
