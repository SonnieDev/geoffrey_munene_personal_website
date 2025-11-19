import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { HiSun, HiMoon, HiArrowLeft, HiHome } from 'react-icons/hi2'
import '../styles/components/admin-header.css'

function AdminHeader({ 
  title, 
  showBackButton = false, 
  backPath = '/admin/dashboard',
  backLabel = 'Back to Dashboard',
  actionButton = null 
}) {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="admin-page-header">
      <div className="admin-page-title-section">
        {showBackButton && (
          <button 
            onClick={() => navigate(backPath)} 
            className="admin-back-dashboard-btn"
            title={backLabel}
          >
            <HiArrowLeft /> {backLabel}
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <div className="admin-header-actions">
        <button 
          onClick={toggleTheme}
          className="admin-theme-toggle"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <HiSun /> : <HiMoon />}
        </button>
        {actionButton}
      </div>
    </div>
  )
}

export default AdminHeader

