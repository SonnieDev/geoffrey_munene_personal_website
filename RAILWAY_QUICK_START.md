# Railway Quick Start Guide

## 🚀 Fastest Way to Deploy (5 Minutes)

### 1. Push to GitHub
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Railway deployment"
git push
```

### 2. Deploy on Railway

1. **Go to:** https://railway.app
2. **Click:** "Start a New Project"
3. **Select:** "Deploy from GitHub repo"
4. **Choose:** Your `geoffrey-munene-v1` repository
5. **Wait:** Railway auto-detects Node.js

### 3. Configure Service

1. Click on the service
2. Go to **Settings**
3. Set **Root Directory:** `server`
4. Verify **Start Command:** `npm start`

### 4. Add Environment Variables

Go to **Variables** tab and add:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://geoffreymunene.netlify.app
OPENAI_API_KEY=your_key (if using)
ADZUNA_APP_ID=your_id (if using)
ADZUNA_API_KEY=your_key (if using)
YOUTUBE_API_KEY=your_key (if using)
```

### 5. Get Your URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `your-app.up.railway.app`)

### 6. Update Frontend

In your frontend deployment (Netlify/Vercel), add:
```
VITE_API_URL=https://your-app.up.railway.app/api
```

### 7. Test

Visit: `https://your-app.up.railway.app/api/health`

Should return: `{"status":"OK","message":"Server is running"}`

## ✅ Done!

Your backend is now live on Railway!

## 📋 Environment Variables Checklist

Copy these from your local `server/.env`:

- [ ] NODE_ENV=production
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] FRONTEND_URL
- [ ] OPENAI_API_KEY (optional)
- [ ] ADZUNA_APP_ID (optional)
- [ ] ADZUNA_API_KEY (optional)
- [ ] YOUTUBE_API_KEY (optional)

## 🆘 Common Issues

**"Cannot find module"**
→ Set Root Directory to `server` in Settings

**"MongoDB connection failed"**
→ Check MONGODB_URI is correct and MongoDB Atlas allows connections

**"CORS errors"**
→ Make sure FRONTEND_URL matches your frontend domain exactly

**Need help?**
→ Check Railway logs in the Deployments tab

