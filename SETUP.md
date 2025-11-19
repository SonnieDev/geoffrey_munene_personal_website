# Quick Setup Guide

## Step-by-Step Setup for Beginners

### 1. Install Node.js
- Download from https://nodejs.org/
- Install the LTS version
- Verify installation: `node --version` and `npm --version`

### 2. Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Replace `<password>` with your database password

**Option B: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service

### 3. Install Project Dependencies

Open terminal in the project root and run:
```bash
npm run install-all
```

### 4. Configure Environment Variables

**Backend Configuration:**
1. Go to `server/` folder
2. Create a file named `.env`
3. Add the following:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/geoffrey-munene
   ```
   (Replace with your MongoDB Atlas connection string if using cloud)

**Frontend Configuration (Optional):**
1. Go to `client/` folder
2. Create a file named `.env`
3. Add the following:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### 5. Start the Application

In the project root, run:
```bash
npm run dev
```

This starts both frontend and backend servers.

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Common Issues

**Issue: "Cannot find module"**
- Solution: Run `npm install` in the specific folder (client or server)

**Issue: "MongoDB connection failed"**
- Solution: Check your MongoDB URI in `.env` file
- Make sure MongoDB is running (if local)
- Check your MongoDB Atlas connection string (if cloud)

**Issue: "Port 5000 already in use"**
- Solution: Change PORT in server `.env` file to another number (e.g., 5001)

**Issue: "EADDRINUSE: address already in use"**
- Solution: Close other applications using the same port or change the port number

## Testing the Setup

1. Open http://localhost:5173 in your browser
2. You should see the homepage
3. Try navigating to different pages (About, Projects, Contact)
4. Try submitting the contact form
5. Check the backend console for API requests

## Next Steps

1. Customize the content in `client/src/pages/`
2. Modify styles in `client/src/styles/`
3. Add your projects via API or directly in MongoDB
4. Customize the backend routes if needed

