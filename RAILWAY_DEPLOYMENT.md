# Railway Deployment Guide - Step by Step

## ✅ Is Your Server Ready?

**YES!** Your server is ready for Railway deployment. Here's what's already configured:
- ✅ Start script: `npm start` 
- ✅ PORT handling: Uses `process.env.PORT` (Railway sets this automatically)
- ✅ Environment variables: All configured
- ✅ Error handling: In place
- ✅ CORS: Configured for production

## 🚀 Step-by-Step Railway Deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"** (recommended)
   - OR select **"Empty Project"** if you want to deploy manually

### Step 3: Connect Your Repository

**If using GitHub:**
1. Authorize Railway to access your GitHub
2. Select your repository: `geoffrey-munene-v1`
3. Railway will detect it's a Node.js project

**If using Empty Project:**
1. Click **"New"** → **"GitHub Repo"**
2. Select your repository

### Step 4: Configure the Service

**⚠️ IMPORTANT: Railway 2024 UI Update**

Railway removed the "Root Directory" option in the new UI. Use one of these methods:

#### Method 1: Service Settings (New UI)
1. Click on the service to configure it
2. Go to **Settings** tab
3. Look for **"Source"** or **"Repository"** section
4. Find **"Root Directory"**, **"Working Directory"**, or **"Base Directory"** field
5. Set it to: `server`
6. Verify **Start Command** is: `npm start`

#### Method 2: Build/Start Commands Override
If you can't find Root Directory option:
1. Go to **Settings** → **Deploy**
2. Set **Build Command** to: `cd server && npm install`
3. Set **Start Command** to: `cd server && npm start`

#### Method 3: Railway CLI (Most Reliable)
```bash
npm install -g @railway/cli
railway login
railway link
railway variables set RAILWAY_SERVICE_ROOT_DIR=server
```

See [RAILWAY_FIX_2024.md](./RAILWAY_FIX_2024.md) for detailed troubleshooting.

### Step 5: Add Environment Variables

1. Go to the **Variables** tab in your Railway service
2. Click **"New Variable"** for each of these:

   **Required Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=https://geoffreymunene.netlify.app
   ```

   **Optional (but recommended):**
   ```
   OPENAI_API_KEY=your_openai_api_key
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_API_KEY=your_adzuna_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

3. **Important Notes:**
   - Copy values from your local `server/.env` file
   - Never commit `.env` files to GitHub
   - Railway will encrypt these values

### Step 6: Deploy

1. Railway will automatically start deploying
2. Watch the **Deployments** tab for progress
3. Wait for deployment to complete (usually 2-3 minutes)

### Step 7: Get Your Server URL

1. Once deployed, go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a public URL
   - Example: `your-app-name.up.railway.app`
3. Copy this URL - you'll need it for your frontend

### Step 8: Update Frontend API URL

1. Go to your frontend deployment (Netlify/Vercel)
2. Update the environment variable:
   ```
   VITE_API_URL=https://your-app-name.up.railway.app/api
   ```
3. Redeploy your frontend

### Step 9: Test Your Deployment

1. Visit: `https://your-app-name.up.railway.app/api/health`
2. You should see: `{"status":"OK","message":"Server is running"}`
3. Test your admin login at: `https://your-frontend-url/admin/login`

## 🔧 Railway-Specific Configuration

### Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.geoffreymunene.com`)
4. Follow Railway's DNS instructions

### Environment Variables Reference

Here's a complete list of all environment variables you might need:

```env
# Server Configuration
NODE_ENV=production
PORT=5000  # Railway sets this automatically, but you can override

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geoffrey-munene

# Authentication
JWT_SECRET=your-very-secure-random-secret-key-here

# Frontend URL (for CORS)
FRONTEND_URL=https://geoffreymunene.netlify.app

# API Keys (Optional)
OPENAI_API_KEY=sk-...
ADZUNA_APP_ID=your_app_id
ADZUNA_API_KEY=your_api_key
YOUTUBE_API_KEY=your_youtube_key
```

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution:** Make sure Root Directory is set to `server` in Railway settings

### Issue: "Port already in use"
**Solution:** Railway sets PORT automatically. Don't hardcode it. Your code already handles this correctly.

### Issue: "MongoDB connection failed"
**Solution:** 
- Check your MONGODB_URI is correct
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Railway's IP
- Verify your MongoDB Atlas username/password

### Issue: "CORS errors"
**Solution:**
- Make sure FRONTEND_URL is set correctly in Railway
- Check that your frontend URL matches exactly (including https://)

### Issue: "Admin login not working"
**Solution:**
- Make sure JWT_SECRET is set in Railway
- Verify it matches your local JWT_SECRET
- Check Railway logs for errors

### Viewing Logs

1. Go to your service in Railway
2. Click on the **Deployments** tab
3. Click on the latest deployment
4. View **Logs** to see what's happening

## 📊 Monitoring Your Deployment

### Railway Dashboard
- View real-time logs
- Monitor resource usage
- See deployment history
- Check service health

### Health Check
Your server has a health check endpoint:
```
GET /api/health
```

Railway can use this to monitor your service.

## 💰 Railway Pricing

- **Free Tier:** $5 credit/month (usually enough for small projects)
- **Hobby Plan:** $5/month for more resources
- Your server should run fine on the free tier initially

## ✅ Post-Deployment Checklist

- [ ] Server is accessible at Railway URL
- [ ] Health check endpoint works: `/api/health`
- [ ] Frontend can connect to backend
- [ ] Admin login works
- [ ] All API endpoints are working
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Custom domain is configured (if needed)

## 🎉 You're Done!

Once deployed, your backend will be live and accessible. Make sure to:
1. Update your frontend's `VITE_API_URL` to point to Railway
2. Test all features
3. Monitor logs for any issues

## 📝 Quick Reference

**Railway Service Settings:**
- Root Directory: `server`
- Start Command: `npm start`
- Build Command: (leave empty, Railway auto-detects)

**Important URLs:**
- Railway Dashboard: https://railway.app
- Your API: `https://your-app-name.up.railway.app`
- Health Check: `https://your-app-name.up.railway.app/api/health`

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check Railway logs for detailed error messages

