import express from 'express'
import {
  getChannelId,
  getChannelVideos,
  getChannelPlaylists,
} from '../controllers/youtubeController.js'

const router = express.Router()

// Routes
router.get('/channel-id', getChannelId)
router.get('/videos', getChannelVideos)
router.get('/playlists', getChannelPlaylists)

export default router

