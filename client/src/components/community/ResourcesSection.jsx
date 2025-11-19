import { useState, useEffect } from 'react'
import { communityAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { HiBookOpen, HiLink, HiArrowDownTray, HiHeart, HiPlus } from 'react-icons/hi2'
import SkeletonLoader from '../SkeletonLoader'
import toast from 'react-hot-toast'
import '../../styles/components/resources-section.css'

function ResourcesSection() {
  const { isAuthenticated } = useUser()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    type: '',
  })
  const [showCreateResource, setShowCreateResource] = useState(false)
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'tip',
    category: 'general',
    url: '',
    fileUrl: '',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchResources()
  }, [filters])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.category) params.category = filters.category
      if (filters.type) params.type = filters.type
      
      const response = await communityAPI.getResources(params)
      setResources(response.data || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResource = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to share a resource')
      return
    }

    if (!newResource.title || !newResource.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const tags = newResource.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await communityAPI.createResource({
        ...newResource,
        tags,
      })

      toast.success('Resource shared successfully!')
      setNewResource({
        title: '',
        description: '',
        type: 'tip',
        category: 'general',
        url: '',
        fileUrl: '',
        tags: '',
      })
      setShowCreateResource(false)
      fetchResources()
    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error(error.response?.data?.message || 'Failed to share resource')
    } finally {
      setSubmitting(false)
    }
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

  const getTypeName = (type) => {
    const names = {
      tip: 'Tip',
      template: 'Template',
      tool: 'Tool',
      guide: 'Guide',
      article: 'Article',
      video: 'Video',
    }
    return names[type] || type
  }

  return (
    <div className="resources-section">
      <div className="resources-header">
        <div>
          <h2>Tips & Resources</h2>
          <p>Curated advice, templates, and shared tools from the community</p>
        </div>
        {isAuthenticated && (
          <button
            className="create-resource-btn"
            onClick={() => setShowCreateResource(!showCreateResource)}
          >
            <HiPlus />
            <span>Share Resource</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="resources-filters">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="business-growth">Business Growth</option>
          <option value="remote-work">Remote Work</option>
          <option value="productivity">Productivity</option>
          <option value="content-strategy">Content Strategy</option>
          <option value="networking">Networking</option>
          <option value="tools-resources">Tools & Resources</option>
          <option value="general">General</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="tip">Tip</option>
          <option value="template">Template</option>
          <option value="tool">Tool</option>
          <option value="guide">Guide</option>
          <option value="article">Article</option>
          <option value="video">Video</option>
        </select>
      </div>

      {showCreateResource && (
        <form className="create-resource-form" onSubmit={handleCreateResource}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                required
              >
                <option value="tip">Tip</option>
                <option value="template">Template</option>
                <option value="tool">Tool</option>
                <option value="guide">Guide</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              placeholder="Resource description"
              rows="4"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={newResource.category}
                onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                required
              >
                <option value="general">General</option>
                <option value="business-growth">Business Growth</option>
                <option value="remote-work">Remote Work</option>
                <option value="productivity">Productivity</option>
                <option value="content-strategy">Content Strategy</option>
                <option value="networking">Networking</option>
                <option value="tools-resources">Tools & Resources</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={newResource.tags}
                onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Resource URL</label>
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>File URL (for downloads)</label>
              <input
                type="url"
                value={newResource.fileUrl}
                onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowCreateResource(false)
                setNewResource({
                  title: '',
                  description: '',
                  type: 'tip',
                  category: 'general',
                  url: '',
                  fileUrl: '',
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
              {submitting ? 'Sharing...' : 'Share Resource'}
            </button>
          </div>
        </form>
      )}

      <div className="resources-grid">
        {loading ? (
          <SkeletonLoader type="blog-card" count={3} />
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <p>No resources found. Be the first to share one!</p>
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource._id} className="resource-card">
              <div className="resource-header">
                <span className="resource-type-badge">{getTypeName(resource.type)}</span>
                <span className="resource-category-badge">{getCategoryName(resource.category)}</span>
              </div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              {resource.tags && resource.tags.length > 0 && (
                <div className="resource-tags">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="resource-actions">
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <HiLink />
                    <span>Visit</span>
                  </a>
                )}
                {resource.fileUrl && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <HiArrowDownTray />
                    <span>Download</span>
                  </a>
                )}
                <div className="resource-likes">
                  <HiHeart />
                  <span>{resource.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ResourcesSection

