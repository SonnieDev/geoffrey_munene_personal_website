# Developer Admin (Dev Role) Guide

## Overview

The **Dev** role is designed for developers and testers who need access to the admin dashboard for testing and development purposes. Dev admins have the same content management permissions as regular admins but cannot manage other admin accounts.

## What Dev Admins Can See

### Dashboard Access
When a dev admin logs in, they see:

1. **Admin Dashboard** with:
   - Welcome message with "DEV" role badge (green)
   - Statistics cards showing:
     - Blog Posts count
     - Remote Jobs count
     - Contact Messages count
     - Testimonials count
   - Quick Actions section with buttons to:
     - Create New Blog Post
     - Add New Job
     - Add New Testimonial

2. **Content Management Pages**:
   - ✅ **Blog Management** - Full CRUD access
   - ✅ **Job Management** - Full CRUD access
   - ✅ **Testimonials Management** - Full CRUD access
   - ✅ **Contact Messages** - View and manage contacts

3. **Theme Toggle** - Can switch between light/dark mode

## What Dev Admins Cannot Access

- ❌ **Admin Management** - Cannot view, create, edit, or delete other admins
- ❌ **Admin Management Card** - The "Manage Admins" card is hidden from the dashboard
- ❌ **Role Changes** - Cannot change their own role or others' roles
- ❌ **Account Management** - Cannot activate/deactivate admin accounts

## Permissions Summary

| Feature | Dev Admin | Regular Admin | Super Admin |
|---------|-----------|---------------|-------------|
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Blogs | ✅ | ✅ | ✅ |
| Manage Jobs | ✅ | ✅ | ✅ |
| Manage Testimonials | ✅ | ✅ | ✅ |
| Manage Contacts | ✅ | ✅ | ✅ |
| Create/Edit Admins | ❌ | ❌ | ✅ |
| Delete Admins | ❌ | ❌ | ✅ |
| Change Admin Roles | ❌ | ❌ | ✅ |
| Activate/Deactivate Admins | ❌ | ❌ | ✅ |
| Change Own Password | ✅ | ✅ | ✅ |

## Use Cases for Dev Role

1. **Testing** - Developers can test admin features without full admin access
2. **Content Creation** - Developers can create test content during development
3. **QA Testing** - Quality assurance testers can verify admin functionality
4. **Staging Environment** - Limited access for staging/testing environments

## Visual Indicators

- **Role Badge**: Dev admins see a green "DEV" badge next to their username
- **Dashboard**: Same layout as regular admins, but without "Manage Admins" card
- **Navigation**: All content management links are accessible

## Security Notes

- Dev admins are still subject to the same security measures:
  - Must use strong passwords
  - Account can be deactivated by super admins
  - Rate limiting applies
  - All actions are logged

## Creating a Dev Admin

Only Super Admins can create dev admins:

1. Login as Super Admin
2. Go to Admin Dashboard → Manage Admins
3. Click "Add New Admin"
4. Fill in the form and select **"Dev"** as the role
5. Save

## Best Practices

1. **Use for Testing** - Dev role is ideal for testing environments
2. **Limited Production Use** - Consider using regular "admin" role for production content managers
3. **Regular Review** - Super admins should periodically review dev admin accounts
4. **Deactivate When Not Needed** - Deactivate dev accounts when testing is complete

## Troubleshooting

**Issue: "Access denied" when trying to manage content**
- Make sure you're logged in as a dev admin
- Check that your account is active
- Verify your role is set to "dev"

**Issue: Can't see admin management**
- This is expected - dev admins cannot manage other admins
- Only super admins can access admin management

**Issue: Can't change password**
- Dev admins can change their own password
- Go to Admin Management → Edit your profile → Change Password

