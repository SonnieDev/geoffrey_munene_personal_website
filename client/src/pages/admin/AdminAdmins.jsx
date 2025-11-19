import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiPlus, HiPencil, HiTrash, HiShieldCheck, HiHome, HiUser, HiCodeBracket } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import '../../styles/pages/admin-blogs.css'

function AdminAdmins() {
  const { isAuthenticated, admin } = useAuth()
  const navigate = useNavigate()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    
    // Only super admins can access this page
    if (admin?.role !== 'super_admin') {
      toast.error('Access denied. Super admin only.')
      navigate('/admin/dashboard')
      return
    }
    
    fetchAdmins()
  }, [isAuthenticated, navigate, admin])

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAllAdmins()
      if (response.success) {
        setAdmins(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch admins')
      console.error(error)
      toast.error('Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return
    }

    try {
      const response = await adminAPI.deleteAdmin(id)
      if (response.success) {
        setAdmins(admins.filter((admin) => admin._id !== id))
        toast.success('Admin deleted successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin')
    }
  }

  const handleToggleActive = async (adminItem) => {
    try {
      const response = await adminAPI.updateAdmin(adminItem._id, {
        isActive: !adminItem.isActive,
      })
      if (response.success) {
        setAdmins(admins.map(a => a._id === adminItem._id ? response.data : a))
        toast.success(`Admin ${!adminItem.isActive ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update admin')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <HiShieldCheck style={{ color: '#fbbf24' }} />
      case 'admin':
        return <HiUser style={{ color: '#3b82f6' }} />
      case 'dev':
        return <HiCodeBracket style={{ color: '#10b981' }} />
      default:
        return <HiUser />
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return '#fbbf24'
      case 'admin':
        return '#3b82f6'
      case 'dev':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading admins...</div>
  }

  return (
    <div className="admin-blogs">
      <div className="admin-breadcrumb">
        <Link to="/admin/dashboard" className="admin-breadcrumb-link">
          <HiHome /> Dashboard
        </Link>
        <span className="admin-breadcrumb-separator">/</span>
        <span className="admin-breadcrumb-current">Admin Management</span>
      </div>

      <AdminHeader
        title="Admin Management"
        showBackButton={true}
        actionButton={
          <Link to="/admin/admins/new" className="admin-add-btn">
            <HiPlus /> Add New Admin
          </Link>
        }
      />

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-empty">
                  No admins found. <Link to="/admin/admins/new">Create your first admin</Link>
                </td>
              </tr>
            ) : (
              admins.map((adminItem) => (
                <tr key={adminItem._id}>
                  <td className="admin-title-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getRoleIcon(adminItem.role)}
                      {adminItem.username}
                      {adminItem._id === admin?._id && (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>(You)</span>
                      )}
                    </div>
                  </td>
                  <td>{adminItem.email || '-'}</td>
                  <td>
                    <span 
                      className="admin-badge" 
                      style={{ 
                        backgroundColor: getRoleBadgeColor(adminItem.role),
                        color: 'white'
                      }}
                    >
                      {adminItem.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(adminItem)}
                      disabled={adminItem._id === admin?._id}
                      className={`admin-badge ${adminItem.isActive ? 'published' : 'draft'}`}
                      style={{ 
                        cursor: adminItem._id === admin?._id ? 'not-allowed' : 'pointer',
                        opacity: adminItem._id === admin?._id ? 0.6 : 1
                      }}
                    >
                      {adminItem.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    {adminItem.lastLogin 
                      ? new Date(adminItem.lastLogin).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td>{new Date(adminItem.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/admins/edit/${adminItem._id}`}
                        className="admin-action-btn edit"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      {adminItem._id !== admin?._id && (
                        <button
                          onClick={() => handleDelete(adminItem._id)}
                          className="admin-action-btn delete"
                          title="Delete"
                        >
                          <HiTrash />
                        </button>
                      )}
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

export default AdminAdmins

