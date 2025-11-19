import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - verify user JWT token
export const protect = async (req, res, next) => {
  let token

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
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
      const decoded = jwt.verify(token, jwtSecret)

      // Get user from token
      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
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

