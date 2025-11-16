import Project from '../models/Project.js'
import { validationResult } from 'express-validator'

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { featured } = req.query
    let query = {}

    if (featured === 'true') {
      query.featured = true
    }

    const projects = await Project.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message,
    })
  }
}

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message,
    })
  }
}

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (should be protected in production)
export const createProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const project = await Project.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message,
    })
  }
}

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (should be protected in production)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message,
    })
  }
}

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (should be protected in production)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message,
    })
  }
}

