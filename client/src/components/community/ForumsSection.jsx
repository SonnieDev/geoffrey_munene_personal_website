import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { communityAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { HiChatBubbleLeftRight, HiPlus, HiEye, HiClock } from 'react-icons/hi2'
import ForumIcon from '../admin/ForumIcon'
import SkeletonLoader from '../SkeletonLoader'
import toast from 'react-hot-toast'
import '../../styles/components/forums-section.css'

function ForumsSection() {
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  const [forums, setForums] = useState([])
  const [selectedForum, setSelectedForum] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateThread, setShowCreateThread] = useState(false)
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchForums()
  }, [])

  useEffect(() => {
    if (selectedForum) {
      fetchThreads(selectedForum._id)
    }
  }, [selectedForum])

  const fetchForums = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getForums()
      setForums(response.data || [])
      if (response.data && response.data.length > 0) {
        setSelectedForum(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching forums:', error)
      toast.error('Failed to load forums')
    } finally {
      setLoading(false)
    }
  }

  const fetchThreads = async (forumId) => {
    try {
      setLoading(true)
      const response = await communityAPI.getForumThreads(forumId, { limit: 20 })
      setThreads(response.data || [])
    } catch (error) {
      console.error('Error fetching threads:', error)
      toast.error('Failed to load threads')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateThread = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to create a thread')
      return
    }

    if (!newThread.title.trim() || !newThread.content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const tags = newThread.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await communityAPI.createForumThread(selectedForum._id, {
        title: newThread.title,
        content: newThread.content,
        tags,
      })

      toast.success('Thread created successfully!')
      setNewThread({ title: '', content: '', tags: '' })
      setShowCreateThread(false)
      fetchThreads(selectedForum._id)
    } catch (error) {
      console.error('Error creating thread:', error)
      toast.error(error.response?.data?.message || 'Failed to create thread')
    } finally {
      setSubmitting(false)
    }
  }

  const handleThreadClick = (threadId) => {
    navigate(`/community/thread/${threadId}`)
  }

  const getCategoryName = (category) => {
    const names = {
      'business-growth': 'Business Growth',
      'remote-work': 'Remote Work',
      'productivity': 'Productivity',
      'content-strategy': 'Content Strategy',
      'networking': 'Networking',
      'tools-resources': 'Tools & Resources',
      'general': 'General',
    }
    return names[category] || category
  }

  const getAuthorEmail = (author) => {
    if (typeof author === 'string') return author
    return author?.email || 'Anonymous'
  }

  if (loading && forums.length === 0) {
    return <SkeletonLoader type="blog-card" count={3} />
  }

  return (
    <div className="forums-section">
      <div className="forums-layout">
        {/* Forums Sidebar */}
        <div className="forums-sidebar">
          <h3 className="sidebar-title">Forums</h3>
          <div className="forums-list">
            {forums.map((forum) => (
              <button
                key={forum._id}
                className={`forum-item ${selectedForum?._id === forum._id ? 'active' : ''}`}
                onClick={() => setSelectedForum(forum)}
              >
                <span className="forum-icon">
                  <ForumIcon icon={forum.icon} size={20} />
                </span>
                <div className="forum-info">
                  <span className="forum-name">{forum.name}</span>
                  <span className="forum-category">{getCategoryName(forum.category)}</span>
                </div>
                <span className="forum-thread-count">{forum.threadCount || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Threads Content */}
        <div className="forums-content">
          {selectedForum && (
            <>
              <div className="forums-header">
                <div>
                  <h2 className="forum-title">
                    <span className="forum-icon-large">
                      <ForumIcon icon={selectedForum.icon} size={32} />
                    </span>
                    {selectedForum.name}
                  </h2>
                  <p className="forum-description">{selectedForum.description}</p>
                </div>
                {isAuthenticated && (
                  <button
                    className="create-thread-btn"
                    onClick={() => setShowCreateThread(!showCreateThread)}
                  >
                    <HiPlus />
                    <span>New Thread</span>
                  </button>
                )}
              </div>

              {showCreateThread && (
                <form className="create-thread-form" onSubmit={handleCreateThread}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={newThread.title}
                      onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                      placeholder="Thread title"
                      className="thread-title-input"
                      maxLength={200}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      value={newThread.content}
                      onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                      placeholder="Thread content"
                      className="thread-content-input"
                      rows="6"
                      maxLength={10000}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={newThread.tags}
                      onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
                      placeholder="Tags (comma separated)"
                      className="thread-tags-input"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowCreateThread(false)
                        setNewThread({ title: '', content: '', tags: '' })
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting || !newThread.title.trim() || !newThread.content.trim()}
                    >
                      {submitting ? 'Creating...' : 'Create Thread'}
                    </button>
                  </div>
                </form>
              )}

              <div className="threads-list">
                {loading ? (
                  <SkeletonLoader type="blog-card" count={3} />
                ) : threads.length === 0 ? (
                  <div className="empty-state">
                    <p>No threads yet. Be the first to start a discussion!</p>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <div
                      key={thread._id}
                      className={`thread-card ${thread.isPinned ? 'pinned' : ''}`}
                      onClick={() => handleThreadClick(thread._id)}
                    >
                      {thread.isPinned && <span className="pinned-badge">📌 Pinned</span>}
                      <div className="thread-header">
                        <h3 className="thread-title">{thread.title}</h3>
                        {thread.tags && thread.tags.length > 0 && (
                          <div className="thread-tags">
                            {thread.tags.map((tag, index) => (
                              <span key={index} className="tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="thread-meta">
                        <span className="thread-author">
                          By {getAuthorEmail(thread.author)?.split('@')[0] || 'Anonymous'}
                        </span>
                        <span className="thread-stats">
                          <HiChatBubbleLeftRight />
                          {thread.replies?.length || 0} replies
                        </span>
                        <span className="thread-stats">
                          <HiEye />
                          {thread.views || 0} views
                        </span>
                        <span className="thread-time">
                          <HiClock />
                          {new Date(thread.lastReplyAt || thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForumsSection

