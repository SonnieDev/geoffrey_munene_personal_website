import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiHome } from 'react-icons/hi2'
import '../../styles/pages/admin-form.css'

function AdminTestimonialForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    avatar: '',
    published: true,
    featured: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    if (isEdit) {
      fetchTestimonial()
    }
  }, [id, isAuthenticated, navigate, isEdit])

  const fetchTestimonial = async () => {
    try {
      const response = await adminAPI.getTestimonialById(id)
      if (response.success) {
        setFormData(response.data)
      }
    } catch (error) {
      setError('Failed to fetch testimonial')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 5 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isEdit
        ? await adminAPI.updateTestimonial(id, formData)
        : await adminAPI.createTestimonial(formData)

      if (response.success) {
        navigate('/admin/testimonials')
      } else {
        setError(response.message || 'Failed to save testimonial')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save testimonial')
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
          <Link to="/admin/testimonials" className="admin-breadcrumb-link">
            Testimonials
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">
            {isEdit ? 'Edit Testimonial' : 'New Testimonial'}
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
            <h1>{isEdit ? 'Edit Testimonial' : 'Create New Testimonial'}</h1>
          </div>
          <button onClick={() => navigate('/admin/testimonials')} className="admin-back-btn">
            ← Back to Testimonials
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Sarah Johnson"
              />
            </div>
            <div className="admin-form-group">
              <label>Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g., Digital Marketing Manager"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Testimonial Text *</label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Enter the testimonial text here..."
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Rating *</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Avatar URL (Optional)</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                If not provided, initials will be used
              </small>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />
                Published
              </label>
            </div>
            <div className="admin-form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate('/admin/testimonials')} className="admin-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminTestimonialForm

