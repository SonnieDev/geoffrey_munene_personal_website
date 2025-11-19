import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  // Use SMTP if configured, otherwise use a test account
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Fallback: Use Gmail OAuth2 or App Password if configured
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  // Development: Use ethereal.email for testing (logs to console)
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Email service not configured. Using test mode. Emails will not be sent.')
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test@ethereal.email',
        pass: 'test',
      },
    })
  }

  // Production: Return null if not configured (emails will fail gracefully)
  console.error('❌ Email service not configured. Please set SMTP or Gmail credentials.')
  return null
}

// Get service name based on signup purpose
const getServiceName = (signupPurpose) => {
  const services = {
    tools: 'AI Tools & Productivity',
    coaching: 'Remote Work Coaching',
    content: 'Content & Learning',
    all: 'All Services',
  }
  return services[signupPurpose] || 'Our Services'
}

// Generate welcome email HTML
const generateWelcomeEmailHTML = (userEmail, signupPurpose) => {
  const serviceName = getServiceName(signupPurpose)
  const firstName = userEmail.split('@')[0]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Your Remote Career Journey!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome, ${firstName}!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-top: 0;">We're thrilled to have you join us on your remote career journey!</p>
    
    <p>You've signed up for <strong>${serviceName}</strong>, and we're here to help you succeed every step of the way.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea;">What's Next?</h2>
      <ul style="padding-left: 20px;">
        <li>Complete your onboarding checklist in your dashboard</li>
        <li>Explore our AI-powered tools for resumes, cover letters, and more</li>
        <li>Check out our learning resources and guides</li>
        <li>Start building your remote career profile</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
         style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
        Go to Your Dashboard
      </a>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Quick Links</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 10px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tools" style="color: #667eea; text-decoration: none;">🔧 AI Tools & Productivity</a>
        </li>
        <li style="margin: 10px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/learn" style="color: #667eea; text-decoration: none;">📚 Learning Resources</a>
        </li>
        <li style="margin: 10px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact" style="color: #667eea; text-decoration: none;">💬 Get Support</a>
        </li>
      </ul>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      If you have any questions, feel free to reach out to us. We're here to help!
    </p>
    
    <p style="color: #666; font-size: 14px;">
      Best regards,<br>
      <strong>The Geoffrey Munene Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
    <p>This email was sent to ${userEmail}</p>
    <p>© ${new Date().getFullYear()} Geoffrey Munene. All rights reserved.</p>
  </div>
</body>
</html>
  `
}

// Generate welcome email text version
const generateWelcomeEmailText = (userEmail, signupPurpose) => {
  const serviceName = getServiceName(signupPurpose)
  const firstName = userEmail.split('@')[0]

  return `
Welcome, ${firstName}!

We're thrilled to have you join us on your remote career journey!

You've signed up for ${serviceName}, and we're here to help you succeed every step of the way.

What's Next?
- Complete your onboarding checklist in your dashboard
- Explore our AI-powered tools for resumes, cover letters, and more
- Check out our learning resources and guides
- Start building your remote career profile

Go to Your Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard

Quick Links:
- AI Tools & Productivity: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/tools
- Learning Resources: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/learn
- Get Support: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact

If you have any questions, feel free to reach out to us. We're here to help!

Best regards,
The Geoffrey Munene Team

---
This email was sent to ${userEmail}
© ${new Date().getFullYear()} Geoffrey Munene. All rights reserved.
  `
}

// Send welcome email
export const sendWelcomeEmail = async (userEmail, signupPurpose) => {
  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      console.warn('Email transporter not available. Skipping welcome email.')
      return { success: false, error: 'Email service not configured' }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@geoffreymunene.com',
      to: userEmail,
      subject: '🎉 Welcome to Your Remote Career Journey!',
      text: generateWelcomeEmailText(userEmail, signupPurpose),
      html: generateWelcomeEmailHTML(userEmail, signupPurpose),
    }

    const info = await transporter.sendMail(mailOptions)
    
    // In development with ethereal, log the preview URL
    if (process.env.NODE_ENV === 'development' && info.messageId) {
      console.log('📧 Welcome email sent! Preview URL:', nodemailer.getTestMessageUrl(info))
    } else {
      console.log('📧 Welcome email sent to:', userEmail)
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw - email failures shouldn't break registration
    return { success: false, error: error.message }
  }
}

// Send email (generic function for future use)
export const sendEmail = async (to, subject, html, text) => {
  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      console.warn('Email transporter not available. Skipping email.')
      return { success: false, error: 'Email service not configured' }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@geoffreymunene.com',
      to,
      subject,
      text: text || subject,
      html: html || text || subject,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent to:', to)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

