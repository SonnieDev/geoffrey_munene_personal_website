import express from 'express'
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const testimonialValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isLength({ min: 2 })
    .withMessage('Role must be at least 2 characters'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Testimonial text is required')
    .isLength({ min: 10 })
    .withMessage('Testimonial text must be at least 10 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
]

// Routes
router.get('/', getTestimonials)
router.get('/:id', getTestimonialById)
router.post('/', testimonialValidation, createTestimonial)
router.put('/:id', updateTestimonial)
router.delete('/:id', deleteTestimonial)

export default router

