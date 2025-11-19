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

  return (
    <UserProtectedRoute>
      <SEO
        title="My Profile"
        description="Manage your profile information and view your activity summary"
        url="/user/profile"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="glass-panel p-8 rounded-2xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white text-4xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-space-800 rounded-full border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" title="Upload profile image (coming soon)">
                  <HiCamera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user?.email?.split('@')[0] || 'User'}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{user?.email}</p>
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">Active</span>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-neon-blue/10 transition-all">
                  <HiPencil className="w-5 h-5" /> Edit Profile
                </button>
              )}
            </div>

            {/* Profile Details */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="Your display name"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white">
                      {user?.preferences?.displayName || user?.email?.split('@')[0] || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white">{user?.email}</div>
                  <small className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Email cannot be changed</small>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      rows="4"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white resize-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white min-h-[100px]">
                      {user?.preferences?.bio || 'No bio added yet'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Your location"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white">
                      {user?.preferences?.location || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white">
                      {user?.preferences?.website || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Since</label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 flex items-center gap-2">
                    <HiCheck className="w-5 h-5" /> Save Changes
                  </button>
                  <button onClick={handleCancel} className="glass-button px-6 py-3 rounded-xl flex items-center gap-2">
                    <HiXMark className="w-5 h-5" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30">
                <HiDocumentText className="w-8 h-8 text-neon-green mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalContent}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Content Generated</div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30">
                <HiSparkles className="w-8 h-8 text-neon-blue mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalTokensUsed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tokens Used</div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30">
                <HiChartBar className="w-8 h-8 text-neon-purple mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalTokensPurchased}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tokens Purchased</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserProtectedRoute>
  )
}

export default Profile
