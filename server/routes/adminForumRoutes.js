import express from 'express'
import {
  getAdminForums,
  getAdminForumById,
  createAdminForum,
  updateAdminForum,
  deleteAdminForum,
} from '../controllers/adminForumController.js'
import { body } from 'express-validator'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Validation rules
const forumValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Forum name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Forum name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'business-growth',
      'remote-work',
      'productivity',
      'content-strategy',
      'networking',
      'tools-resources',
      'general',
    ])
    .withMessage('Invalid category'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be 10 characters or less'),
]

// Routes
router.get('/', protect, getAdminForums)
router.get('/:id', protect, getAdminForumById)
router.post('/', protect, forumValidation, createAdminForum)
router.put('/:id', protect, forumValidation, updateAdminForum)
router.delete('/:id', protect, deleteAdminForum)

export default router

