import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiPlus, HiPencil, HiTrash, HiHome, HiChatBubbleLeftRight } from 'react-icons/hi2'
import AdminHeader from '../../components/AdminHeader'
import ForumIcon from '../../components/admin/ForumIcon'
import toast from 'react-hot-toast'
import '../../styles/pages/admin-forums.css'

function AdminForums() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchForums()
  }, [isAuthenticated, navigate])

  const fetchForums = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllForums()
      if (response.success) {
        setForums(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch forums')
      console.error(error)
      toast.error('Failed to load forums')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this forum? This action cannot be undone if it has threads.')) {
      return
    }

    try {
      const response = await adminAPI.deleteForum(id)
      if (response.success) {
        toast.success('Forum deleted successfully')
        setForums(forums.filter((forum) => forum._id !== id))
      } else {
        toast.error(response.message || 'Failed to delete forum')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete forum')
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

  if (loading) {
    return <div className="admin-loading">Loading forums...</div>
  }

  return (
    <div className="admin-forums">
      <div className="admin-breadcrumb">
        <Link to="/admin/dashboard" className="admin-breadcrumb-link">
          <HiHome /> Dashboard
        </Link>
        <span className="admin-breadcrumb-separator">/</span>
        <span className="admin-breadcrumb-current">Forums</span>
      </div>

      <AdminHeader
        title="Forum Management"
        showBackButton={true}
        actionButton={
          <Link to="/admin/forums/new" className="admin-add-btn">
            <HiPlus /> Add New Forum
          </Link>
        }
      />

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Threads</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forums.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-empty">
                  No forums found. <Link to="/admin/forums/new">Create your first forum</Link>
                </td>
              </tr>
            ) : (
              forums.map((forum) => (
                <tr key={forum._id}>
                  <td className="forum-icon-cell">
                    <div className="forum-icon-display">
                      <ForumIcon icon={forum.icon} size={24} />
                    </div>
                  </td>
                  <td className="admin-title-cell">{forum.name}</td>
                  <td>
                    <span className="admin-badge category">{getCategoryName(forum.category)}</span>
                  </td>
                  <td className="forum-description-cell">{forum.description}</td>
                  <td>{forum.threadCount || 0}</td>
                  <td>
                    <span className={`admin-badge ${forum.isActive ? 'published' : 'draft'}`}>
                      {forum.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/forums/edit/${forum._id}`}
                        className="admin-action-btn edit"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(forum._id)}
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

export default AdminForums

