import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

// Protect routes
export const protect = async (req, res, next) => {
  let token

  // Require JWT_SECRET in production
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret && process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: JWT_SECRET is required',
    })
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, jwtSecret || 'your-secret-key-change-in-production')

      // Get admin from token
      req.admin = await Admin.findById(decoded.id).select('-password')

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin not found',
        })
      }

      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    })
  }
}

