@echo off
REM Production Build Script for Vercel Deployment (Windows)
echo 🚀 Starting production build...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist client\dist rmdir /s /q client\dist

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci --only=production

REM Build client
echo 🔨 Building client...
call npm run build:client

REM Build server
echo 🔨 Building server...
call npm run build:server

REM Verify builds
echo ✅ Verifying builds...
if exist client\dist (
    echo ✅ Client build successful
) else (
    echo ❌ Client build failed
    exit /b 1
)

if exist dist (
    echo ✅ Server build successful
) else (
    echo ❌ Server build failed
    exit /b 1
)

echo 🎉 Production build completed successfully!
echo 📁 Build output:
echo    - Client: client\dist\
echo    - Server: dist\
echo 🚀 Ready for Vercel deployment!
pause



