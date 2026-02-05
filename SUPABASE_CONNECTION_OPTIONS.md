# 🔧 Supabase Connection Options for Vercel

## 🎯 **Try These Connection Strings in Order**

### **Option 1: Connection Pooling (Best for Production)**
```
postgresql://postgres.cmxizfmakmsrtkyhvmpu:COCvDianjrcvlg9d@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### **Option 2: Direct Connection with SSL**
```
postgresql://postgres:COCvDianjrcvlg9d@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres?sslmode=require
```

### **Option 3: Direct Connection with Pooling Parameters**
```
postgresql://postgres:COCvDianjrcvlg9d@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres?sslmode=require&pgbouncer=true&connection_limit=1
```

### **Option 4: Extended Parameters**
```
postgresql://postgres:COCvDianjrcvlg9d@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres?sslmode=require&connect_timeout=60&statement_timeout=60000&idle_in_transaction_session_timeout=60000
```

### **Option 5: Minimal Connection**
```
postgresql://postgres:COCvDianjrcvlg9d@db.cmxizfmakmsrtkyhvmpu.supabase.co:5432/postgres?sslmode=disable
```

## 🔍 **How to Test Each Option**

1. **Update DATABASE_URL in Vercel** with one of the options above
2. **Redeploy** the application
3. **Test** by visiting: https://jewelry-store-henna-kappa.vercel.app/products
4. **If products show up** → Success! ✅
5. **If still "No products available"** → Try next option

## 📋 **Supabase Dashboard Checklist**

### **Check These in Your Dashboard:**

1. **Database Status**
   - [ ] Database is active (not paused)
   - [ ] No connection limit warnings
   - [ ] No billing issues

2. **Connection Settings**
   - [ ] Copy the exact connection pooling URL
   - [ ] Verify the password matches: `COCvDianjrcvlg9d`
   - [ ] Check if SSL is required

3. **Database Schema**
   - [ ] Go to Table Editor
   - [ ] Check if tables exist (User, Product, Category, etc.)
   - [ ] If no tables, we need to run migrations

## 🚀 **Quick Test Commands**

### **Test in Supabase SQL Editor:**
```sql
-- Test basic connection
SELECT 1 as test;

-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count products (if table exists)
SELECT COUNT(*) FROM "Product";
```

## 🎯 **Most Likely Solutions**

### **Solution A: Use Connection Pooling URL**
- Get the pooling URL from Supabase dashboard
- Replace the host and port with pooling endpoint

### **Solution B: Database Schema Missing**
- Tables might not exist in the database
- Need to run `npx prisma db push` equivalent

### **Solution C: Database Paused**
- Supabase free tier pauses after inactivity
- Just accessing the dashboard should wake it up

## 📞 **What I Need From You**

1. **Go to Supabase dashboard** and tell me:
   - Is the database active?
   - Do you see a "Connection Pooling" section?
   - What's the exact connection pooling URL?

2. **Try Option 1 first** (connection pooling URL)

3. **If that doesn't work**, we'll try the others in order

**Let's get your Supabase connection working! 🚀**