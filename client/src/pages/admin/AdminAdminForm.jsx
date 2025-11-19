import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiHome, HiEye, HiEyeSlash } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { validatePassword, calculatePasswordStrength } from '../../utils/passwordValidator.js'
import '../../styles/pages/admin-form.css'

function AdminAdminForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { isAuthenticated, admin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(null)

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

    if (isEdit) {
      fetchAdmin()
    }
  }, [id, isAuthenticated, navigate, isEdit, admin])

  const fetchAdmin = async () => {
    try {
      const response = await adminAPI.getAdminById(id)
      if (response.success) {
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          password: '',
          role: response.data.role || 'admin',
          isActive: response.data.isActive !== undefined ? response.data.isActive : true,
        })
      }
    } catch (error) {
      setError('Failed to fetch admin')
      toast.error('Failed to fetch admin')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Check password strength
    if (name === 'password' && value) {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    } else if (name === 'password' && !value) {
      setPasswordStrength(null)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Check password strength for new password
    if (name === 'newPassword' && value) {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    } else if (name === 'newPassword' && !value) {
      setPasswordStrength(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate password if creating new admin
      if (!isEdit && formData.password) {
        const validation = validatePassword(formData.password)
        if (!validation.valid) {
          setError(validation.errors.join(', '))
          toast.error('Password does not meet security requirements')
          setLoading(false)
          return
        }
      }

      const updateData = { ...formData }
      // Don't send password in regular update
      delete updateData.password

      const response = isEdit
        ? await adminAPI.updateAdmin(id, updateData)
        : await adminAPI.createAdmin(formData)

      if (response.success) {
        toast.success(isEdit ? 'Admin updated successfully!' : 'Admin created successfully!')
        navigate('/admin/admins')
      } else {
        const errorMsg = response.message || 'Failed to save admin'
        const errorDetails = error.response?.data?.errors || []
        const fullErrorMsg = errorDetails.length > 0 
          ? `${errorMsg}: ${errorDetails.map(e => e.message || e).join(', ')}`
          : errorMsg
        setError(fullErrorMsg)
        toast.error(fullErrorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save admin'
      const errorDetails = error.response?.data?.errors || []
      const fullErrorMsg = errorDetails.length > 0 
        ? `${errorMsg}: ${errorDetails.map(e => e.message || e.msg || e).join(', ')}`
        : errorMsg
      setError(fullErrorMsg)
      toast.error(fullErrorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    // Validate password strength
    const validation = validatePassword(passwordData.newPassword)
    if (!validation.valid) {
      toast.error(validation.errors[0] || 'Password does not meet security requirements')
      setError(validation.errors.join(', '))
      return
    }

    setLoading(true)

    try {
      const response = await adminAPI.changePassword(id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      if (response.success) {
        toast.success('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordChange(false)
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const isOwnProfile = admin?._id === id

  return (
    <div className="admin-form-page">
      <div className="admin-form-container">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard" className="admin-breadcrumb-link">
            <HiHome /> Dashboard
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <Link to="/admin/admins" className="admin-breadcrumb-link">
            Admins
          </Link>
          <span className="admin-breadcrumb-separator">/</span>
          <span className="admin-breadcrumb-current">
            {isEdit ? 'Edit Admin' : 'New Admin'}
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
            <h1>{isEdit ? 'Edit Admin' : 'Create New Admin'}</h1>
          </div>
          <button onClick={() => navigate('/admin/admins')} className="admin-back-btn">
            ← Back to Admins
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isEdit && !isOwnProfile}
                placeholder="e.g., john_doe"
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Lowercase letters, numbers, and underscores only
              </small>
            </div>
            <div className="admin-form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {!isEdit && (
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters with uppercase, lowercase, number, and special character"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                    }}
                  >
                    {showPassword ? <HiEyeSlash /> : <HiEye />}
                  </button>
                </div>
                {passwordStrength && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(passwordStrength.level / 4) * 100}%`,
                          height: '100%',
                          backgroundColor: passwordStrength.color,
                          transition: 'all 0.3s'
                        }} />
                      </div>
                      <span style={{ 
                        fontSize: '12px', 
                        color: passwordStrength.color,
                        fontWeight: '600'
                      }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
                <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Requirements: 8+ characters, uppercase, lowercase, number, special character
                </small>
              </div>
            </div>
          )}

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={isEdit && isOwnProfile}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="dev">Dev</option>
              </select>
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Super Admin: Full access including admin management<br />
                Admin: Content management access<br />
                Dev: Development/testing access
              </small>
            </div>
            {isEdit && (
              <div className="admin-form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isOwnProfile}
                  />
                  Active
                </label>
                {isOwnProfile && (
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    You cannot deactivate your own account
                  </small>
                )}
              </div>
            )}
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate('/admin/admins')} className="admin-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Admin' : 'Create Admin'}
            </button>
          </div>
        </form>

        {isEdit && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
            {!showPasswordChange ? (
              <button
                type="button"
                onClick={() => setShowPasswordChange(true)}
                className="admin-action-btn"
                style={{ backgroundColor: '#6b7280' }}
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Current Password *</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>New Password *</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters with uppercase, lowercase, number, and special character"
                    />
                    {passwordStrength && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <div style={{
                            flex: 1,
                            height: '4px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(passwordStrength.level / 4) * 100}%`,
                              height: '100%',
                              backgroundColor: passwordStrength.color,
                              transition: 'all 0.3s'
                            }} />
                          </div>
                          <span style={{ 
                            fontSize: '12px', 
                            color: passwordStrength.color,
                            fontWeight: '600'
                          }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      Requirements: 8+ characters, uppercase, lowercase, number, special character
                    </small>
                  </div>
                  <div className="admin-form-group">
                    <label>Confirm New Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="admin-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-submit-btn" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAdminForm

