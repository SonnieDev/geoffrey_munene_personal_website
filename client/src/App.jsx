import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Tools from './pages/Tools'
import Learn from './pages/Learn'
import RemoteJobs from './pages/RemoteJobs'
import Services from './pages/Services'
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
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminTestimonialForm from './pages/admin/AdminTestimonialForm'
import AdminAdmins from './pages/admin/AdminAdmins'
import AdminAdminForm from './pages/admin/AdminAdminForm'
import DevTools from './pages/admin/DevTools'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import GoogleAnalytics from './components/GoogleAnalytics'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/app.css'

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <GoogleAnalytics />
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
                      <Route path="/services" element={<Services />} />
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
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials/new"
              element={
                <ProtectedRoute>
                  <AdminTestimonialForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminTestimonialForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute>
                  <AdminAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins/new"
              element={
                <ProtectedRoute>
                  <AdminAdminForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminAdminForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dev-tools"
              element={
                <ProtectedRoute>
                  <DevTools />
                </ProtectedRoute>
              }
            />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App

