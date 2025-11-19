import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiPlus, HiPencil, HiTrash, HiEye, HiArrowLeft, HiHome } from 'react-icons/hi2'
import '../../styles/pages/admin-blogs.css'

function AdminBlogs() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchBlogs()
  }, [isAuthenticated, navigate])

  const fetchBlogs = async () => {
    try {
      const response = await adminAPI.getAllBlogs()
      if (response.success) {
        setBlogs(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch blogs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      const response = await adminAPI.deleteBlog(id)
      if (response.success) {
        setBlogs(blogs.filter((blog) => blog._id !== id))
      }
    } catch (error) {
      alert('Failed to delete blog post')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading blogs...</div>
  }

  return (
    <div className="admin-blogs">
      <div className="admin-breadcrumb">
        <Link to="/admin/dashboard" className="admin-breadcrumb-link">
          <HiHome /> Dashboard
        </Link>
        <span className="admin-breadcrumb-separator">/</span>
        <span className="admin-breadcrumb-current">Blog Posts</span>
      </div>

      <div className="admin-page-header">
        <div className="admin-page-title-section">
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="admin-back-dashboard-btn"
            title="Back to Dashboard"
          >
            <HiArrowLeft /> Back to Dashboard
          </button>
          <h1>Blog Management</h1>
        </div>
        <Link to="/admin/blogs/new" className="admin-add-btn">
          <HiPlus /> Add New Blog
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-empty">
                  No blogs found. <Link to="/admin/blogs/new">Create your first blog post</Link>
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="admin-title-cell">{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>
                    <span className={`admin-badge ${blog.published ? 'published' : 'draft'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    {blog.featured && (
                      <span className="admin-badge featured">Featured</span>
                    )}
                  </td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/blog/${blog._id}`}
                        target="_blank"
                        className="admin-action-btn view"
                        title="View"
                      >
                        <HiEye />
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="admin-action-btn edit"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
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

export default AdminBlogs

