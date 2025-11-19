# Security Checklist for Production Deployment

## ✅ Critical Security Items

### 1. Environment Variables
- [ ] **JWT_SECRET** is set and is at least 32 characters long
- [ ] **MONGODB_URI** is set with proper authentication
- [ ] **NODE_ENV** is set to `production`
- [ ] **FRONTEND_URL** is set to your production frontend URL
- [ ] All sensitive values are stored in environment variables, NOT in code
- [ ] `.env` file is in `.gitignore` and never committed

### 2. Authentication & Authorization
- [ ] JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- [ ] All admin routes are protected with `protect` middleware
- [ ] Role-based access control (RBAC) is properly implemented
- [ ] Super admin accounts are secured with strong passwords
- [ ] Default admin credentials (`admin`/`admin123`) have been changed
- [ ] Password validation enforces strong passwords (8+ chars, mixed case, numbers, special chars)

### 3. CORS Configuration
- [ ] CORS is restricted to production frontend URLs only
- [ ] No wildcard origins (`*`) in production
- [ ] Credentials are only sent to allowed origins

### 4. Security Headers (Helmet)
- [ ] Content Security Policy (CSP) is configured
- [ ] HTTP Strict Transport Security (HSTS) is enabled
- [ ] XSS protection headers are set
- [ ] No unsafe-inline scripts in production (except where necessary)

### 5. Rate Limiting
- [ ] API endpoints have rate limiting (100 requests per 15 minutes)
- [ ] Auth endpoints have stricter rate limiting (5 requests per 15 minutes)
- [ ] Rate limiters skip OPTIONS requests (CORS preflight)

### 6. Input Validation
- [ ] All user inputs are validated using `express-validator`
- [ ] MongoDB queries use parameterized queries (Mongoose handles this)
- [ ] No raw user input in database queries
- [ ] File uploads (if any) are validated and sanitized

### 7. Error Handling
- [ ] Error messages don't leak sensitive information in production
- [ ] Stack traces are not exposed to clients in production
- [ ] Generic error messages for authentication failures

### 8. Password Security
- [ ] Passwords are hashed using bcrypt (salt rounds: 10)
- [ ] Passwords are never returned in API responses
- [ ] Password change requires current password verification
- [ ] Strong password requirements are enforced

### 9. Database Security
- [ ] MongoDB connection uses authentication
- [ ] Database credentials are in environment variables
- [ ] Database is not publicly accessible (use firewall/VPC)
- [ ] Regular database backups are configured

### 10. API Security
- [ ] Request body size is limited (10MB)
- [ ] Admin API requests are logged (for auditing)
- [ ] Sensitive endpoints require authentication
- [ ] API keys/tokens are stored securely (not in localStorage for sensitive operations)

## ⚠️ Additional Security Recommendations

### 11. HTTPS/SSL
- [ ] All production traffic uses HTTPS
- [ ] SSL certificates are valid and not expired
- [ ] HTTP to HTTPS redirect is configured

### 12. Monitoring & Logging
- [ ] Error logging is configured (consider Sentry or similar)
- [ ] Failed login attempts are logged
- [ ] Unusual activity is monitored
- [ ] Logs are stored securely and rotated regularly

### 13. Dependencies
- [ ] All npm packages are up to date
- [ ] Run `npm audit` and fix critical vulnerabilities
- [ ] Use `npm audit fix` for automatic fixes
- [ ] Review and update dependencies regularly

### 14. Server Configuration
- [ ] Server runs with non-root user
- [ ] File permissions are properly set
- [ ] Unnecessary services are disabled
- [ ] Firewall rules are configured

### 15. Backup & Recovery
- [ ] Database backups are automated
- [ ] Backup restoration is tested
- [ ] Disaster recovery plan is documented

## 🔒 Pre-Deployment Commands

```bash
# 1. Check for security vulnerabilities
cd server
npm audit
npm audit fix

# 2. Verify environment variables are set
node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING'); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING');"

# 3. Change default admin password
npm run change-password

# 4. List all admins and verify roles
npm run list-admins

# 5. Test authentication
# Try logging in with invalid credentials - should be rate limited
# Try accessing protected routes without token - should fail
```

## 📝 Security Best Practices

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use strong passwords**: Minimum 16 characters, mixed case, numbers, special chars
3. **Rotate secrets regularly**: Change JWT_SECRET periodically
4. **Monitor logs**: Watch for suspicious activity
5. **Keep dependencies updated**: Run `npm audit` regularly
6. **Use HTTPS**: Always use SSL/TLS in production
7. **Limit admin access**: Only create admin accounts for trusted users
8. **Regular backups**: Backup database regularly
9. **Test security**: Perform security audits regularly
10. **Document access**: Keep track of who has admin access

## 🚨 If You Suspect a Security Breach

1. Immediately change all admin passwords
2. Rotate JWT_SECRET
3. Review access logs
4. Check for unauthorized admin accounts
5. Review recent database changes
6. Consider temporarily disabling admin access
7. Notify affected users if data was compromised

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

