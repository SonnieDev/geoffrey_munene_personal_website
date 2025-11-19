# Deployment Guide

## Production Readiness Summary

Your website is **mostly production-ready** but needs a few critical security and configuration updates before going live.

## ✅ What's Already Good
- Clean, scalable code structure
- Responsive design
- Dark mode support
- Error handling
- Input validation
- Environment variables properly configured
- API keys secured in backend

## ⚠️ Critical Issues to Fix Before Production

### 1. Security Updates (MUST DO)

#### A. Install Security Packages
```bash
cd server
npm install helmet express-rate-limit
```

#### B. Update CORS Configuration
The CORS is currently open to all origins. Update `server/server.js` to restrict to your domain.

#### C. Add Rate Limiting
Prevent API abuse by adding rate limiting to your routes.

#### D. Add Security Headers
Use helmet.js to add security headers.

### 2. Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
OPENAI_API_KEY=your_openai_key
ADZUNA_APP_ID=your_app_id
ADZUNA_API_KEY=your_api_key
YOUTUBE_API_KEY=your_youtube_key
FRONTEND_URL=https://geoffreymunene.netlify.app
```

**Frontend (`client/.env`):**
```env
# Local development
VITE_API_URL=http://localhost:5000/api

# Production (set in Netlify environment variables)
VITE_API_URL=https://geoffrey-munene-v1-production.up.railway.app/api
```

### 3. SEO Improvements
- ✅ Meta tags added to index.html
- ⚠️ Add sitemap.xml
- ⚠️ Add robots.txt
- ⚠️ Add Open Graph image

### 4. Build & Test
```bash
# Build frontend
cd client
npm run build

# Test production build locally
npm run preview

# Test backend
cd server
NODE_ENV=production npm start
```

## 🚀 Deployment Options

### Frontend (Netlify/Vercel)

#### Netlify Deployment Steps:

1. **Connect GitHub Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select your repository

2. **Configure Build Settings**
   - **Base directory:** `client` (or leave empty if deploying from root)
   - **Build command:** `npm run build` (or `cd client && npm run build` if base directory is empty)
   - **Publish directory:** `client/dist` (or `dist` if base directory is `client`)

3. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Click "Add variable"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://geoffrey-munene-v1-production.up.railway.app/api`
   - Click "Save"

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - Your site will be live at `https://your-site-name.netlify.app`

#### Vercel Deployment (Alternative):

1. Connect your GitHub repository
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://geoffrey-munene-v1-production.up.railway.app/api`

### Backend (Railway) ✅ Already Deployed

Your backend is already deployed on Railway at:
**URL:** `https://geoffrey-munene-v1-production.up.railway.app`

#### Railway Configuration:
- ✅ Root directory: `server` (configured via `railway.json`)
- ✅ Start command: `npm start`
- ✅ Environment variables: All set in Railway dashboard

#### If you need to redeploy or configure:
1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Environment variables are in the Variables tab
4. Deployments are automatic on git push

#### Required Environment Variables in Railway:
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_jwt_secret`
- `FRONTEND_URL=https://your-netlify-site.netlify.app` (update after deploying frontend)
- `OPENAI_API_KEY=your_openai_key` (optional)
- `ADZUNA_APP_ID=your_app_id` (optional)
- `ADZUNA_API_KEY=your_api_key` (optional)
- `YOUTUBE_API_KEY=your_youtube_key` (optional)

## 📋 Pre-Launch Checklist

- [ ] Update CORS to your production domain
- [ ] Add rate limiting
- [ ] Add security headers (helmet)
- [ ] Test production build
- [ ] Set up production environment variables
- [ ] Test all features in production
- [ ] Set up error monitoring (optional but recommended)
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Test on multiple browsers/devices

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already configured in .gitignore ✅
2. **Use HTTPS** - Always use HTTPS in production
3. **Rate Limiting** - Prevent API abuse
4. **CORS Whitelist** - Only allow your frontend domain
5. **Security Headers** - Use helmet.js
6. **Input Validation** - Already implemented ✅
7. **Error Messages** - Don't expose sensitive info in errors ✅

## 📊 Monitoring (Optional but Recommended)

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Uptime monitoring (UptimeRobot)
- Performance monitoring

## 🎯 Quick Security Fixes

See `PRODUCTION_CHECKLIST.md` for detailed checklist and implementation guide.

