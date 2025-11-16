import Blog from '../models/Blog.js'
import { validationResult } from 'express-validator'

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { featured, category, limit, includeUnpublished } = req.query
    let query = includeUnpublished ? {} : { published: true }

    if (featured === 'true') {
      query.featured = true
    }

    if (category) {
      query.category = category
    }

    let blogsQuery = Blog.find(query).sort({ createdAt: -1 })
    
    // Apply limit if provided
    if (limit) {
      blogsQuery = blogsQuery.limit(parseInt(limit))
    }

    const blogs = await blogsQuery

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error.message,
    })
  }
}

// @desc    Get a single blog post
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog || !blog.published) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      })
    }

    res.status(200).json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message,
    })
  }
}

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (should be protected in production)
export const createBlog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const blog = await Blog.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message,
    })
  }
}

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (should be protected in production)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message,
    })
  }
}

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (should be protected in production)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message,
    })
  }
}

