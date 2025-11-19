import express from 'express'
import {
  // Community Posts
  getCommunityPosts,
  createCommunityPost,
  togglePostLike,
  addPostComment,
  deleteCommunityPost,
  // Forums
  getForums,
  getForumThreads,
  getForumThread,
  createForumThread,
  addThreadReply,
  // Events
  getEvents,
  createEvent,
  registerForEvent,
  // Resources
  getResources,
  createResource,
  // Showcase
  getShowcase,
  createShowcase,
} from '../controllers/communityController.js'
import { protect } from '../middleware/userAuthMiddleware.js'

const router = express.Router()

// Community Posts Routes
router.get('/posts', getCommunityPosts)
router.post('/posts', protect, createCommunityPost)
router.post('/posts/:id/like', protect, togglePostLike)
router.post('/posts/:id/comments', protect, addPostComment)
router.delete('/posts/:id', protect, deleteCommunityPost)

// Forum Routes
router.get('/forums', getForums)
router.get('/forums/:forumId/threads', getForumThreads)
router.post('/forums/:forumId/threads', protect, createForumThread)
router.get('/threads/:id', getForumThread)
router.post('/threads/:id/replies', protect, addThreadReply)

// Event Routes
router.get('/events', getEvents)
router.post('/events', protect, createEvent)
router.post('/events/:id/register', protect, registerForEvent)

// Resource Routes
router.get('/resources', getResources)
router.post('/resources', protect, createResource)

// Showcase Routes
router.get('/showcase', getShowcase)
router.post('/showcase', protect, createShowcase)

export default router

