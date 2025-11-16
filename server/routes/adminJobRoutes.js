import express from 'express'
import {
  getAdminJobs,
  getAdminJobById,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
} from '../controllers/adminJobController.js'
import { protect } from '../middleware/authMiddleware.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('applyUrl').trim().isURL().withMessage('Valid apply URL is required'),
]

// All routes are protected
router.use(protect)

router.get('/', getAdminJobs)
router.get('/:id', getAdminJobById)
router.post('/', jobValidation, createAdminJob)
router.put('/:id', jobValidation, updateAdminJob)
router.delete('/:id', deleteAdminJob)

export default router

