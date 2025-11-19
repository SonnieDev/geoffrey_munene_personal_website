import Admin from '../models/Admin.js'
import { validationResult } from 'express-validator'
import { validatePassword } from '../utils/passwordValidator.js'

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private (Super Admin only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select('-password')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    })
  } catch (error) {
    console.error('Error fetching admins:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message,
    })
  }
}

// @desc    Get single admin
// @route   GET /api/admin/admins/:id
// @access  Private (Super Admin only, or own profile)
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    // Allow access if viewing own profile or if requester is super admin
    if (req.admin._id.toString() !== req.params.id && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    res.status(200).json({
      success: true,
      data: admin,
    })
  } catch (error) {
    console.error('Error fetching admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin',
      error: error.message,
    })
  }
}

// @desc    Create new admin
// @route   POST /api/admin/admins
// @access  Private (Super Admin only)
export const createAdmin = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      })
    }

    const { username, email, password, role } = req.body

    // Validate password strength
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
        errors: [{ field: 'password', message: 'Password is required' }],
      })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors.map(err => ({
          field: 'password',
          message: err,
        })),
      })
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ username: username.toLowerCase() })
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username already exists',
      })
    }

    // Check if email exists (if provided)
    if (email) {
      const emailExists = await Admin.findOne({ email: email.toLowerCase() })
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists',
        })
      }
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'dev']
    const adminRole = role && validRoles.includes(role) ? role : 'admin'

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email ? email.toLowerCase() : undefined,
      password,
      role: adminRole,
      createdBy: req.admin._id,
    })

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message,
    })
  }
}

// @desc    Update admin
// @route   PUT /api/admin/admins/:id
// @access  Private (Super Admin only, or own profile for limited updates)
export const updateAdmin = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
        })),
      })
    }

    const { username, email, role, isActive } = req.body
    const targetAdmin = await Admin.findById(req.params.id)

    if (!targetAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    // Check permissions
    const isOwnProfile = req.admin._id.toString() === req.params.id
    const isSuperAdmin = req.admin.role === 'super_admin'

    // Only super admin can change roles, activate/deactivate, or modify other admins
    if (!isOwnProfile && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // Regular admins can only update their own email
    if (isOwnProfile && !isSuperAdmin) {
      if (email) {
        const emailExists = await Admin.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: req.params.id }
        })
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use',
          })
        }
        targetAdmin.email = email.toLowerCase()
      }
    } else if (isSuperAdmin) {
      // Super admin can update everything
      if (username && username !== targetAdmin.username) {
        const usernameExists = await Admin.findOne({ 
          username: username.toLowerCase(),
          _id: { $ne: req.params.id }
        })
        if (usernameExists) {
          return res.status(400).json({
            success: false,
            message: 'Username already in use',
          })
        }
        targetAdmin.username = username.toLowerCase()
      }

      if (email && email !== targetAdmin.email) {
        const emailExists = await Admin.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: req.params.id }
        })
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use',
          })
        }
        targetAdmin.email = email.toLowerCase()
      }

      if (role && ['super_admin', 'admin', 'dev'].includes(role)) {
        // Prevent removing the last super admin
        if (targetAdmin.role === 'super_admin' && role !== 'super_admin') {
          const superAdminCount = await Admin.countDocuments({ role: 'super_admin' })
          if (superAdminCount <= 1) {
            return res.status(400).json({
              success: false,
              message: 'Cannot remove the last super admin',
            })
          }
        }
        targetAdmin.role = role
      }

      if (typeof isActive === 'boolean') {
        // Prevent deactivating yourself
        if (req.admin._id.toString() === req.params.id && !isActive) {
          return res.status(400).json({
            success: false,
            message: 'Cannot deactivate your own account',
          })
        }
        targetAdmin.isActive = isActive
      }
    }

    await targetAdmin.save()

    const updatedAdmin = await Admin.findById(req.params.id).select('-password')

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: updatedAdmin,
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: error.message,
    })
  }
}

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Private (Super Admin only)
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    // Prevent deleting yourself
    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      })
    }

    // Prevent deleting the last super admin
    if (admin.role === 'super_admin') {
      const superAdminCount = await Admin.countDocuments({ role: 'super_admin' })
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last super admin',
        })
      }
    }

    await Admin.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting admin:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: error.message,
    })
  }
}

// @desc    Change password
// @route   PUT /api/admin/admins/:id/password
// @access  Private (Own profile or Super Admin)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await Admin.findById(req.params.id)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    const isOwnProfile = req.admin._id.toString() === req.params.id
    const isSuperAdmin = req.admin.role === 'super_admin'

    // If changing own password, require current password
    if (isOwnProfile) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required',
        })
      }

      const isMatch = await admin.matchPassword(currentPassword)
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }
    } else if (!isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors,
      })
    }

    admin.password = newPassword
    await admin.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    })
  }
}

