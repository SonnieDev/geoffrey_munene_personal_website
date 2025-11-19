import axios from 'axios'
import { logApiError } from '../utils/errorTracking'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error tracking
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors
    if (error.config) {
      logApiError(error, error.config.url, error.config.method)
    }
    return Promise.reject(error)
  }
)

// Contact API
export const contactAPI = {
  sendMessage: async (data) => {
    const response = await api.post('/contact', data)
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },
}

// Blogs API
export const blogsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response.data
  },
}

// Tools API
export const toolsAPI = {
  generateResume: async (data, sessionId) => {
    const response = await api.post('/tools/resume', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  generateCoverLetter: async (data, sessionId) => {
    const response = await api.post('/tools/cover-letter', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  generateEmail: async (data, sessionId) => {
    const response = await api.post('/tools/email', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  generateInterviewPrep: async (data, sessionId) => {
    const response = await api.post('/tools/interview-prep', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  generateSkillsAssessment: async (data, sessionId) => {
    const response = await api.post('/tools/skills-assessment', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  generateSalaryNegotiation: async (data, sessionId) => {
    const response = await api.post('/tools/salary-negotiation', { ...data, sessionId }, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
}

// Tokens API
export const tokensAPI = {
  getBalance: async (sessionId) => {
    const response = await api.get('/tokens/balance', {
      params: { sessionId },
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  getTransactions: async (sessionId, limit = 20) => {
    const response = await api.get('/tokens/transactions', {
      params: { sessionId, limit },
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },
  initializePayment: async (sessionId, tokenPackage, email) => {
    const response = await api.post('/tokens/initialize-payment', {
      sessionId,
      tokenPackage,
      email
    })
    return response.data
  },
  verifyPayment: async (sessionId, reference) => {
    const response = await api.post('/tokens/verify-payment', { sessionId, reference })
    return response.data
  },
}

// YouTube API
export const youtubeAPI = {
  getVideos: async (channelUrl, maxResults = 10) => {
    const response = await api.get('/youtube/videos', {
      params: { channelUrl, maxResults },
    })
    return response.data
  },
  getPlaylists: async (channelUrl) => {
    const response = await api.get('/youtube/playlists', {
      params: { channelUrl },
    })
    return response.data
  },
}

// Jobs API
export const jobsAPI = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params })
    return response.data
  },
  getCategories: async () => {
    const response = await api.get('/jobs/categories')
    return response.data
  },
}

// Testimonials API
export const testimonialsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/testimonials', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/testimonials/${id}`)
    return response.data
  },
}

// Admin API
export const adminAPI = {
  // Auth
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/admin/me')
    return response.data
  },
  
  // Blogs
  getAllBlogs: async () => {
    const response = await api.get('/admin/blogs')
    return response.data
  },
  getBlogById: async (id) => {
    const response = await api.get(`/admin/blogs/${id}`)
    return response.data
  },
  createBlog: async (data) => {
    const response = await api.post('/admin/blogs', data)
    return response.data
  },
  updateBlog: async (id, data) => {
    const response = await api.put(`/admin/blogs/${id}`, data)
    return response.data
  },
  deleteBlog: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`)
    return response.data
  },
  
  // Jobs
  getAllJobs: async () => {
    const response = await api.get('/admin/jobs')
    return response.data
  },
  getJobById: async (id) => {
    const response = await api.get(`/admin/jobs/${id}`)
    return response.data
  },
  createJob: async (data) => {
    const response = await api.post('/admin/jobs', data)
    return response.data
  },
  updateJob: async (id, data) => {
    const response = await api.put(`/admin/jobs/${id}`, data)
    return response.data
  },
  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`)
    return response.data
  },
  
  // Contacts
  getAllContacts: async () => {
    const response = await api.get('/admin/contacts')
    return response.data
  },
  getContactById: async (id) => {
    const response = await api.get(`/admin/contacts/${id}`)
    return response.data
  },
  updateContactStatus: async (id, status) => {
    const response = await api.put(`/admin/contacts/${id}`, { status })
    return response.data
  },
  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`)
    return response.data
  },
  
  // Testimonials
  getAllTestimonials: async () => {
    const response = await api.get('/admin/testimonials')
    return response.data
  },
  getTestimonialById: async (id) => {
    const response = await api.get(`/admin/testimonials/${id}`)
    return response.data
  },
  createTestimonial: async (data) => {
    const response = await api.post('/admin/testimonials', data)
    return response.data
  },
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/admin/testimonials/${id}`, data)
    return response.data
  },
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/admin/testimonials/${id}`)
    return response.data
  },
  
  // Admin Management (Super Admin only)
  getAllAdmins: async () => {
    const response = await api.get('/admin/admins')
    return response.data
  },
  getAdminById: async (id) => {
    const response = await api.get(`/admin/admins/${id}`)
    return response.data
  },
  createAdmin: async (data) => {
    const response = await api.post('/admin/admins', data)
    return response.data
  },
  updateAdmin: async (id, data) => {
    const response = await api.put(`/admin/admins/${id}`, data)
    return response.data
  },
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/admins/${id}`)
    return response.data
  },
  changePassword: async (id, data) => {
    const response = await api.put(`/admin/admins/${id}/password`, data)
    return response.data
  },
  
  // Dev Tools (Dev, Admin, Super Admin)
  getSystemHealth: async () => {
    const response = await api.get('/admin/dev/health')
    return response.data
  },
  getDatabaseStats: async () => {
    const response = await api.get('/admin/dev/stats')
    return response.data
  },
  getErrorLogs: async (limit = 50) => {
    const response = await api.get('/admin/dev/logs/errors', { params: { limit } })
    return response.data
  },
  getApiRequestLogs: async (limit = 100, filters = {}) => {
    const response = await api.get('/admin/dev/logs/requests', { params: { limit, ...filters } })
    return response.data
  },
  clearLogs: async (type = 'all') => {
    const response = await api.delete('/admin/dev/logs', { data: { type } })
    return response.data
  },
}

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

