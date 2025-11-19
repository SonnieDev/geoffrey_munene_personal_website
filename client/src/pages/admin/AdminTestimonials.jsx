import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiPlus, HiPencil, HiTrash, HiStar, HiHome } from 'react-icons/hi2'
import AdminHeader from '../../components/AdminHeader'
import '../../styles/pages/admin-blogs.css'

function AdminTestimonials() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchTestimonials()
  }, [isAuthenticated, navigate])

  const fetchTestimonials = async () => {
    try {
      const response = await adminAPI.getAllTestimonials()
      if (response.success) {
        setTestimonials(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch testimonials')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await adminAPI.deleteTestimonial(id)
      if (response.success) {
        setTestimonials(testimonials.filter((testimonial) => testimonial._id !== id))
      }
    } catch (error) {
      alert('Failed to delete testimonial')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading testimonials...</div>
  }

  return (
    <div className="admin-blogs">
      <div className="admin-breadcrumb">
        <Link to="/admin/dashboard" className="admin-breadcrumb-link">
          <HiHome /> Dashboard
        </Link>
        <span className="admin-breadcrumb-separator">/</span>
        <span className="admin-breadcrumb-current">Testimonials</span>
      </div>

      <AdminHeader
        title="Testimonials Management"
        showBackButton={true}
        actionButton={
          <Link to="/admin/testimonials/new" className="admin-add-btn">
            <HiPlus /> Add New Testimonial
          </Link>
        }
      />

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-empty">
                  No testimonials found. <Link to="/admin/testimonials/new">Create your first testimonial</Link>
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td className="admin-title-cell">{testimonial.name}</td>
                  <td>{testimonial.role}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <HiStar key={i} style={{ color: '#fbbf24', fontSize: '14px' }} />
                      ))}
                      <span style={{ marginLeft: '4px', fontSize: '14px' }}>({testimonial.rating || 5})</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${testimonial.published ? 'published' : 'draft'}`}>
                      {testimonial.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    {testimonial.featured && (
                      <span className="admin-badge featured">Featured</span>
                    )}
                  </td>
                  <td>{new Date(testimonial.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/testimonials/edit/${testimonial._id}`}
                        className="admin-action-btn edit"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="admin-action-btn delete"
                        title="Delete"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTestimonials

