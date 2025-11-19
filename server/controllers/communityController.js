import CommunityPost from '../models/CommunityPost.js'
import Forum from '../models/Forum.js'
import ForumThread from '../models/ForumThread.js'
import Event from '../models/Event.js'
import Resource from '../models/Resource.js'
import Showcase from '../models/Showcase.js'
import User from '../models/User.js'

// ==================== COMMUNITY POSTS ====================

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Public
export const getCommunityPosts = async (req, res) => {
  try {
    const { type, limit = 20, page = 1 } = req.query
    const query = { isDeleted: false }
    
    if (type) {
      query.type = type
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const posts = await CommunityPost.find(query)
      .populate('author', 'email')
      .populate('likes.user', 'email')
      .populate('comments.user', 'email')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)

    const total = await CommunityPost.countDocuments(query)

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Error fetching community posts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community posts',
      error: error.message,
    })
  }
}

// @desc    Create a community post
// @route   POST /api/community/posts
// @access  Private
export const createCommunityPost = async (req, res) => {
  try {
    const { content, type, tags, images } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      })
    }

    const post = await CommunityPost.create({
      author: req.user.id,
      content: content.trim(),
      type: type || 'general',
      tags: tags || [],
      images: images || [],
    })

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'email')

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost,
    })
  } catch (error) {
    console.error('Error creating community post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message,
    })
  }
}

// @desc    Like/Unlike a community post
// @route   POST /api/community/posts/:id/like
// @access  Private
export const togglePostLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    const existingLike = post.likes.find(
      (like) => like.user.toString() === req.user.id
    )

    if (existingLike) {
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      )
    } else {
      post.likes.push({ user: req.user.id })
    }

    await post.save()

    res.status(200).json({
      success: true,
      message: existingLike ? 'Post unliked' : 'Post liked',
      data: post,
    })
  } catch (error) {
    console.error('Error toggling post like:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message,
    })
  }
}

// @desc    Comment on a community post
// @route   POST /api/community/posts/:id/comments
// @access  Private
export const addPostComment = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      })
    }

    const post = await CommunityPost.findById(req.params.id)

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    post.comments.push({
      user: req.user.id,
      content: content.trim(),
    })

    await post.save()

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'email')
      .populate('comments.user', 'email')

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedPost,
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    })
  }
}

// @desc    Delete a community post
// @route   DELETE /api/community/posts/:id
// @access  Private
export const deleteCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      })
    }

    post.isDeleted = true
    await post.save()

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message,
    })
  }
}

// ==================== FORUMS ====================

// @desc    Get all forums
// @route   GET /api/community/forums
// @access  Public
export const getForums = async (req, res) => {
  try {
    const forums = await Forum.find({ isActive: true })
      .sort({ category: 1, name: 1 })

    res.status(200).json({
      success: true,
      data: forums,
    })
  } catch (error) {
    console.error('Error fetching forums:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forums',
      error: error.message,
    })
  }
}

// @desc    Get forum threads
// @route   GET /api/community/forums/:forumId/threads
// @access  Public
export const getForumThreads = async (req, res) => {
  try {
    const { forumId } = req.params
    const { limit = 20, page = 1 } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const threads = await ForumThread.find({
      forum: forumId,
      isDeleted: false,
    })
      .populate('author', 'email')
      .populate('replies.user', 'email')
      .sort({ isPinned: -1, lastReplyAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)

    const total = await ForumThread.countDocuments({
      forum: forumId,
      isDeleted: false,
    })

    res.status(200).json({
      success: true,
      data: threads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Error fetching forum threads:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum threads',
      error: error.message,
    })
  }
}

// @desc    Get single forum thread
// @route   GET /api/community/threads/:id
// @access  Public
export const getForumThread = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id)
      .populate('forum', 'name category')
      .populate('author', 'email')
      .populate('replies.user', 'email')
      .populate('replies.likes.user', 'email')

    if (!thread || thread.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found',
      })
    }

    // Increment views
    thread.views += 1
    await thread.save()

    res.status(200).json({
      success: true,
      data: thread,
    })
  } catch (error) {
    console.error('Error fetching forum thread:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum thread',
      error: error.message,
    })
  }
}

// @desc    Create a forum thread
// @route   POST /api/community/forums/:forumId/threads
// @access  Private
export const createForumThread = async (req, res) => {
  try {
    const { forumId } = req.params
    const { title, content, tags } = req.body

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      })
    }

    const forum = await Forum.findById(forumId)
    if (!forum || !forum.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found',
      })
    }

    const thread = await ForumThread.create({
      forum: forumId,
      author: req.user.id,
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
    })

    // Update forum thread count
    forum.threadCount += 1
    forum.lastActivity = new Date()
    await forum.save()

    const populatedThread = await ForumThread.findById(thread._id)
      .populate('author', 'email')
      .populate('forum', 'name category')

    res.status(201).json({
      success: true,
      message: 'Thread created successfully',
      data: populatedThread,
    })
  } catch (error) {
    console.error('Error creating forum thread:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create thread',
      error: error.message,
    })
  }
}

// @desc    Reply to a forum thread
// @route   POST /api/community/threads/:id/replies
// @access  Private
export const addThreadReply = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required',
      })
    }

    const thread = await ForumThread.findById(req.params.id)

    if (!thread || thread.isDeleted || thread.isLocked) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found or locked',
      })
    }

    thread.replies.push({
      user: req.user.id,
      content: content.trim(),
    })

    thread.lastReplyAt = new Date()
    await thread.save()

    // Update forum last activity
    const forum = await Forum.findById(thread.forum)
    if (forum) {
      forum.lastActivity = new Date()
      await forum.save()
    }

    const populatedThread = await ForumThread.findById(thread._id)
      .populate('author', 'email')
      .populate('replies.user', 'email')
      .populate('forum', 'name category')

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: populatedThread,
    })
  } catch (error) {
    console.error('Error adding reply:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message,
    })
  }
}

// ==================== EVENTS ====================

// @desc    Get all events
// @route   GET /api/community/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { type, upcoming = true } = req.query
    const query = { isPublished: true }

    if (type) {
      query.type = type
    }

    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() }
    }

    const events = await Event.find(query)
      .populate('organizer', 'email')
      .populate('attendees.user', 'email')
      .sort({ startDate: 1 })

    res.status(200).json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    })
  }
}

// @desc    Create an event
// @route   POST /api/community/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      link,
      maxAttendees,
      image,
    } = req.body

    if (!title || !description || !type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      })
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: location || 'Online',
      link: link || '',
      maxAttendees: maxAttendees || null,
      image: image || '',
      organizer: req.user.id,
    })

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'email')

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
    })
  }
}

// @desc    Register for an event
// @route   POST /api/community/events/:id/register
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event || !event.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    // Check if already registered
    const alreadyRegistered = event.attendees.some(
      (attendee) => attendee.user.toString() === req.user.id
    )

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      })
    }

    // Check if event is full
    if (
      event.maxAttendees &&
      event.attendees.length >= event.maxAttendees
    ) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      })
    }

    event.attendees.push({ user: req.user.id })
    await event.save()

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'email')
      .populate('attendees.user', 'email')

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: populatedEvent,
    })
  } catch (error) {
    console.error('Error registering for event:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message,
    })
  }
}

// ==================== RESOURCES ====================

// @desc    Get all resources
// @route   GET /api/community/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { category, type, featured, limit = 20, page = 1 } = req.query
    const query = { isPublished: true }

    if (category) {
      query.category = category
    }

    if (type) {
      query.type = type
    }

    if (featured === 'true') {
      query.isFeatured = true
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const resources = await Resource.find(query)
      .populate('author', 'email')
      .populate('likes.user', 'email')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)

    const total = await Resource.countDocuments(query)

    res.status(200).json({
      success: true,
      data: resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message,
    })
  }
}

// @desc    Create a resource
// @route   POST /api/community/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      url,
      fileUrl,
      tags,
    } = req.body

    if (!title || !description || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      })
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      url: url || '',
      fileUrl: fileUrl || '',
      tags: tags || [],
      author: req.user.id,
    })

    const populatedResource = await Resource.findById(resource._id)
      .populate('author', 'email')

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: populatedResource,
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message,
    })
  }
}

// ==================== SHOWCASE ====================

// @desc    Get all showcase items
// @route   GET /api/community/showcase
// @access  Public
export const getShowcase = async (req, res) => {
  try {
    const { type, limit = 20, page = 1 } = req.query
    const query = { isPublished: true }

    if (type) {
      query.type = type
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const showcase = await Showcase.find(query)
      .populate('author', 'email')
      .populate('likes.user', 'email')
      .populate('comments.user', 'email')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)

    const total = await Showcase.countDocuments(query)

    res.status(200).json({
      success: true,
      data: showcase,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Error fetching showcase:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch showcase',
      error: error.message,
    })
  }
}

// @desc    Create a showcase item
// @route   POST /api/community/showcase
// @access  Private
export const createShowcase = async (req, res) => {
  try {
    const { title, description, type, images, link, tags } = req.body

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and type are required',
      })
    }

    const showcase = await Showcase.create({
      title: title.trim(),
      description: description.trim(),
      type,
      images: images || [],
      link: link || '',
      tags: tags || [],
      author: req.user.id,
    })

    const populatedShowcase = await Showcase.findById(showcase._id)
      .populate('author', 'email')

    res.status(201).json({
      success: true,
      message: 'Showcase item created successfully',
      data: populatedShowcase,
    })
  } catch (error) {
    console.error('Error creating showcase:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create showcase item',
      error: error.message,
    })
  }
}

