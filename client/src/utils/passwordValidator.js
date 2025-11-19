// Client-side password validation

export const validatePassword = (password) => {
  const errors = []

  if (!password) {
    return { valid: false, errors: ['Password is required'] }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', 'admin', 'admin123', '12345678',
    'qwerty', 'letmein', 'welcome', 'monkey', '1234567890'
  ]
  
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('Password is too common or weak')
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  }
}

export const calculatePasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' }

  let strength = 0

  // Length
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1
  if (password.length >= 16) strength += 1

  // Character variety
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1

  // Strength levels
  if (strength <= 2) return { level: 1, label: 'Weak', color: '#ef4444' }
  if (strength <= 5) return { level: 2, label: 'Medium', color: '#f59e0b' }
  if (strength <= 7) return { level: 3, label: 'Strong', color: '#10b981' }
  return { level: 4, label: 'Very Strong', color: '#059669' }
}

