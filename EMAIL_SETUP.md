# Email Service Setup Guide

This guide explains how to configure the welcome email system for user registrations.

## Overview

The platform now sends automated welcome emails to new users after registration. The email service uses `nodemailer` and supports multiple email providers.

## Configuration Options

### Option 1: SMTP Server (Recommended for Production)

Add these environment variables to your `server/.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_SECURE=false  # true for port 465, false for other ports
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@geoffreymunene.com
```

**Popular SMTP Providers:**
- **SendGrid**: `smtp.sendgrid.net` (port 587)
- **Mailgun**: `smtp.mailgun.org` (port 587)
- **AWS SES**: `email-smtp.region.amazonaws.com` (port 587)
- **Postmark**: `smtp.postmarkapp.com` (port 587)
- **Resend**: `smtp.resend.com` (port 587)

### Option 2: Gmail (Quick Setup for Development)

For Gmail, you'll need to use an App Password (not your regular password):

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add to `server/.env`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

### Option 3: Development Mode (No Email Sent)

If no email credentials are configured, the system will:
- Log a warning in development mode
- Skip sending emails (registration still works)
- Not break the registration process

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMTP_HOST` | SMTP server hostname | No* | - |
| `SMTP_PORT` | SMTP server port | No* | 587 |
| `SMTP_SECURE` | Use TLS/SSL | No* | false |
| `SMTP_USER` | SMTP username/email | No* | - |
| `SMTP_PASS` | SMTP password | No* | - |
| `GMAIL_USER` | Gmail email address | No* | - |
| `GMAIL_APP_PASSWORD` | Gmail app password | No* | - |
| `EMAIL_FROM` | From email address | No | Uses SMTP_USER or GMAIL_USER |
| `FRONTEND_URL` | Frontend URL for email links | No | http://localhost:5173 |

*At least one email configuration method (SMTP or Gmail) is required to send emails.

## Testing Email Configuration

### Test in Development

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. Register a new user through the signup form

3. Check the console logs:
   - If configured: `📧 Welcome email sent to: user@example.com`
   - If not configured: `⚠️ Email service not configured. Using test mode.`

### Test Email Preview (Development)

In development mode with ethereal.email (default fallback), the console will show a preview URL:
```
📧 Welcome email sent! Preview URL: https://ethereal.email/message/...
```

## Email Template

The welcome email includes:
- Personalized greeting with user's name
- Service-specific content based on signup purpose
- Quick links to dashboard, tools, and resources
- Professional HTML design with responsive layout
- Plain text fallback

## Customization

To customize the email template, edit:
- `server/utils/emailService.js`
- Functions: `generateWelcomeEmailHTML()` and `generateWelcomeEmailText()`

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**: Ensure all required variables are set in `server/.env`
2. **Check Server Logs**: Look for error messages in the console
3. **Test SMTP Connection**: Use a tool like `telnet` or an SMTP tester
4. **Check Firewall**: Ensure port 587 (or 465) is not blocked
5. **Verify Credentials**: Double-check username and password

### Common Errors

- **"Invalid login"**: Check your email and password
- **"Connection timeout"**: Check SMTP host and port
- **"Authentication failed"**: For Gmail, ensure you're using an App Password
- **"Relay access denied"**: Your SMTP server may require authentication

### Gmail-Specific Issues

- Must use App Password (not regular password)
- 2-Factor Authentication must be enabled
- "Less secure app access" is deprecated - use App Passwords instead

## Production Recommendations

1. **Use a Professional Email Service**: 
   - SendGrid, Mailgun, or AWS SES for better deliverability
   - Avoid Gmail for production (rate limits)

2. **Set Up SPF/DKIM Records**: 
   - Improves email deliverability
   - Reduces spam folder placement

3. **Monitor Email Delivery**:
   - Set up bounce handling
   - Track open rates (optional)
   - Monitor spam complaints

4. **Rate Limiting**:
   - Most providers have rate limits
   - Consider queuing emails for high volume

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive credentials
- Rotate passwords regularly
- Use App Passwords instead of main passwords when possible

## Support

For issues or questions:
- Check the server logs for detailed error messages
- Review the `emailService.js` implementation
- Test with a simple SMTP client first

