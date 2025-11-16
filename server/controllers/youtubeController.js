import axios from 'axios'

// @desc    Get YouTube channel ID from channel URL
// @route   GET /api/youtube/channel-id
// @access  Public
export const getChannelId = async (req, res) => {
  try {
    const { channelUrl } = req.query

    if (!channelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Channel URL is required',
      })
    }

    // Extract channel handle or ID from URL
    // Format: https://www.youtube.com/@munenegeoffrey
    const handleMatch = channelUrl.match(/@([^/?]+)/)
    const handle = handleMatch ? handleMatch[1] : null

    if (!handle) {
      return res.status(400).json({
        success: false,
        message: 'Invalid channel URL format',
      })
    }

    // For now, return the handle - we'll use it to construct video URLs
    // In production, you'd use YouTube Data API to get channel ID
    res.status(200).json({
      success: true,
      data: {
        handle,
        channelId: null, // Would be fetched via API
      },
    })
  } catch (error) {
    console.error('Error getting channel ID:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get channel ID',
      error: error.message,
    })
  }
}

// @desc    Get YouTube videos from channel
// @route   GET /api/youtube/videos
// @access  Public
export const getChannelVideos = async (req, res) => {
  try {
    const { channelUrl, maxResults = 10 } = req.query

    if (!channelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Channel URL is required',
      })
    }

    // Extract channel handle from URL
    const handleMatch = channelUrl.match(/@([^/?]+)/)
    const handle = handleMatch ? handleMatch[1] : null

    if (!handle) {
      return res.status(400).json({
        success: false,
        message: 'Invalid channel URL format',
      })
    }

    // If YouTube API key is available, use it
    // Otherwise, return channel info for manual embedding
    const apiKey = process.env.YOUTUBE_API_KEY

    if (apiKey) {
      try {
        // First, get channel ID from handle
        const channelResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              q: handle,
              type: 'channel',
              key: apiKey,
              maxResults: 1,
            },
          }
        )

        const channelId =
          channelResponse.data.items?.[0]?.snippet?.channelId ||
          channelResponse.data.items?.[0]?.id?.channelId

        if (!channelId) {
          throw new Error('Channel not found')
        }

        // Get videos from channel
        const videosResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              channelId: channelId,
              type: 'video',
              order: 'date',
              maxResults: parseInt(maxResults),
              key: apiKey,
            },
          }
        )

        const videos = videosResponse.data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          publishedAt: item.snippet.publishedAt,
          channelTitle: item.snippet.channelTitle,
        }))

        res.status(200).json({
          success: true,
          data: videos,
        })
      } catch (apiError) {
        console.error('YouTube API Error:', apiError.message)
        // Fallback to channel URL method
        return res.status(200).json({
          success: true,
          data: [],
          message: 'YouTube API not configured. Using channel URL method.',
          channelHandle: handle,
        })
      }
    } else {
      // No API key - return channel info for manual embedding
      res.status(200).json({
        success: true,
        data: [],
        message: 'YouTube API key not configured. Add YOUTUBE_API_KEY to .env for automatic video fetching.',
        channelHandle: handle,
        channelUrl: `https://www.youtube.com/@${handle}`,
      })
    }
  } catch (error) {
    console.error('Error getting videos:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get videos',
      error: error.message,
    })
  }
}

// @desc    Get YouTube playlists from channel
// @route   GET /api/youtube/playlists
// @access  Public
export const getChannelPlaylists = async (req, res) => {
  try {
    const { channelUrl } = req.query

    if (!channelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Channel URL is required',
      })
    }

    const handleMatch = channelUrl.match(/@([^/?]+)/)
    const handle = handleMatch ? handleMatch[1] : null

    if (!handle) {
      return res.status(400).json({
        success: false,
        message: 'Invalid channel URL format',
      })
    }

    const apiKey = process.env.YOUTUBE_API_KEY

    if (apiKey) {
      try {
        // Get channel ID
        const channelResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              q: handle,
              type: 'channel',
              key: apiKey,
              maxResults: 1,
            },
          }
        )

        const channelId =
          channelResponse.data.items?.[0]?.snippet?.channelId ||
          channelResponse.data.items?.[0]?.id?.channelId

        if (!channelId) {
          throw new Error('Channel not found')
        }

        // Get playlists
        const playlistsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlists`,
          {
            params: {
              part: 'snippet,contentDetails',
              channelId: channelId,
              maxResults: 10,
              key: apiKey,
            },
          }
        )

        const playlists = playlistsResponse.data.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          videoCount: item.contentDetails.itemCount,
        }))

        res.status(200).json({
          success: true,
          data: playlists,
        })
      } catch (apiError) {
        console.error('YouTube API Error:', apiError.message)
        res.status(200).json({
          success: true,
          data: [],
          message: 'YouTube API not configured',
        })
      }
    } else {
      res.status(200).json({
        success: true,
        data: [],
        message: 'YouTube API key not configured',
      })
    }
  } catch (error) {
    console.error('Error getting playlists:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get playlists',
      error: error.message,
    })
  }
}

