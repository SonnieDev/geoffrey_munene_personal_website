import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Tools from './pages/Tools'
import Learn from './pages/Learn'
import RemoteJobs from './pages/RemoteJobs'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminBlogForm from './pages/admin/AdminBlogForm'
import AdminJobs from './pages/admin/AdminJobs'
import AdminJobForm from './pages/admin/AdminJobForm'
import AdminContacts from './pages/admin/AdminContacts'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/app.css'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public routes with navbar and footer */}
            <Route
              path="/*"
              element={
                <div className="app-container">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      <Route path="/tools" element={<Tools />} />
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/remote-jobs" element={<RemoteJobs />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
            
            {/* Admin routes without navbar/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs/new"
              element={
                <ProtectedRoute>
                  <AdminBlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminBlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/new"
              element={
                <ProtectedRoute>
                  <AdminJobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminJobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App

