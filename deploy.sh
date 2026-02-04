#!/bin/bash

# Ekaashi Jewelry Store - Vercel Deployment Script
# Run this script to deploy your application to Vercel

echo "🚀 Ekaashi Jewelry Store - Vercel Deployment"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the jewelry-store directory."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Run build test
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check environment variables
echo "🔍 Checking environment variables..."

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure to set environment variables in Vercel dashboard."
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "1. ✅ Set environment variables in Vercel dashboard"
    echo "2. ✅ Update NEXTAUTH_URL with your deployment URL"
    echo "3. ✅ Test the application at your Vercel URL"
    echo "4. ✅ Test admin login at /admin"
    echo "5. ✅ Check API health at /api/health"
    echo ""
    echo "🔗 Useful links:"
    echo "   • Vercel Dashboard: https://vercel.com/dashboard"
    echo "   • Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables"
    echo "   • Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains"
    echo ""
    echo "🎯 Your Ekaashi Jewelry Store is now LIVE!"
else
    echo "❌ Deployment failed! Check the error messages above."
    exit 1
fi