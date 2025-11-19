import GeneratedContent from '../models/GeneratedContent.js'

// @desc    Get user's generated content history
// @route   GET /api/user/content
// @access  Private
export const getContentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const toolType = req.query.toolType // Optional filter by tool type
    const skip = (page - 1) * limit

    const query = { userId: req.user.id }
    if (toolType) {
      query.toolType = toolType
    }

    const [content, total] = await Promise.all([
      GeneratedContent.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content'), // Don't send full content in list view
      GeneratedContent.countDocuments(query),
    ])

    res.status(200).json({
      success: true,
      data: {
        content,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error getting content history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get content history',
    })
  }
}

// @desc    Get specific generated content by ID
// @route   GET /api/user/content/:id
// @access  Private
export const getContentById = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        content,
      },
    })
  } catch (error) {
    console.error('Error getting content:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get content',
    })
  }
}

// @desc    Delete generated content
// @route   DELETE /api/user/content/:id
// @access  Private
export const deleteContent = async (req, res) => {
  try {
    const content = await GeneratedContent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete content',
    })
  }
}

