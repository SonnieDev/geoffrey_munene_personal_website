# Railway Deployment Troubleshooting Guide

## 🔴 Common Problems

### Problem 1: Root Directory Issue
Railway removed the "Root Directory" option in the new UI. The build is failing because Railway is trying to build from the root directory instead of the `server` folder.

Error: `sh: 1: vite: not found`

## ✅ Solution: Use Railway Service Configuration

In Railway's new UI (2024+), you configure the root directory through the service settings or by using configuration files.

### Option 1: Service Settings (Recommended)

1. **Go to Railway Dashboard**
   - Open your project
   - Click on the service that's failing

2. **Go to Settings**
   - Click **"Settings"** tab

3. **Configure Source**
   - Look for **"Source"** or **"Repository"** section
   - Find **"Root Directory"** or **"Working Directory"** field
   - If you see it, set it to: `server`
   - If not available, use Option 2 or 3

### Option 2: Service Settings (If railway.json doesn't work)

1. **Delete the current service** (or create a new one)
2. **Add New Service** → **GitHub Repo**
3. **Select your repository**
4. **In the service configuration**, look for:
   - **"Root Directory"** field
   - **"Working Directory"** field
   - **"Base Directory"** field
   - Set it to: `server`

### Option 3: Override Build/Start Commands

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Link your project**
   ```bash
   railway link
   ```

4. **Set the root directory**
   ```bash
   railway variables set RAILWAY_SERVICE_ROOT_DIR=server
   ```

   OR use the Railway dashboard:
   - Go to your service
   - Variables tab
   - Add: `RAILWAY_SERVICE_ROOT_DIR=server`

### Option 4: Use Railway CLI

I've created a `server/nixpacks.toml` file that should help Railway detect the correct directory.

### Option 5: Use nixpacks.toml (Alternative)

As a last resort, you could restructure, but this is not recommended.

## 🎯 Recommended Approach

**The `railway.json` file has been created in your project root. Just:**

1. **Commit and push** the `railway.json` file
2. **Redeploy** on Railway (or push a new commit)
3. Railway will automatically use `server` as the root directory

If that doesn't work, try the other options below.

## 📋 What to Look For in Railway UI

In the new Railway UI, look for these fields in Settings:
- **Source** section
- **Root Directory**
- **Working Directory**  
- **Base Directory**
- **Build Directory**

Any of these should be set to: `server`

## 🔧 Alternative: Update Build Command (If railway.json doesn't work)

If the `railway.json` file doesn't work, override the build commands:

1. Go to **Settings** → **Deploy** (or **Settings** → **Build**)
2. Set **Build Command** to:
   ```
   cd server && npm install
   ```
3. Set **Start Command** to:
   ```
   cd server && npm start
   ```

## ✅ Verification

After configuration:
- [ ] Railway builds from `server/` directory
- [ ] Build logs show: `Installing dependencies in server/`
- [ ] No `vite: not found` errors
- [ ] Server starts successfully

## 🆘 Still Having Issues?

1. **Check Railway Documentation**: https://docs.railway.app
2. **Use Railway CLI**: Most reliable way to configure
3. **Contact Railway Support**: They can help with the new UI

## 💡 Quick Test

After configuring, trigger a new deployment and check the build logs. You should see:
```
Installing dependencies...
> Installing in server/
```

If you see it installing in the root, the configuration didn't work.

