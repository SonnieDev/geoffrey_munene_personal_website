import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiHome } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import ForumIconPicker from '../../components/admin/ForumIconPicker'
import '../../styles/pages/admin-form.css'

function AdminForumForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    icon: 'chat-bubble-left-right',
    isActive: true,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    if (isEdit) {
      fetchForum()
    }
  }, [id, isAuthenticated, navigate, isEdit])

  const fetchForum = async () => {
    try {
      const response = await adminAPI.getForumById(id)
      if (response.success) {
        setFormData(response.data)
      }
    } catch (error) {
      setError('Failed to fetch forum')
      toast.error('Failed to load forum')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isEdit
        ? await adminAPI.updateForum(id, formData)
        : await adminAPI.createForum(formData)

      if (response.success) {
        toast.success(isEdit ? 'Forum updated successfully!' : 'Forum created successfully!')
        navigate('/admin/forums')
      } else {
        const errorMsg = response.message || 'Failed to save forum'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to save forum'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard" className="admin-breadcrumb-link">
            <HiHome /> Dashboard
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <Link to="/admin/forums" className="admin-breadcrumb-link">
            Forums
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">
            {isEdit ? 'Edit Forum' : 'New Forum'}
          </span>
        </div>

        <div className="admin-form-header">
          <div className="admin-page-title-section">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="admin-back-dashboard-btn"
              title="Back to Dashboard"
            >
              ← Dashboard
            </button>
            <h1>{isEdit ? 'Edit Forum' : 'Create New Forum'}</h1>
          </div>
          <button onClick={() => navigate('/admin/forums')} className="admin-back-btn">
            ← Back to Forums
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Forum Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Business Growth"
              />
            </div>
            <div className="admin-form-group">
              <label>Icon</label>
              <ForumIconPicker
                value={formData.icon}
                onChange={(iconValue) => setFormData({ ...formData, icon: iconValue })}
                category={formData.category}
              />
              <small className="form-help-text">Select an icon or use a custom emoji</small>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Brief description of what this forum is about"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="business-growth">Business Growth</option>
                <option value="remote-work">Remote Work</option>
                <option value="productivity">Productivity</option>
                <option value="content-strategy">Content Strategy</option>
                <option value="networking">Networking</option>
                <option value="tools-resources">Tools & Resources</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active (Forum will be visible to users)
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate('/admin/forums')} className="admin-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Forum' : 'Create Forum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminForumForm

