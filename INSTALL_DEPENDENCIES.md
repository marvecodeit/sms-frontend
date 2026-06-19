# ⚠️ DEPENDENCY INSTALLATION - QUICK FIX

## The Issue
The error: `Failed to resolve import "react-toastify"`

This means npm dependencies weren't fully installed in the `node_modules` folder.

---

## 🔧 QUICK FIX (Choose ONE method)

### Method 1: Automatic Clean Install (RECOMMENDED)
```bash
# In Windows, just double-click this file:
frontend/clean-install.bat
```

This will:
- Remove old node_modules folder
- Remove package-lock.json
- Do a fresh npm install
- Install all dependencies correctly

Then run the system normally:
```bash
# Double-click to start:
START-ALL.bat
```

---

### Method 2: Manual Command Line
Open Command Prompt or PowerShell in the frontend folder and run:

```bash
# Navigate to frontend folder
cd frontend

# Option A: Quick install missing packages
npm install

# Option B: Full clean reinstall (if Option A doesn't work)
npm install
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Method 3: Install Only Missing Package
If you just want to install react-toastify:
```bash
cd frontend
npm install react-toastify
```

---

## ✅ VERIFY FIX

After installation, verify:
```bash
# Check if react-toastify is installed
npm list react-toastify

# You should see: react-toastify@10.0.5
```

---

## 🚀 THEN START THE SYSTEM

After dependencies are installed:

```bash
# Windows - Double-click:
START-ALL.bat

# Or manually:
# Terminal 1:
cd backend
npm start

# Terminal 2:
cd frontend
npm run dev
```

---

## ✨ That's it!

Once dependencies are installed, everything should work perfectly!

Access: http://localhost:5173

---

**Issue**: Dependencies not installed  
**Solution**: Run clean-install.bat or npm install  
**Time**: 2-3 minutes
