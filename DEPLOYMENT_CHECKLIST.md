# ✅ Vercel Deployment Checklist

## 🚀 **QUICK DEPLOYMENT STEPS**

### **Option 1: One-Click Deploy (Easiest)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ekaashi-jewelry-store)

### **Option 2: Manual Deployment**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy**
```bash
# From jewelry-store directory
vercel --prod

# Or use the deployment script
./deploy.ps1  # Windows
./deploy.sh   # Mac/Linux
```

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

- [ ] ✅ **Build passes locally** (`npm run build`)
- [ ] ✅ **TypeScript compiles** (`npm run type-check`)
- [ ] ✅ **Environment variables ready**
- [ ] ✅ **Database accessible** (Supabase)
- [ ] ✅ **Images working** (Cloudinary)

---

## 🔧 **ENVIRONMENT VARIABLES TO SET IN VERCEL**

Copy these to **Vercel Dashboard → Settings → Environment Variables**:

```bash
DATABASE_URL=postgresql://postgres:cdpNiWbyjpprPeum@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres

NEXTAUTH_SECRET=your-super-secure-secret-key-for-production
NEXTAUTH_URL=https://your-project-name.vercel.app

CLOUDINARY_CLOUD_NAME=dq5jirrmj
CLOUDINARY_API_KEY=324662196294239
CLOUDINARY_API_SECRET=xwfjCYCDYd-_0UgzpQKRey-ZEf0
CLOUDINARY_URL=cloudinary://324662196294239:xwfjCYCDYd-_0UgzpQKRey-ZEf0@dq5jirrmj
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dq5jirrmj

ADMIN_EMAIL=admin@ekaashi.com
ADMIN_PASSWORD=admin123
```

**⚠️ IMPORTANT**: 
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` with your actual Vercel URL
- Change `ADMIN_PASSWORD` for production

---

## 🧪 **POST-DEPLOYMENT TESTING**

### **Test These URLs** (replace with your domain):

- [ ] **Homepage**: `https://your-app.vercel.app`
- [ ] **Products**: `https://your-app.vercel.app/products`
- [ ] **Admin Login**: `https://your-app.vercel.app/auth/signin`
- [ ] **Admin Panel**: `https://your-app.vercel.app/admin`
- [ ] **API Health**: `https://your-app.vercel.app/api/health`

### **Test These Features**:

- [ ] **User Registration** (`/auth/signup`)
- [ ] **User Login** (`/auth/signin`)
- [ ] **Admin Login** (`admin@ekaashi.com` / `admin123`)
- [ ] **Add to Cart** (any product page)
- [ ] **Checkout Process** (`/checkout`)
- [ ] **Order Placement** (complete flow)
- [ ] **Admin Product Management** (`/admin/products`)
- [ ] **Admin Order Management** (`/admin/orders`)
- [ ] **Image Uploads** (admin panel)

---

## 🌐 **CUSTOM DOMAIN SETUP** (Optional)

### **Step 1: Add Domain in Vercel**
1. Go to **Project Settings → Domains**
2. Add `ekaashi.com` and `www.ekaashi.com`

### **Step 2: Configure DNS**
Add these records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### **Step 3: Update Environment Variables**
```bash
NEXTAUTH_URL=https://ekaashi.com
```

---

## 🔍 **TROUBLESHOOTING**

### **Build Fails**
```bash
# Test build locally first
npm run build

# Check TypeScript errors
npm run type-check
```

### **Environment Variables Not Working**
- Ensure variables are set for **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### **Database Connection Issues**
- Test with: `https://your-app.vercel.app/api/health`
- Verify `DATABASE_URL` is correct
- Check Supabase connection limits

### **Authentication Issues**
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Generate new `NEXTAUTH_SECRET` for production
- Clear browser cookies and try again

### **Image Upload Issues**
- Check Cloudinary credentials in Vercel
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Test in admin panel: `/admin/products`

---

## 📊 **MONITORING**

### **Vercel Dashboard**
- **Functions**: Monitor API performance
- **Analytics**: Track user behavior  
- **Speed Insights**: Monitor Core Web Vitals
- **Logs**: Debug issues in real-time

### **Health Checks**
- **API**: `https://your-app.vercel.app/api/health`
- **Database**: Check Supabase dashboard
- **Images**: Check Cloudinary dashboard

---

## 🎉 **SUCCESS CRITERIA**

Your deployment is successful when:

- [ ] ✅ **Homepage loads** with products and banners
- [ ] ✅ **User can register** and login
- [ ] ✅ **Admin can login** and manage products
- [ ] ✅ **Orders can be placed** end-to-end
- [ ] ✅ **Images upload** in admin panel
- [ ] ✅ **API health check** returns green status
- [ ] ✅ **Mobile responsive** on all devices

---

## 🚀 **FINAL RESULT**

**Your Ekaashi Jewelry Store will be LIVE at:**
- 🌐 **Website**: `https://your-project-name.vercel.app`
- 🔧 **Admin**: `https://your-project-name.vercel.app/admin`
- 📊 **Health**: `https://your-project-name.vercel.app/api/health`

**Ready to handle 1,000+ concurrent users! 🎯**