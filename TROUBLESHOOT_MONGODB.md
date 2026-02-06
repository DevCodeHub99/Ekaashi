# 🔧 MongoDB Connection Troubleshooting

## You've Already Added 0.0.0.0/0 - What's Next?

Since you've already configured Network Access, let's check other potential issues:

---

## ✅ Step 1: Verify MongoDB Cluster Status

### Check if Cluster is Active:
1. Go to: https://cloud.mongodb.com
2. Click **"Database"** in left sidebar
3. Look at your cluster (Cluster0)
4. Status should show: **"Active"** (green)

### If Status Shows "Paused":
1. Click **"Resume"** button
2. Wait 2-3 minutes for cluster to start
3. Then redeploy Vercel

---

## ✅ Step 2: Verify Network Access Configuration

### Double-check the IP whitelist:
1. Go to: https://cloud.mongodb.com
2. Click **"Network Access"** (left sidebar, under Security)
3. You should see an entry with:
   - **IP Address**: `0.0.0.0/0`
   - **Status**: Active (green checkmark)
   - **Comment**: Something like "Allow from anywhere"

### If Status is "Pending":
- Wait 1-2 minutes for it to activate
- Refresh the page
- Should turn green

### If Entry Doesn't Exist:
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- Confirm

---

## ✅ Step 3: Verify DATABASE_URL in Vercel

### Check Environment Variable:
1. Go to: https://vercel.com/nishants-projects-a4179263/jewelry-store/settings/environment-variables
2. Find **DATABASE_URL**
3. Should be set to:
```
mongodb+srv://ekaashidotcom_db_user:4CASKf9QodzEaEUu@cluster0.kyrejnj.mongodb.net/ekaashi-jewelry?retryWrites=true&w=majority&appName=Cluster0
```

### If Missing or Wrong:
1. Click **"Edit"** or **"Add"**
2. Name: `DATABASE_URL`
3. Value: (paste the connection string above)
4. Environment: **Production**, **Preview**, **Development** (check all)
5. Click **"Save"**

---

## ✅ Step 4: Clear Vercel Build Cache

Sometimes Vercel caches old Prisma client with wrong connection:

1. Go to: https://vercel.com/nishants-projects-a4179263/jewelry-store/settings/general
2. Scroll to **"Build & Development Settings"**
3. Look for **"Clear Build Cache"** or similar option
4. Click it
5. Confirm

---

## ✅ Step 5: Force Redeploy

### Method 1: Redeploy Latest
1. Go to: https://vercel.com/nishants-projects-a4179263/jewelry-store
2. Click **"Deployments"** tab
3. Find the latest deployment
4. Click **three dots (...)** menu
5. Click **"Redeploy"**
6. Make sure **"Use existing Build Cache"** is **UNCHECKED**
7. Click **"Redeploy"**

### Method 2: Push New Commit
1. Make a small change (add a space to README.md)
2. Commit and push to GitHub
3. Vercel will auto-deploy

---

## ✅ Step 6: Test Connection After Redeploy

### Wait for deployment to complete (2-3 minutes), then:

1. Visit: https://ekaashi-com.vercel.app/api/check-connection
2. Should show: ✅ **"Database connection is working!"**

### If Still Showing Error:
- Check the error message carefully
- Look for specific error codes
- Continue to Step 7

---

## ✅ Step 7: Check MongoDB User Permissions

### Verify Database User:
1. Go to: https://cloud.mongodb.com
2. Click **"Database Access"** (left sidebar, under Security)
3. Find user: `ekaashidotcom_db_user`
4. Should have:
   - **Role**: `readWriteAnyDatabase` or `Atlas admin`
   - **Status**: Active

### If User Doesn't Exist or Wrong Permissions:
1. Click **"Edit"** on the user
2. Under **"Database User Privileges"**:
   - Select **"Built-in Role"**
   - Choose **"Read and write to any database"**
3. Click **"Update User"**

---

## ✅ Step 8: Test Connection String Locally

### On your local machine:
```bash
cd jewelry-store
npm run dev
```

### Then visit:
```
http://localhost:3000/api/check-connection
```

### If Local Works but Vercel Doesn't:
- Issue is with Vercel configuration
- Double-check environment variables
- Try clearing build cache again

### If Local Also Fails:
- Issue is with MongoDB Atlas or connection string
- Check cluster status
- Check network access
- Check database user

---

## ✅ Step 9: Alternative - Create New Database User

Sometimes the user credentials get corrupted:

1. Go to: https://cloud.mongodb.com
2. Click **"Database Access"**
3. Click **"Add New Database User"**
4. Choose **"Password"** authentication
5. Username: `vercel_user`
6. Password: Click **"Autogenerate Secure Password"** (copy it!)
7. Database User Privileges: **"Read and write to any database"**
8. Click **"Add User"**

### Update Connection String:
Replace in Vercel environment variables:
```
mongodb+srv://vercel_user:YOUR_NEW_PASSWORD@cluster0.kyrejnj.mongodb.net/ekaashi-jewelry?retryWrites=true&w=majority&appName=Cluster0
```

---

## ✅ Step 10: Check MongoDB Atlas Logs

### View Connection Attempts:
1. Go to: https://cloud.mongodb.com
2. Click your cluster name
3. Click **"Metrics"** tab
4. Look for connection attempts
5. Check for failed authentication or connection errors

---

## 🎯 Common Issues & Solutions

### Issue: "Server selection timeout"
**Cause**: Network access not configured or cluster paused
**Solution**: 
- Add 0.0.0.0/0 to Network Access ✅ (You did this)
- Resume cluster if paused
- Wait 2 minutes after changes

### Issue: "Authentication failed"
**Cause**: Wrong username/password in DATABASE_URL
**Solution**: 
- Verify credentials in Database Access
- Check DATABASE_URL in Vercel matches exactly
- Try creating new database user

### Issue: "I/O error: received fatal alert: InternalError"
**Cause**: SSL/TLS handshake issue or cluster not ready
**Solution**:
- Wait 5 minutes (cluster might be starting)
- Check cluster status is "Active"
- Try redeploying after cluster is fully active

### Issue: "No available servers"
**Cause**: Cluster is paused or network blocked
**Solution**:
- Resume cluster
- Verify 0.0.0.0/0 is active (green checkmark)
- Wait 2 minutes, then redeploy

---

## 🔍 Debug Checklist

Run through this checklist:

- [ ] MongoDB Cluster status is **"Active"** (not Paused)
- [ ] Network Access has `0.0.0.0/0` with **green checkmark**
- [ ] Database user exists with **"Read and write"** permissions
- [ ] DATABASE_URL is set in Vercel (all environments)
- [ ] DATABASE_URL matches your MongoDB connection string exactly
- [ ] Vercel build cache has been cleared
- [ ] Redeployed after making changes
- [ ] Waited 2-3 minutes after redeploy
- [ ] Tested `/api/check-connection` endpoint

---

## 📞 Still Not Working?

### Get Detailed Error Info:

1. Visit: https://ekaashi-com.vercel.app/api/check-connection
2. Take a screenshot of the error
3. Check Vercel deployment logs:
   - Go to: https://vercel.com/nishants-projects-a4179263/jewelry-store
   - Click latest deployment
   - Click **"Functions"** tab
   - Look for errors in function logs

### Check Vercel Function Logs:
1. Go to deployment page
2. Click **"Functions"** tab
3. Click on any API route (like `/api/banners`)
4. Look for error messages
5. Share the error details

---

## 🎉 Once Connected:

After `/api/check-connection` shows success:

### Seed the Database:
```javascript
fetch('/api/seed-mongodb', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(d => console.log(d))
```

### Verify Homepage:
Visit: https://ekaashi-com.vercel.app
- Should show 15 products
- Should show banner carousel
- No 500 errors

---

**Next: Try Steps 1-6 in order, then test `/api/check-connection` again! 🚀**
