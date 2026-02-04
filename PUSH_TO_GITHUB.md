# 🚀 Push to GitHub Instructions

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Repository name: `ekaashi-jewelry-store`
4. Description: `Professional jewelry e-commerce store built with Next.js 16 - Production ready with admin dashboard, authentication, and full shopping experience`
5. Make it **Public**
6. **Don't initialize** with README, .gitignore, or license
7. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ekaashi-jewelry-store.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

Your repository should now contain all 89 files including:
- ✅ Complete source code
- ✅ Deployment guides
- ✅ Configuration files
- ✅ Documentation

## Step 4: Deploy to Vercel

Once pushed to GitHub, you can deploy to Vercel:

### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ekaashi-jewelry-store)

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option C: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import Project → Select your GitHub repository
3. Deploy

## Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:cdpNiWbyjpprPeum@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres

NEXTAUTH_SECRET=generate-new-secret-for-production
NEXTAUTH_URL=https://your-project-name.vercel.app

CLOUDINARY_CLOUD_NAME=dq5jirrmj
CLOUDINARY_API_KEY=324662196294239
CLOUDINARY_API_SECRET=xwfjCYCDYd-_0UgzpQKRey-ZEf0
CLOUDINARY_URL=cloudinary://324662196294239:xwfjCYCDYd-_0UgzpQKRey-ZEf0@dq5jirrmj
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dq5jirrmj

ADMIN_EMAIL=admin@ekaashi.com
ADMIN_PASSWORD=admin123
```

**⚠️ Important**: 
- Generate new NEXTAUTH_SECRET: `openssl rand -base64 32`
- Update NEXTAUTH_URL with your actual Vercel URL