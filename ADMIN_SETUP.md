# Admin Dashboard Setup Guide

## Creating Your First Admin Account

### Option 1: Using npm script (Recommended)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create an admin account:
   ```bash
   npm run create-admin
   ```
   
   This will create an admin with:
   - Username: `admin`
   - Password: `admin123`

3. To create a custom admin:
   ```bash
   npm run create-admin your-username your-password
   ```

### Option 2: Using the API endpoint

1. Make sure your server is running
2. Send a POST request to `/api/admin/register`:
   ```bash
   curl -X POST http://localhost:5000/api/admin/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-secure-password"}'
   ```

## Accessing the Admin Dashboard

1. Start your development servers:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/admin/login`

3. Login with your admin credentials

## Admin Dashboard Features

### 📝 Blog Management
- View all blog posts (including drafts)
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Mark posts as featured
- Publish/unpublish posts

### 💼 Job Management
- View all manually added jobs
- Add new remote jobs
- Edit existing jobs
- Delete jobs
- Mark jobs as featured
- Activate/deactivate jobs

### 📧 Contact Messages
- View all contact form submissions
- Mark messages as read/replied
- Delete messages
- View message details

## Security Notes

⚠️ **Important Security Recommendations:**

1. **Change Default Password**: After first login, change your password immediately
2. **Use Strong Passwords**: Use a strong, unique password for your admin account
3. **Protect Registration Endpoint**: In production, disable or protect the `/api/admin/register` endpoint
4. **JWT Secret**: Update `JWT_SECRET` in your `.env` file with a strong random string
5. **HTTPS**: Always use HTTPS in production

## Environment Variables

Add to your `server/.env` file:

```env
JWT_SECRET=your-very-secure-random-secret-key-here
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login
- `POST /api/admin/register` - Register (disable in production)
- `GET /api/admin/me` - Get current admin (protected)

### Blogs (Protected)
- `GET /api/admin/blogs` - Get all blogs
- `GET /api/admin/blogs/:id` - Get single blog
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

### Jobs (Protected)
- `GET /api/admin/jobs` - Get all manual jobs
- `GET /api/admin/jobs/:id` - Get single job
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job

### Contacts (Protected)
- `GET /api/admin/contacts` - Get all contacts
- `GET /api/admin/contacts/:id` - Get single contact
- `PUT /api/admin/contacts/:id` - Update contact status
- `DELETE /api/admin/contacts/:id` - Delete contact

## Troubleshooting

**Issue: "Cannot find module"**
- Make sure you've installed all dependencies: `npm install` in the server directory

**Issue: "Admin already exists"**
- The username is already taken. Use a different username or delete the existing admin from the database

**Issue: "Not authorized"**
- Make sure you're logged in
- Check that your JWT token is valid
- Try logging out and logging back in

**Issue: "Failed to fetch"**
- Make sure the server is running
- Check your API URL in the frontend `.env` file
- Verify CORS settings in `server.js`

