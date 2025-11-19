import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

// Generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production')
  }
  
  return jwt.sign({ id }, jwtSecret || 'your-secret-key-change-in-production', {
    expiresIn: '30d',
  })
}

// @desc    Register admin (first time setup)
// @route   POST /api/admin/register
// @access  Public (should be protected in production)
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if admin exists
    const adminExists = await Admin.findOne({ username })

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      })
    }

    // Create admin
    const admin = await Admin.create({
      username,
      password,
    })

    if (admin) {
      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        token: generateToken(admin._id),
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
      error: error.message,
    })
  }
}

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check for admin
    const admin = await Admin.findOne({ username })

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          username: admin.username,
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
      error: error.message,
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
      data: admin,
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

