import { useState, useEffect } from 'react'
import { communityAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { 
  HiHeart, 
  HiChatBubbleLeft, 
  HiTrash, 
  HiPlus,
  HiSparkles,
  HiLightBulb,
  HiTrophy,
  HiExclamationTriangle,
  HiQuestionMarkCircle,
  HiChatBubbleOvalLeft
} from 'react-icons/hi2'
import SkeletonLoader from '../SkeletonLoader'
import toast from 'react-hot-toast'
import '../../styles/components/community-feed.css'

function CommunityFeed() {
  const { isAuthenticated, user } = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'general',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getPosts({ limit: 20 })
      setPosts(response.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load community posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to create a post')
      return
    }

    if (!newPost.content.trim()) {
      toast.error('Please enter some content')
      return
    }

    try {
      setSubmitting(true)
      const tags = newPost.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await communityAPI.createPost({
        content: newPost.content,
        type: newPost.type,
        tags,
      })

      toast.success('Post created successfully!')
      setNewPost({ content: '', type: 'general', tags: '' })
      setShowCreatePost(false)
      fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return
    }

    try {
      await communityAPI.togglePostLike(postId)
      fetchPosts()
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to like post')
    }
  }

  const handleAddComment = async (postId, content) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }

    try {
      await communityAPI.addPostComment(postId, content)
      toast.success('Comment added!')
      fetchPosts()
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await communityAPI.deletePost(postId)
      toast.success('Post deleted')
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const isLiked = (post) => {
    if (!user || !post.likes) return false
    return post.likes.some((like) => like.user?._id === user.id || like.user === user.id)
  }

  const getAuthorEmail = (author) => {
    if (typeof author === 'string') return author
    return author?.email || 'Anonymous'
  }

  return (
    <div className="community-feed">
      {/* Create Post Section */}
      {isAuthenticated && (
        <div className="feed-create-section">
          {!showCreatePost ? (
            <button
              className="create-post-btn"
              onClick={() => setShowCreatePost(true)}
            >
              <HiPlus />
              <span>Share something with the community</span>
            </button>
          ) : (
            <form className="create-post-form" onSubmit={handleCreatePost}>
              <div className="form-group">
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                  className="post-type-select"
                >
                  <option value="general">General</option>
                  <option value="update">Update</option>
                  <option value="insight">Insight</option>
                  <option value="win">Win</option>
                  <option value="challenge">Challenge</option>
                  <option value="question">Question</option>
                </select>
              </div>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind?"
                className="post-content-input"
                rows="4"
                maxLength={5000}
              />
              <div className="form-group">
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="Tags (comma separated)"
                  className="post-tags-input"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreatePost(false)
                    setNewPost({ content: '', type: 'general', tags: '' })
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || !newPost.content.trim()}
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Posts Feed */}
      <div className="feed-posts">
        {loading ? (
          <SkeletonLoader type="blog-card" count={3} />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className={`feed-post ${post.isPinned ? 'pinned' : ''}`}>
              {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">
                    {getAuthorEmail(post.author)?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="author-info">
                    <span className="author-name">
                      {getAuthorEmail(post.author)?.split('@')[0] || 'Anonymous'}
                    </span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                {post.type !== 'general' && (
                  <span className={`post-type-badge type-${post.type}`}>
                    {post.type === 'update' && <HiSparkles />}
                    {post.type === 'insight' && <HiLightBulb />}
                    {post.type === 'win' && <HiTrophy />}
                    {post.type === 'challenge' && <HiExclamationTriangle />}
                    {post.type === 'question' && <HiQuestionMarkCircle />}
                    <span>{post.type}</span>
                  </span>
                )}
                {isAuthenticated &&
                  (post.author?._id === user?.id || post.author === user?.id) && (
                    <button
                      className="delete-post-btn"
                      onClick={() => handleDeletePost(post._id)}
                      title="Delete post"
                    >
                      <HiTrash />
                    </button>
                  )}
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="post-actions">
                <button
                  className={`action-btn like-btn ${isLiked(post) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                  disabled={!isAuthenticated}
                >
                  <HiHeart />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button
                  className="action-btn comment-btn"
                  onClick={() => {
                    const comment = prompt('Enter your comment:')
                    if (comment && comment.trim()) {
                      handleAddComment(post._id, comment)
                    }
                  }}
                  disabled={!isAuthenticated}
                >
                  <HiChatBubbleLeft />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  {post.comments.slice(0, 3).map((comment, index) => (
                    <div key={index} className="comment">
                      <span className="comment-author">
                        {getAuthorEmail(comment.user)?.split('@')[0] || 'Anonymous'}:
                      </span>
                      <span className="comment-content">{comment.content}</span>
                    </div>
                  ))}
                  {post.comments.length > 3 && (
                    <p className="more-comments">
                      +{post.comments.length - 3} more comments
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommunityFeed

