# Admin Roles & Management Guide

## Overview

The application now supports a role-based admin system with three roles: **Super Admin**, **Admin**, and **Dev**.

## Admin Roles

### 1. Super Admin
- **Full access** to everything
- Can create, edit, and delete other admins
- Can change roles of other admins
- Can activate/deactivate admin accounts
- Can manage all content (blogs, jobs, testimonials, contacts)
- **Cannot** delete or deactivate themselves
- **Cannot** remove the last super admin role

### 2. Admin
- Can manage content (blogs, jobs, testimonials, contacts)
- Cannot access admin management
- Cannot change their own role
- Can update their own email

### 3. Dev
- Development/testing role
- Same permissions as Admin
- Useful for testing without full admin access

## How Admin Creation Works

### Initial Setup (First Admin)
When you first set up the application:

1. **Using the script** (recommended):
   ```bash
   cd server
   npm run create-admin
   ```
   The first admin created will automatically be a **Super Admin**.

2. **Using the API** (only works if no admins exist):
   ```bash
   POST /api/admin/register
   {
     "username": "admin",
     "password": "secure-password"
   }
   ```
   This endpoint is **automatically disabled** once any admin exists.

### Creating Additional Admins

**Only Super Admins can create new admins:**

1. **Via Admin Dashboard** (Recommended):
   - Login as Super Admin
   - Go to Admin Dashboard
   - Click "Manage Admins" card
   - Click "Add New Admin"
   - Fill in the form and select role

2. **Via API** (Super Admin only):
   ```bash
   POST /api/admin/admins
   Authorization: Bearer <super-admin-token>
   {
     "username": "newadmin",
     "email": "admin@example.com",
     "password": "secure-password",
     "role": "admin"
   }
   ```

## Admin Management Features

### Super Admin Dashboard
- View all admins
- See admin roles, status, and last login
- Create new admins
- Edit admin details (username, email, role, status)
- Activate/deactivate admins
- Delete admins (except yourself)
- Change passwords for any admin

### Security Features
- **Account Status**: Admins can be activated/deactivated
- **Last Login Tracking**: See when admins last logged in
- **Created By Tracking**: See who created each admin
- **Self-Protection**: Cannot delete/deactivate yourself
- **Super Admin Protection**: Cannot remove the last super admin

## Password Management

### Change Your Own Password
1. Go to Admin Management
2. Click "Edit" on your own profile
3. Click "Change Password"
4. Enter current password and new password

### Super Admin Changing Others' Passwords
1. Go to Admin Management
2. Click "Edit" on the admin
3. Click "Change Password"
4. Enter new password (current password not required)

## Role Permissions Summary

| Feature | Super Admin | Admin | Dev |
|---------|------------|-------|-----|
| Manage Blogs | ✅ | ✅ | ✅ |
| Manage Jobs | ✅ | ✅ | ✅ |
| Manage Testimonials | ✅ | ✅ | ✅ |
| Manage Contacts | ✅ | ✅ | ✅ |
| Create/Edit Admins | ✅ | ❌ | ❌ |
| Delete Admins | ✅ | ❌ | ❌ |
| Change Admin Roles | ✅ | ❌ | ❌ |
| Activate/Deactivate Admins | ✅ | ❌ | ❌ |
| Change Own Password | ✅ | ✅ | ✅ |
| Change Others' Passwords | ✅ | ❌ | ❌ |

## API Endpoints

### Admin Management (Super Admin Only)
- `GET /api/admin/admins` - Get all admins
- `GET /api/admin/admins/:id` - Get single admin
- `POST /api/admin/admins` - Create admin
- `PUT /api/admin/admins/:id` - Update admin
- `DELETE /api/admin/admins/:id` - Delete admin
- `PUT /api/admin/admins/:id/password` - Change password

### Authentication
- `POST /api/admin/login` - Login
- `GET /api/admin/me` - Get current admin (includes role)
- `POST /api/admin/register` - Register (only if no admins exist)

## Migration Notes

### Existing Admins
If you have existing admins from before this update:

1. **They will default to "admin" role**
2. **To make one a Super Admin**, you can:
   - Use MongoDB directly to update the role
   - Or delete all admins and recreate the first one as super admin

### Making Existing Admin a Super Admin (MongoDB)
```javascript
// In MongoDB shell or Compass
db.admins.updateOne(
  { username: "your-username" },
  { $set: { role: "super_admin" } }
)
```

## Best Practices

1. **Always have at least 2 Super Admins** - Prevents lockout
2. **Use strong passwords** - Minimum 6 characters, but recommend 12+
3. **Regularly review admin accounts** - Deactivate unused accounts
4. **Use email addresses** - Helps with account recovery
5. **Track who created admins** - The `createdBy` field tracks this
6. **Monitor last login** - Helps identify inactive accounts

## Troubleshooting

### "Access denied" when trying to manage admins
- Make sure you're logged in as a Super Admin
- Check your role in the dashboard header

### Cannot delete admin
- You cannot delete yourself
- You cannot delete the last super admin
- Make sure you're a super admin

### Cannot change role
- Only super admins can change roles
- You cannot change your own role
- You cannot remove the last super admin role

### Registration endpoint disabled
- This is normal after the first admin is created
- Use the admin management dashboard instead

## Security Recommendations

1. **Disable registration endpoint in production** (already done automatically)
2. **Use environment variables** for JWT_SECRET
3. **Enable HTTPS** in production
4. **Regular security audits** of admin accounts
5. **Implement 2FA** (future enhancement)
6. **Log admin actions** (future enhancement)

