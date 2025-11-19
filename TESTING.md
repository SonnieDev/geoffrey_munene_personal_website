# Backend Testing Guide

This guide will help you test your backend API both locally and on Railway.

## 🧪 Quick Test Methods

### Method 1: Browser (Easiest)

Just open these URLs in your browser:

**Local:**
- Health Check: `http://localhost:5000/api/health`
- Get Blogs: `http://localhost:5000/api/blogs`
- Get Jobs: `http://localhost:5000/api/jobs`
- Get Job Categories: `http://localhost:5000/api/jobs/categories`

**Railway (replace with your URL):**
- Health Check: `https://your-app.up.railway.app/api/health`
- Get Blogs: `https://your-app.up.railway.app/api/blogs`
- Get Jobs: `https://your-app.up.railway.app/api/jobs`

### Method 2: Using curl (Command Line)

#### Test Health Endpoint

**Local:**
```bash
curl http://localhost:5000/api/health
```

**Railway:**
```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

#### Test Get Blogs

**Local:**
```bash
curl http://localhost:5000/api/blogs
```

**Railway:**
```bash
curl https://your-app.up.railway.app/api/blogs
```

#### Test Get Jobs

**Local:**
```bash
curl http://localhost:5000/api/jobs
```

**Railway:**
```bash
curl https://your-app.up.railway.app/api/jobs
```

### Method 3: Using Railway CLI

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Link to your project:**
   ```bash
   railway link -p 885c252c-adc2-4aa8-afa5-615cc609fa19
   ```

3. **View logs:**
   ```bash
   railway logs
   ```

4. **Get your Railway URL:**
   ```bash
   railway domain
   ```

5. **Test endpoints using the URL:**
   ```bash
   curl $(railway domain)/api/health
   ```

### Method 4: Using the Test Script

Run the provided test script:

**Local:**
```bash
node server/scripts/test-api.js
```

**Railway:**
```bash
node server/scripts/test-api.js https://your-app.up.railway.app
```

## 📋 Complete Endpoint Testing Checklist

### Public Endpoints (No Auth Required)

#### ✅ Health Check
```bash
GET /api/health
```
**Expected:** `{"status":"OK","message":"Server is running"}`

#### ✅ Get All Blogs
```bash
GET /api/blogs
GET /api/blogs?featured=true
GET /api/blogs?category=remote-work
GET /api/blogs?limit=5
```

#### ✅ Get Single Blog
```bash
GET /api/blogs/:id
```
(Replace `:id` with an actual blog ID from your database)

#### ✅ Get Remote Jobs
```bash
GET /api/jobs
GET /api/jobs?search=developer
GET /api/jobs?location=remote
GET /api/jobs?page=1&results_per_page=10
```

#### ✅ Get Job Categories
```bash
GET /api/jobs/categories
```

#### ✅ Get YouTube Videos
```bash
GET /api/youtube/videos?channelUrl=https://www.youtube.com/@munenegeoffrey&maxResults=10
```

#### ✅ Get YouTube Playlists
```bash
GET /api/youtube/playlists?channelUrl=https://www.youtube.com/@munenegeoffrey
```

#### ✅ Submit Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "This is a test message"
}
```

#### ✅ Test AI Tools (Requires OPENAI_API_KEY)
```bash
POST /api/tools/resume
Content-Type: application/json

{
  "name": "John Doe",
  "experience": "5 years in web development",
  "skills": "React, Node.js, MongoDB"
}
```

### Admin Endpoints (Requires Authentication)

#### ✅ Admin Login
```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

**Response includes JWT token:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { "username": "admin", "id": "..." }
}
```

#### ✅ Get Current Admin (Protected)
```bash
GET /api/admin/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### ✅ Get All Blogs (Admin - includes unpublished)
```bash
GET /api/admin/blogs
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔍 Testing with Postman or Insomnia

1. **Import the collection** (create manually):
   - Base URL: `http://localhost:5000/api` (local) or `https://your-app.up.railway.app/api` (Railway)
   - Add endpoints from the checklist above

2. **For protected routes:**
   - First, login at `POST /api/admin/login`
   - Copy the `token` from response
   - Add header: `Authorization: Bearer YOUR_TOKEN`

## 🐛 Troubleshooting

### Server Not Starting

1. **Check if port is in use:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. **Check environment variables:**
   ```bash
   # Make sure .env file exists in server/ directory
   cat server/.env
   ```

3. **Check MongoDB connection:**
   - Verify `MONGODB_URI` is correct
   - Test connection: `mongosh "your-connection-string"`

### Railway Deployment Issues

1. **Check Railway logs:**
   ```bash
   railway logs
   ```

2. **Verify environment variables in Railway:**
   - Go to Railway Dashboard → Your Service → Variables
   - Ensure all required variables are set

3. **Check Railway domain:**
   ```bash
   railway domain
   ```

4. **Test health endpoint:**
   ```bash
   curl $(railway domain)/api/health
   ```

### Common Errors

- **404 Not Found**: Check if the route path is correct
- **500 Internal Server Error**: Check server logs for details
- **CORS Error**: Verify `FRONTEND_URL` in environment variables
- **MongoDB Connection Error**: Check `MONGODB_URI` and network access

## ✅ Success Indicators

Your backend is working correctly if:

- ✅ Health endpoint returns `{"status":"OK","message":"Server is running"}`
- ✅ Blog endpoints return blog data (or empty array if no blogs)
- ✅ Job endpoints return job listings
- ✅ Contact form submission returns success message
- ✅ Admin login returns JWT token
- ✅ Protected routes work with valid JWT token
- ✅ No errors in server logs

## 🚀 Quick Test Commands

**Test everything at once (local):**
```bash
echo "Testing Health..."
curl http://localhost:5000/api/health

echo "\n\nTesting Blogs..."
curl http://localhost:5000/api/blogs

echo "\n\nTesting Jobs..."
curl http://localhost:5000/api/jobs

echo "\n\nTesting Job Categories..."
curl http://localhost:5000/api/jobs/categories
```

**Test everything at once (Railway):**
```bash
RAILWAY_URL=$(railway domain)
echo "Testing Health..."
curl $RAILWAY_URL/api/health

echo "\n\nTesting Blogs..."
curl $RAILWAY_URL/api/blogs

echo "\n\nTesting Jobs..."
curl $RAILWAY_URL/api/jobs
```

