import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { userAPI, userContentAPI } from '../../services/api'
import UserProtectedRoute from '../../components/UserProtectedRoute'
import SEO from '../../components/SEO'
import toast from 'react-hot-toast'
import {
  HiUser,
  HiCamera,
  HiPencil,
  HiCheck,
  HiXMark,
  HiDocumentText,
  HiSparkles,
  HiChartBar,
} from 'react-icons/hi2'
import '../../styles/pages/user-profile.css'

function Profile() {
  const { user, fetchUser } = useUser()
  const [stats, setStats] = useState({
    totalContent: 0,
    totalTokensUsed: 0,
    totalTokensPurchased: 0,
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
  })

  useEffect(() => {
    fetchStats()
    if (user) {
      setFormData({
        displayName: user.preferences?.displayName || user.email?.split('@')[0] || '',
        bio: user.preferences?.bio || '',
        location: user.preferences?.location || '',
        website: user.preferences?.website || '',
      })
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await userContentAPI.getContentHistory(1, 1, null)
      if (response.success) {
        setStats({
          totalContent: response.data.pagination.total || 0,
          totalTokensUsed: user?.totalTokensUsed || 0,
          totalTokensPurchased: user?.totalTokensPurchased || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await userAPI.updatePreferences({
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      })
      
      if (response.success) {
        toast.success('Profile updated successfully!')
        setEditing(false)
        await fetchUser()
      } else {
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: user.preferences?.displayName || user.email?.split('@')[0] || '',
      bio: user.preferences?.bio || '',
      location: user.preferences?.location || '',
      website: user.preferences?.website || '',
    })
    setEditing(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <UserProtectedRoute>
      <SEO
        title="My Profile"
        description="Manage your profile information and view your activity summary"
        url="/user/profile"
      />
      <div className="user-profile-page">
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your profile information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="avatar-upload-btn" title="Upload profile image (coming soon)">
                  <HiCamera />
                </button>
              </div>
              <div className="profile-basic-info">
                <h2>{user?.email?.split('@')[0] || 'User'}</h2>
                <p className="profile-email">{user?.email}</p>
                <span className="profile-status-badge">Active</span>
              </div>
            </div>

            {/* Edit Button */}
            {!editing && (
              <button className="edit-profile-btn" onClick={() => setEditing(true)}>
                <HiPencil /> Edit Profile
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div className="profile-details-section">
            <h3>Profile Information</h3>
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <label>Display Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Your display name"
                  />
                ) : (
                  <div className="profile-value">
                    {user?.preferences?.displayName || user?.email?.split('@')[0] || 'Not set'}
                  </div>
                )}
              </div>

              <div className="profile-detail-item">
                <label>Email Address</label>
                <div className="profile-value">{user?.email}</div>
                <small className="profile-hint">Email cannot be changed</small>
              </div>

              <div className="profile-detail-item">
                <label>Bio</label>
                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows="4"
                  />
                ) : (
                  <div className="profile-value">
                    {user?.preferences?.bio || 'No bio added yet'}
                  </div>
                )}
              </div>

              <div className="profile-detail-item">
                <label>Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Your location"
                  />
                ) : (
                  <div className="profile-value">
                    {user?.preferences?.location || 'Not set'}
                  </div>
                )}
              </div>

              <div className="profile-detail-item">
                <label>Website</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <div className="profile-value">
                    {user?.preferences?.website || 'Not set'}
                  </div>
                )}
              </div>

              <div className="profile-detail-item">
                <label>Member Since</label>
                <div className="profile-value">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })
                    : 'N/A'}
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {editing && (
              <div className="profile-edit-actions">
                <button className="btn-primary" onClick={handleSave}>
                  <HiCheck /> Save Changes
                </button>
                <button className="btn-secondary" onClick={handleCancel}>
                  <HiXMark /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="profile-activity-section">
            <h3>Activity Summary</h3>
            <div className="activity-stats-grid">
              <div className="activity-stat-card">
                <div className="activity-stat-icon">
                  <HiDocumentText />
                </div>
                <div className="activity-stat-content">
                  <div className="activity-stat-value">{stats.totalContent}</div>
                  <div className="activity-stat-label">Content Generated</div>
                </div>
              </div>
              <div className="activity-stat-card">
                <div className="activity-stat-icon">
                  <HiSparkles />
                </div>
                <div className="activity-stat-content">
                  <div className="activity-stat-value">{stats.totalTokensUsed}</div>
                  <div className="activity-stat-label">Tokens Used</div>
                </div>
              </div>
              <div className="activity-stat-card">
                <div className="activity-stat-icon">
                  <HiChartBar />
                </div>
                <div className="activity-stat-content">
                  <div className="activity-stat-value">{stats.totalTokensPurchased}</div>
                  <div className="activity-stat-label">Tokens Purchased</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserProtectedRoute>
  )
}

export default Profile

