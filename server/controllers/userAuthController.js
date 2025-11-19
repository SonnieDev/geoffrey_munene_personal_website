import User from '../models/User.js'
import { getOrCreateUser } from '../middleware/tokenMiddleware.js'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from '../utils/emailService.js'
import logger from '../utils/logger.js'

// Generate JWT token for users
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret-change-in-production', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, sessionId, signupPurpose } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // Check if there's an existing session user to migrate
    let existingUser = null
    if (sessionId) {
      existingUser = await User.findOne({ sessionId })
    }

    // Create user or update existing session user
    let user
    const TRIAL_TOKENS = parseInt(process.env.TRIAL_TOKENS || '10', 10)

    if (existingUser && !existingUser.email) {
      // Migrate existing session user to registered user
      existingUser.email = email.toLowerCase()
      existingUser.password = password
      if (!existingUser.trialTokensGiven) {
        existingUser.tokens = (existingUser.tokens || 0) + TRIAL_TOKENS
        existingUser.trialTokensGiven = true
      }
      await existingUser.save()
      user = existingUser
    } else {
      // Create new user
      const userData = {
        email: email.toLowerCase(),
        password,
        tokens: TRIAL_TOKENS,
        trialTokensGiven: true,
        signupPurpose: signupPurpose || null,
        progress: {
          level: 1,
          points: 10, // Starting points for signup
          achievements: ['welcome'],
          streak: 1,
          lastActiveDate: new Date(),
        },
      }
      
      // Only include sessionId if it's provided (not null/undefined)
      // This prevents duplicate key errors with the sparse unique index
      if (sessionId) {
        userData.sessionId = sessionId
      }
      
      user = await User.create(userData)
    }

    // Generate token
    const token = generateToken(user._id)

    // Send welcome email asynchronously (don't block registration)
    if (user.email && !user.welcomeEmailSent) {
      sendWelcomeEmail(user.email, user.signupPurpose)
        .then((result) => {
          if (result.success) {
            // Update welcomeEmailSent flag
            User.findByIdAndUpdate(user._id, { welcomeEmailSent: true })
              .catch((err) => console.error('Error updating welcomeEmailSent:', err))
          }
        })
        .catch((err) => console.error('Error sending welcome email:', err))
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'register' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user',
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Update last activity
    user.lastActivity = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'login' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login',
    })
  }
}

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        tokens: user.tokens,
        trialTokensGiven: user.trialTokensGiven,
        totalTokensPurchased: user.totalTokensPurchased,
        totalTokensUsed: user.totalTokensUsed,
        signupPurpose: user.signupPurpose,
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        preferences: user.preferences,
        progress: user.progress,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'getMe' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user',
    })
  }
}

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      })
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Verify current password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'No password set for this account',
      })
    }

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'changePassword' })
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password',
    })
  }
}

