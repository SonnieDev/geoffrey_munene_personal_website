import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  generateResume: async (data) => {
    const response = await api.post('/tools/resume', data)
    return response.data
  },
  generateCoverLetter: async (data) => {
    const response = await api.post('/tools/cover-letter', data)
    return response.data
  },
  generateEmail: async (data) => {
    const response = await api.post('/tools/email', data)
    return response.data
  },
  generateInterviewPrep: async (data) => {
    const response = await api.post('/tools/interview-prep', data)
    return response.data
  },
  generateSkillsAssessment: async (data) => {
    const response = await api.post('/tools/skills-assessment', data)
    return response.data
  },
  generateSalaryNegotiation: async (data) => {
    const response = await api.post('/tools/salary-negotiation', data)
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

