# Quick Deploy Script for Vercel (Windows PowerShell)
# Run this script to deploy your ClientConnect app to Vercel

Write-Host "🚀 ClientConnect Vercel Deployment Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in
try {
    $userInfo = vercel whoami
    Write-Host "✅ Logged in as: $userInfo" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel. Please login first." -ForegroundColor Red
    Write-Host "Running: vercel login" -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed. Please try again manually." -ForegroundColor Red
        exit 1
    }
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "This will deploy to production. Continue? (y/N)" -ForegroundColor Cyan
$response = Read-Host

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Deploying to production..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "Deploying to preview..." -ForegroundColor Yellow
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Check your Vercel dashboard for the deployment URL." -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
    Write-Host "You can also check the Vercel dashboard for more details." -ForegroundColor Yellow
}

Write-Host "`n📋 Post-deployment checklist:" -ForegroundColor Cyan
Write-Host "1. Test your API endpoints" -ForegroundColor White
Write-Host "2. Verify database connectivity" -ForegroundColor White
Write-Host "3. Test authentication flow" -ForegroundColor White
Write-Host "4. Check static assets loading" -ForegroundColor White
Write-Host "5. Monitor Vercel function logs" -ForegroundColor White

Write-Host "`n🔗 Useful links:" -ForegroundColor Cyan
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "- Deployment Guide: ./DEPLOYMENT.md" -ForegroundColor White
Write-Host "- Deployment Checklist: ./DEPLOYMENT_CHECKLIST.md" -ForegroundColor White








