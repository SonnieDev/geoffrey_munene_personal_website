import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  // Load gtag script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// Track page views
export const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}

// Track events
export const trackEvent = (action, category, label, value) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Component to track page views on route changes
export const GoogleAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      initGA()
    }
  }, [])

  useEffect(() => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      trackPageView(location.pathname + location.search)
    }
  }, [location])

  return null
}

export default GoogleAnalytics

