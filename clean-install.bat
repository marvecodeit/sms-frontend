@echo off
REM Clean install of frontend dependencies
cd /d "%~dp0"

echo Removing old node_modules...
if exist "node_modules" rmdir /s /q node_modules

echo Removing package-lock.json...
if exist "package-lock.json" del package-lock.json

echo Installing fresh dependencies...
call npm install

echo.
echo ✅ Installation complete!
echo.
pause
