# Ekaashi Jewelry Store - Vercel Deployment Script (PowerShell)
# Run this script to deploy your application to Vercel

Write-Host "🚀 Ekaashi Jewelry Store - Vercel Deployment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the jewelry-store directory." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Run build test
Write-Host "🔨 Testing build locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix the errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check environment variables
Write-Host "🔍 Checking environment variables..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found. Make sure to set environment variables in Vercel dashboard." -ForegroundColor Yellow
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Post-deployment checklist:" -ForegroundColor Cyan
    Write-Host "1. ✅ Set environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "2. ✅ Update NEXTAUTH_URL with your deployment URL" -ForegroundColor White
    Write-Host "3. ✅ Test the application at your Vercel URL" -ForegroundColor White
    Write-Host "4. ✅ Test admin login at /admin" -ForegroundColor White
    Write-Host "5. ✅ Check API health at /api/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Useful links:" -ForegroundColor Cyan
    Write-Host "   • Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   • Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables" -ForegroundColor White
    Write-Host "   • Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Your Ekaashi Jewelry Store is now LIVE!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed! Check the error messages above." -ForegroundColor Red
    exit 1
}