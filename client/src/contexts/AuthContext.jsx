import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await adminAPI.getMe()
      if (response.success) {
        setAdmin(response.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await adminAPI.login({ username, password })
      if (response.success) {
        localStorage.setItem('adminToken', response.token)
        setAdmin(response.admin)
        setIsAuthenticated(true)
        return { success: true, admin: response.admin }
      }
      return { success: false, message: response.message || 'Login failed' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

