import express from 'express'
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js'
import { protect } from '../middleware/authMiddleware.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const blogValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters'),
  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('Excerpt is required')
    .isLength({ min: 20 })
    .withMessage('Excerpt must be at least 20 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
]

// All routes are protected
router.use(protect)

// Get all blogs (including unpublished)
router.get('/', async (req, res, next) => {
  req.query.includeUnpublished = true
  next()
}, getBlogs)

router.get('/:id', getBlogById)
router.post('/', blogValidation, createBlog)
router.put('/:id', blogValidation, updateBlog)
router.delete('/:id', deleteBlog)

export default router

