import Testimonial from '../models/Testimonial.js'
import { validationResult } from 'express-validator'

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const { featured, limit, includeUnpublished } = req.query
    let query = includeUnpublished ? {} : { published: true }

    if (featured === 'true') {
      query.featured = true
    }

    let testimonialsQuery = Testimonial.find(query).sort({ createdAt: -1 })
    
    // Apply limit if provided
    if (limit) {
      testimonialsQuery = testimonialsQuery.limit(parseInt(limit))
    }

    const testimonials = await testimonialsQuery

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message,
    })
  }
}

// @desc    Get a single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)

    if (!testimonial || !testimonial.published) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      })
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
      error: error.message,
    })
  }
}

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private (should be protected in production)
export const createTestimonial = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const testimonial = await Testimonial.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message,
    })
  }
}

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (should be protected in production)
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: error.message,
    })
  }
}

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (should be protected in production)
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message,
    })
  }
}

