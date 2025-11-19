import express from 'express'
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireSuperAdmin, requireActive } from '../middleware/roleMiddleware.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules for creating admin (password required)
const createAdminValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Username can only contain lowercase letters, numbers, and underscores'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['super_admin', 'admin', 'dev'])
    .withMessage('Invalid role'),
]

// Validation rules for updating admin (password optional)
const updateAdminValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Username can only contain lowercase letters, numbers, and underscores'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['super_admin', 'admin', 'dev'])
    .withMessage('Invalid role'),
]

// All routes require authentication and active account
router.use(protect)
router.use(requireActive)

// Get all admins (Super Admin only)
router.get('/', requireSuperAdmin, getAllAdmins)

// Get single admin (Super Admin or own profile)
router.get('/:id', getAdminById)

// Create admin (Super Admin only)
router.post('/', requireSuperAdmin, createAdminValidation, createAdmin)

// Update admin (Super Admin or own profile with limitations)
router.put('/:id', updateAdminValidation, updateAdmin)

// Change password (Own profile or Super Admin)
router.put('/:id/password', changePassword)

// Delete admin (Super Admin only)
router.delete('/:id', requireSuperAdmin, deleteAdmin)

export default router

