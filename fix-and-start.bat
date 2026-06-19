@echo off
REM Quick fix script to remove TypeScript config conflicts

cd /d "%~dp0"

echo Removing TypeScript config files that require ts-node...
echo.

if exist "postcss.config.ts" (
    del postcss.config.ts
    echo ✓ Removed postcss.config.ts
)

if exist "tailwind.config.ts" (
    del tailwind.config.ts
    echo ✓ Removed tailwind.config.ts
)

if exist "next.config.ts" (
    del next.config.ts
    echo ✓ Removed next.config.ts
)

if exist "tsconfig.json" (
    echo ! Note: Keeping tsconfig.json (not causing issues)
)

echo.
echo ✓ Config files cleaned!
echo.
echo Now starting Vite...
echo.

npm run dev

pause
