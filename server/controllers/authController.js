import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

// Generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d', // Default 7 days, configurable via env
  })
}

// @desc    Register admin (first time setup - only if no admins exist)
// @route   POST /api/admin/register
// @access  Public (only works if no admins exist, otherwise disabled)
export const registerAdmin = async (req, res) => {
  try {
    // Check if any admins exist
    const adminCount = await Admin.countDocuments()
    
    // Only allow registration if no admins exist (first-time setup)
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registration is disabled. Please use the admin management system to create new admins.',
      })
    }

    const { username, password } = req.body

    // Check if admin exists
    const adminExists = await Admin.findOne({ username: username.toLowerCase() })

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      })
    }

    // Create first admin as super_admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      password,
      role: 'super_admin', // First admin is always super admin
    })

    if (admin) {
      res.status(201).json({
        success: true,
        message: 'Super admin created successfully',
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid admin data',
      })
    }
  } catch (error) {
    console.error('Error registering admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register admin',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    })
  }
}

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check for admin (case-insensitive)
    const admin = await Admin.findOne({ username: username.toLowerCase() })

    if (admin && (await admin.matchPassword(password))) {
      // Check if account is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact a super admin.',
        })
      }

      // Update last login
      admin.lastLogin = new Date()
      await admin.save()

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
  } catch (error) {
    console.error('Error logging in admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    })
  }
}

// @desc    Get current admin
// @route   GET /api/admin/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password')

    res.json({
      success: true,
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    })
  } catch (error) {
    console.error('Error getting admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get admin',
      error: error.message,
    })
  }
}

