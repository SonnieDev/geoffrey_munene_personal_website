// Role-based access control middleware

// Check if user has required role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login',
      })
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      })
    }

    next()
  }
}

// Check if user is super admin
export const requireSuperAdmin = requireRole('super_admin')

// Check if user is admin, dev, or super admin (for content management)
export const requireAdmin = requireRole('super_admin', 'admin', 'dev')

// Check if user can manage other admins (super admin only)
export const canManageAdmins = requireRole('super_admin')

// Check if user is active
export const requireActive = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    })
  }

  if (!req.admin.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact a super admin.',
    })
  }

  next()
}

