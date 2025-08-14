#!/bin/bash

# Production Build Script for Vercel Deployment
echo "🚀 Starting production build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf client/dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build client
echo "🔨 Building client..."
npm run build:client

# Build server
echo "🔨 Building server..."
npm run build:server

# Verify builds
echo "✅ Verifying builds..."
if [ -d "client/dist" ]; then
    echo "✅ Client build successful"
else
    echo "❌ Client build failed"
    exit 1
fi

if [ -d "dist" ]; then
    echo "✅ Server build successful"
else
    echo "❌ Server build failed"
    exit 1
fi

echo "🎉 Production build completed successfully!"
echo "📁 Build output:"
echo "   - Client: client/dist/"
echo "   - Server: dist/"
echo "🚀 Ready for Vercel deployment!"


