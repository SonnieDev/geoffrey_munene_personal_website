import { useState, useEffect } from 'react'
import { communityAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { HiHeart, HiChatBubbleLeft, HiLink, HiPlus, HiStar } from 'react-icons/hi2'
import SkeletonLoader from '../SkeletonLoader'
import toast from 'react-hot-toast'
import '../../styles/components/showcase-section.css'

function ShowcaseSection() {
  const { isAuthenticated, user } = useUser()
  const [showcase, setShowcase] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
  })
  const [showCreateShowcase, setShowCreateShowcase] = useState(false)
  const [newShowcase, setNewShowcase] = useState({
    title: '',
    description: '',
    type: 'project',
    link: '',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchShowcase()
  }, [filters])

  const fetchShowcase = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.type) params.type = filters.type
      
      const response = await communityAPI.getShowcase(params)
      setShowcase(response.data || [])
    } catch (error) {
      console.error('Error fetching showcase:', error)
      toast.error('Failed to load showcase')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShowcase = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to showcase your work')
      return
    }

    if (!newShowcase.title || !newShowcase.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const tags = newShowcase.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await communityAPI.createShowcase({
        ...newShowcase,
        tags,
      })

      toast.success('Showcase item created successfully!')
      setNewShowcase({
        title: '',
        description: '',
        type: 'project',
        link: '',
        tags: '',
      })
      setShowCreateShowcase(false)
      fetchShowcase()
    } catch (error) {
      console.error('Error creating showcase:', error)
      toast.error(error.response?.data?.message || 'Failed to create showcase')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (showcaseId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like showcase items')
      return
    }

    // Note: Like functionality would need to be added to the API
    toast.success('Like functionality coming soon!')
  }

  const getTypeName = (type) => {
    const names = {
      project: 'Project',
      achievement: 'Achievement',
      portfolio: 'Portfolio',
      'case-study': 'Case Study',
    }
    return names[type] || type
  }

  const getAuthorEmail = (author) => {
    if (typeof author === 'string') return author
    return author?.email || 'Anonymous'
  }

  return (
    <div className="showcase-section">
      <div className="showcase-header">
        <div>
          <h2>Showcase & Portfolio Corner</h2>
          <p>Share your projects, achievements, and success stories</p>
        </div>
        {isAuthenticated && (
          <button
            className="create-showcase-btn"
            onClick={() => setShowCreateShowcase(!showCreateShowcase)}
          >
            <HiPlus />
            <span>Showcase Work</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="showcase-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="project">Project</option>
          <option value="achievement">Achievement</option>
          <option value="portfolio">Portfolio</option>
          <option value="case-study">Case Study</option>
        </select>
      </div>

      {showCreateShowcase && (
        <form className="create-showcase-form" onSubmit={handleCreateShowcase}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newShowcase.title}
                onChange={(e) => setNewShowcase({ ...newShowcase, title: e.target.value })}
                placeholder="Showcase title"
                required
              />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select
                value={newShowcase.type}
                onChange={(e) => setNewShowcase({ ...newShowcase, type: e.target.value })}
                required
              >
                <option value="project">Project</option>
                <option value="achievement">Achievement</option>
                <option value="portfolio">Portfolio</option>
                <option value="case-study">Case Study</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={newShowcase.description}
              onChange={(e) => setNewShowcase({ ...newShowcase, description: e.target.value })}
              placeholder="Describe your work, achievement, or project"
              rows="6"
              maxLength={2000}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Link (optional)</label>
              <input
                type="url"
                value={newShowcase.link}
                onChange={(e) => setNewShowcase({ ...newShowcase, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={newShowcase.tags}
                onChange={(e) => setNewShowcase({ ...newShowcase, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowCreateShowcase(false)
                setNewShowcase({
                  title: '',
                  description: '',
                  type: 'project',
                  link: '',
                  tags: '',
                })
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Showcase'}
            </button>
          </div>
        </form>
      )}

      <div className="showcase-grid">
        {loading ? (
          <SkeletonLoader type="blog-card" count={3} />
        ) : showcase.length === 0 ? (
          <div className="empty-state">
            <p>No showcase items yet. Be the first to share your work!</p>
          </div>
        ) : (
          showcase.map((item) => (
            <div key={item._id} className={`showcase-card ${item.isFeatured ? 'featured' : ''}`}>
              {item.isFeatured && (
                <div className="featured-badge">
                  <HiStar />
                  <span>Featured</span>
                </div>
              )}
              <div className="showcase-header-card">
                <div className="showcase-author">
                  <div className="author-avatar">
                    {getAuthorEmail(item.author)?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="author-info">
                    <span className="author-name">
                      {getAuthorEmail(item.author)?.split('@')[0] || 'Anonymous'}
                    </span>
                    <span className="showcase-type">{getTypeName(item.type)}</span>
                  </div>
                </div>
                <span className="showcase-type-badge">{getTypeName(item.type)}</span>
              </div>
              <h3 className="showcase-title">{item.title}</h3>
              <p className="showcase-description">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="showcase-tags">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="showcase-actions">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="showcase-link"
                  >
                    <HiLink />
                    <span>View</span>
                  </a>
                )}
                <button
                  className="action-btn like-btn"
                  onClick={() => handleLike(item._id)}
                  disabled={!isAuthenticated}
                >
                  <HiHeart />
                  <span>{item.likes?.length || 0}</span>
                </button>
                <div className="action-btn comment-btn">
                  <HiChatBubbleLeft />
                  <span>{item.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ShowcaseSection

