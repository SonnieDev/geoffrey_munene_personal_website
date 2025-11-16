import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) {
        // Apply immediately to avoid flash
        const root = document.documentElement
        if (saved === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        return saved === 'dark'
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      // Apply immediately to avoid flash
      const root = document.documentElement
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      return prefersDark
    }
    return false
  })

  useEffect(() => {
    // Update HTML class and localStorage when isDark changes
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        root.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

