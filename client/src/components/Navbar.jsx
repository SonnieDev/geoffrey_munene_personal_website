import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiHome,
  HiBookOpen,
  HiWrenchScrewdriver,
  HiPlay,
  HiBriefcase,
  HiUser,
  HiEnvelope,
  HiBars3,
  HiXMark,
  HiSun,
  HiMoon,
  HiArrowRight
} from 'react-icons/hi2'
import { useTheme } from '../contexts/ThemeContext'
import '../styles/components/navbar.css'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleLinkClick = () => {
    closeSidebar()
  }

  const menuItems = [
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/blog', label: 'Blog', icon: HiBookOpen },
    { path: '/tools', label: 'Tools', icon: HiWrenchScrewdriver },
    { path: '/learn', label: 'Learn', icon: HiPlay },
    { path: '/remote-jobs', label: 'Remote Jobs', icon: HiBriefcase },
    { path: '/about', label: 'About', icon: HiUser },
    { path: '/contact', label: 'Contact', icon: HiEnvelope },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="logo-first">Geoffrey</span>
            <span className="logo-second">Munene</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="navbar-right">
            <ul className="navbar-menu">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path} className="navbar-item">
                    <Link 
                      to={item.path} 
                      className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Desktop Theme Toggle */}
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <HiMoon /> : <HiSun />}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="navbar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <HiBars3 />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleLinkClick}>
            <span className="logo-first">Geoffrey</span>
            <span className="logo-second">Munene</span>
          </Link>
          <div className="sidebar-utils">
            <button 
              className="sidebar-util-btn" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <HiMoon /> : <HiSun />}
            </button>
            <button 
              className="sidebar-util-btn" 
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <HiXMark />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path} className="sidebar-item">
                  <Link 
                    to={item.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Icon className="sidebar-icon" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="sidebar-cta-primary"
            onClick={() => {
              navigate('/learn')
              handleLinkClick()
            }}
          >
            Get Started <HiArrowRight className="inline ml-2" />
          </button>
          <a 
            href="https://www.youtube.com/@munenegeoffrey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-cta-secondary"
            onClick={handleLinkClick}
          >
            Watch My Videos
          </a>
        </div>
      </aside>
    </>
  )
}

export default Navbar

