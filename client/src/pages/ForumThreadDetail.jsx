import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { communityAPI } from '../services/api'
import { useUser } from '../contexts/UserContext'
import { HiArrowLeft, HiHeart, HiChatBubbleLeft, HiClock, HiEye } from 'react-icons/hi2'
import SkeletonLoader from '../components/SkeletonLoader'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import '../styles/pages/forum-thread-detail.css'

function ForumThreadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useUser()
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchThread()
  }, [id])

  const fetchThread = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getForumThread(id)
      setThread(response.data)
    } catch (error) {
      console.error('Error fetching thread:', error)
      toast.error('Failed to load thread')
      navigate('/community')
    } finally {
      setLoading(false)
    }
  }

  const handleAddReply = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to reply')
      return
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    try {
      setSubmitting(true)
      await communityAPI.addThreadReply(id, replyContent)
      toast.success('Reply added!')
      setReplyContent('')
      fetchThread()
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error(error.response?.data?.message || 'Failed to add reply')
    } finally {
      setSubmitting(false)
    }
  }

  const getAuthorEmail = (author) => {
    if (typeof author === 'string') return author
    return author?.email || 'Anonymous'
  }

  if (loading) {
    return (
      <div className="forum-thread-detail-page">
        <SkeletonLoader type="blog-card" count={3} />
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="forum-thread-detail-page">
        <div className="empty-state">
          <p>Thread not found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${thread.title} - Community Forum`}
        description={thread.content.substring(0, 160)}
        url={`/community/thread/${id}`}
      />
      <div className="forum-thread-detail-page">
        <div className="thread-detail-container">
          <button className="back-btn" onClick={() => navigate('/community')}>
            <HiArrowLeft />
            <span>Back to Community</span>
          </button>

          <div className="thread-detail">
            <div className="thread-header-detail">
              <div>
                <h1 className="thread-title-detail">{thread.title}</h1>
                <div className="thread-meta-detail">
                  <span className="thread-author-detail">
                    By {getAuthorEmail(thread.author)?.split('@')[0] || 'Anonymous'}
                  </span>
                  <span className="thread-date">
                    <HiClock />
                    {new Date(thread.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="thread-views">
                    <HiEye />
                    {thread.views || 0} views
                  </span>
                </div>
                {thread.tags && thread.tags.length > 0 && (
                  <div className="thread-tags-detail">
                    {thread.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="thread-content-detail">
              <p>{thread.content}</p>
            </div>

            <div className="thread-replies-section">
              <h2 className="replies-title">
                <HiChatBubbleLeft />
                {thread.replies?.length || 0} Replies
              </h2>

              {isAuthenticated && (
                <form className="reply-form" onSubmit={handleAddReply}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="reply-input"
                    rows="4"
                    maxLength={5000}
                  />
                  <div className="reply-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting || !replyContent.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                  </div>
                </form>
              )}

              <div className="replies-list">
                {thread.replies && thread.replies.length > 0 ? (
                  thread.replies.map((reply, index) => (
                    <div key={index} className="reply-item">
                      <div className="reply-header">
                        <div className="reply-author">
                          <div className="author-avatar-small">
                            {getAuthorEmail(reply.user)?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <span className="reply-author-name">
                              {getAuthorEmail(reply.user)?.split('@')[0] || 'Anonymous'}
                            </span>
                            <span className="reply-date">
                              {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        {reply.isSolution && (
                          <span className="solution-badge">✓ Solution</span>
                        )}
                      </div>
                      <div className="reply-content">
                        <p>{reply.content}</p>
                      </div>
                      {reply.likes && reply.likes.length > 0 && (
                        <div className="reply-likes">
                          <HiHeart />
                          <span>{reply.likes.length}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No replies yet. Be the first to reply!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForumThreadDetail

