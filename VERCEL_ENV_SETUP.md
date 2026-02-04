# 🔧 Vercel Environment Variables Setup

## 🚨 CRITICAL: Backend Not Working Without These Variables

Your site is live but the backend (database, authentication, images) won't work until you add environment variables.

## 📋 **Step-by-Step Setup**

### **1. Go to Vercel Dashboard**
**Direct Link**: https://vercel.com/nishants-projects-a4179263/jewelry-store/settings/environment-variables

### **2. Add Each Variable (Click "Add New" for each)**

```
Name: DATABASE_URL
Value: postgresql://postgres:cdpNiWbyjpprPeum@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXTAUTH_SECRET  
Value: OGZ41CYi2hetsVBU6Fy21SayJdiH9b2VZvSO438TrWQ=
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXTAUTH_URL
Value: https://jewelry-store-henna-kappa.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development

Name: CLOUDINARY_CLOUD_NAME
Value: dq5jirrmj
Environments: ✅ Production ✅ Preview ✅ Development

Name: CLOUDINARY_API_KEY
Value: 324662196294239
Environments: ✅ Production ✅ Preview ✅ Development

Name: CLOUDINARY_API_SECRET
Value: xwfjCYCDYd-_0UgzpQKRey-ZEf0
Environments: ✅ Production ✅ Preview ✅ Development

Name: CLOUDINARY_URL
Value: cloudinary://324662196294239:xwfjCYCDYd-_0UgzpQKRey-ZEf0@dq5jirrmj
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dq5jirrmj
Environments: ✅ Production ✅ Preview ✅ Development

Name: ADMIN_EMAIL
Value: admin@ekaashi.com
Environments: ✅ Production ✅ Preview ✅ Development

Name: ADMIN_PASSWORD
Value: admin123
Environments: ✅ Production ✅ Preview ✅ Development
```

### **3. After Adding All Variables**
- The page will show "10 Environment Variables" 
- Tell me when done and I'll redeploy the application
- Or click "Redeploy" in the Vercel dashboard

### **4. Test Backend Connection**
After redeployment, test:
- **Health Check**: https://jewelry-store-henna-kappa.vercel.app/api/health
- **Admin Login**: https://jewelry-store-henna-kappa.vercel.app/auth/signin
- **Products**: https://jewelry-store-henna-kappa.vercel.app/products

## 🎯 **What Will Work After Setup**
- ✅ Database connection (products, orders, users)
- ✅ User authentication and registration  
- ✅ Admin panel access
- ✅ Image uploads in admin
- ✅ Shopping cart and checkout
- ✅ Order placement and tracking

## 🚨 **Current Status**
- ✅ Frontend: Working (static pages load)
- ❌ Backend: Not working (needs environment variables)
- ❌ Database: Not connected
- ❌ Authentication: Not working
- ❌ Admin Panel: Not accessible

**Fix: Add environment variables → Redeploy → Everything works! 🚀**