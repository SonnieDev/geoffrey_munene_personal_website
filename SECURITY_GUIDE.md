# Security Guide

## 🔒 Securing Your Admin Account

Your current credentials (`admin` / `admin123`) are **NOT secure** and should be changed immediately.

## ⚠️ Immediate Actions Required

### 1. Change Your Password (CRITICAL)

**Option A: Using the Script (Recommended)**
```bash
cd server
npm run change-password
```

This will:
- Prompt for your username
- Optionally generate a secure random password
- Validate password strength
- Update your password securely

**Option B: Using the Admin Dashboard**
1. Log in to `/admin/login`
2. Go to "Manage Admins"
3. Click "Edit" on your profile
4. Click "Change Password"
5. Enter current and new password

### 2. Add Email to Your Account

1. Go to Admin Dashboard → Manage Admins
2. Edit your profile
3. Add your email address
4. Save

## 🔐 Password Requirements

All passwords must meet these requirements:

- ✅ **Minimum 8 characters** (recommended: 12+)
- ✅ **At least one uppercase letter** (A-Z)
- ✅ **At least one lowercase letter** (a-z)
- ✅ **At least one number** (0-9)
- ✅ **At least one special character** (!@#$%^&*()_+-=[]{}|;:,.<>?)
- ❌ **Not a common password** (password, admin123, etc.)

### Example Strong Passwords:
- `MyS3cure!P@ssw0rd`
- `Tr0ub@dor&3`
- `C0ffee!M@chine#2024`

## 🛡️ Security Best Practices

### 1. Use Strong, Unique Passwords
- Never reuse passwords from other accounts
- Use a password manager (1Password, LastPass, Bitwarden)
- Generate random passwords for each account

### 2. Enable Two-Factor Authentication (Future)
- Currently not implemented, but recommended for production

### 3. Regular Security Audits
- Review admin accounts regularly
- Deactivate unused accounts
- Monitor last login times
- Check for suspicious activity

### 4. Environment Variables
Make sure these are set securely:

```env
# server/.env
JWT_SECRET=your-very-long-random-secret-key-here
MONGODB_URI=your-secure-mongodb-connection-string
```

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Production Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Disable registration endpoint (already done)
- [ ] Regular password changes (every 90 days)
- [ ] Monitor failed login attempts
- [ ] Use environment variables (never commit secrets)
- [ ] Regular database backups
- [ ] Keep dependencies updated

## 🔧 Security Features Implemented

### Password Security
- ✅ Strong password validation
- ✅ Password strength indicator
- ✅ Common password detection
- ✅ Minimum 8 characters requirement
- ✅ Complexity requirements (uppercase, lowercase, number, special char)

### Account Security
- ✅ Account activation/deactivation
- ✅ Last login tracking
- ✅ Role-based access control
- ✅ Self-protection (can't delete/deactivate yourself)
- ✅ Super admin protection (can't remove last super admin)

### API Security
- ✅ Rate limiting (prevents brute force)
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ Security headers (Helmet.js)
- ✅ CORS protection

## 🚨 What to Do If Compromised

1. **Immediately change your password**
2. **Review all admin accounts** - Check for unauthorized admins
3. **Check last login times** - Look for suspicious activity
4. **Deactivate compromised accounts**
5. **Rotate JWT_SECRET** - Generate new secret and force re-login
6. **Review server logs** - Check for suspicious API calls
7. **Update all admin passwords**

## 📋 Quick Security Commands

### Change Password
```bash
cd server
npm run change-password
```

### Check Admin Roles
```bash
cd server
node scripts/checkAdminRole.js
```

### Generate Secure Password
The change-password script can generate one, or use:
```bash
node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(16).toString('base64'))"
```

## 🔍 Monitoring & Auditing

### Check Admin Activity
- View last login times in Admin Management
- Review created admins (see who created them)
- Monitor account status changes

### Regular Security Tasks
- Weekly: Review admin accounts
- Monthly: Check last login times
- Quarterly: Rotate passwords
- Annually: Security audit

## 📞 Security Incident Response

If you suspect a security breach:

1. **Immediate**: Change all admin passwords
2. **Immediate**: Rotate JWT_SECRET
3. **Immediate**: Review and deactivate suspicious accounts
4. **Within 24 hours**: Full security audit
5. **Document**: Log all actions taken

## 🎯 Next Steps

1. **RIGHT NOW**: Change your password using `npm run change-password`
2. **TODAY**: Add email to your admin account
3. **THIS WEEK**: Review all admin accounts
4. **THIS MONTH**: Set up monitoring and alerts

---

**Remember**: Security is an ongoing process, not a one-time setup!

