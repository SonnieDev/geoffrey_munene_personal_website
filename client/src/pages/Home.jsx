import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { blogsAPI, testimonialsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import {
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiVideoCamera,
  HiDocumentText,
  HiGlobeAlt,
  HiArrowRight,
  HiStar
} from 'react-icons/hi2'

function Home() {
  const { isAuthenticated, loading: authLoading } = useUser()
  const navigate = useNavigate()
  const [recentPosts, setRecentPosts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/user/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    // Only fetch data if user is not authenticated
    if (!authLoading && !isAuthenticated) {
      fetchRecentPosts()
      fetchTestimonials()
    }
  }, [authLoading, isAuthenticated])

  const fetchRecentPosts = async () => {
    try {
      const response = await blogsAPI.getAll({ limit: 3 })
      setRecentPosts(response.data || [])
    } catch (err) {
      console.error('Error fetching recent posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll({ limit: 3 })
      setTestimonials(response.data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
    } finally {
      setTestimonialsLoading(false)
    }
  }

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Don't render home page content if user is authenticated (will redirect)
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Land Your Dream Remote Job"
        description="Learn how to land your dream remote job. Get free tools, resources, and guidance to build a successful remote career. AI-powered resume builder, job listings, and video tutorials."
        keywords="remote work, remote jobs, work from home, digital nomad, remote career, online jobs, remote work tips, remote work coaching"
        url="/"
      />
      <div className="home-page overflow-hidden">
        {/* Hero Section */}
        <section className="hero-section relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-200 dark:border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-200 dark:border-white/5 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          </div>

          <div className="hero-container container mx-auto px-4 relative z-10">
            <div className="hero-content flex flex-col lg:flex-row items-center gap-12">
              <div className="hero-text flex-1 text-center lg:text-left">
                <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
                  <span className="text-neon-blue text-sm font-medium tracking-wider">FUTURE OF WORK IS HERE</span>
                </div>
                <h1 className="hero-title text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up text-gray-900 dark:text-white">
                  Land Your Dream <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple animate-glow">Remote Job</span>
                </h1>
                <p className="hero-description text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Master the digital economy. I help you build the skills, find opportunities, and secure your future in the remote work landscape.
                </p>
                <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Link to="/learn" className="btn-primary bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-4 px-8 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-1 flex items-center justify-center gap-2">
                    Get Started <HiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/services" className="btn-secondary glass-button text-gray-900 dark:text-white font-medium py-4 px-8 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/20 hover:-translate-y-1 transition-all duration-300">
                    View Services
                  </Link>
                </div>
              </div>
              <div className="hero-image flex-1 relative animate-float">
                <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/10 shadow-2xl shadow-neon-purple/20 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-space-900/80 to-transparent z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop"
                    alt="Remote work professional"
                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/20 flex items-center gap-4">
                      <div className="bg-neon-green/20 p-3 rounded-full text-neon-green">
                        <HiBriefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">500+ Success Stories</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Remote careers launched</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements behind image */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-blue/20 dark:bg-neon-blue/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-purple/20 dark:bg-neon-purple/30 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section py-24 relative">
          <div className="services-container container mx-auto px-4">
            <div className="section-header text-center mb-16">
              <h2 className="section-title text-4xl font-display font-bold mb-4">
                <span className="text-gray-900 dark:text-white">Upgrade Your</span> <span className="text-neon-purple">Career</span>
              </h2>
              <p className="section-subtitle text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Cutting-edge tools and strategies to navigate the remote work ecosystem.
              </p>
            </div>
            <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: HiBriefcase, title: "Job Coaching", desc: "Strategic guidance to land high-paying remote roles.", link: "/services", color: "text-neon-blue" },
                { icon: HiVideoCamera, title: "Video Mastery", desc: "Premium tutorials to master remote work skills.", link: "/learn", color: "text-neon-purple" },
                { icon: HiAcademicCap, title: "Career Growth", desc: "Accelerate your professional development online.", link: "/services", color: "text-neon-green" },
                { icon: HiDocumentText, title: "Smart Resources", desc: "AI-powered tools and templates for success.", link: "/tools", color: "text-neon-pink" }
              ].map((service, index) => (
                <div key={index} className="service-card glass-panel p-8 rounded-2xl hover:transform hover:-translate-y-2 transition-all duration-300 group border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20">
                  <div className={`service-icon ${service.color} text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon />
                  </div>
                  <h3 className="service-title text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="service-description text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.desc}
                  </p>
                  <Link to={service.link} className={`service-link ${service.color} font-medium flex items-center group-hover:gap-2 transition-all`}>
                    Explore <HiArrowRight className="ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="blog-section py-24 bg-gray-50 dark:bg-space-800/50 relative transition-colors duration-300">
          <div className="blog-section-container container mx-auto px-4">
            <div className="blog-section-header flex justify-between items-end mb-12">
              <div>
                <h2 className="section-title text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Latest <span className="text-neon-blue">Intel</span></h2>
                <p className="section-subtitle text-gray-600 dark:text-gray-400">
                  Insights from the digital frontier.
                </p>
              </div>
              <Link to="/blog" className="view-all-link text-neon-blue hover:text-neon-blue/80 dark:hover:text-white transition-colors flex items-center">
                View all posts <HiArrowRight className="inline ml-1" />
              </Link>
            </div>
            {loading ? (
              <SkeletonLoader type="blog-card" count={3} />
            ) : recentPosts.length > 0 ? (
              <div className="blog-posts-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <article key={post._id} className="blog-post-card glass-panel rounded-xl overflow-hidden group hover:shadow-neon-blue/20 transition-all duration-300 border border-gray-200 dark:border-white/5">
                    {post.thumbnail && (
                      <div className="post-thumbnail h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-white/10 dark:bg-space-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={post.thumbnail} alt={post.title} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="post-content p-6">
                      <div className="post-header flex justify-between items-center mb-3">
                        <span className="post-category text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-neon-blue">{post.category}</span>
                        <span className="post-date text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="post-title text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-neon-blue transition-colors">{post.title}</h3>
                      <p className="post-excerpt text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      <Link to={`/blog/${post._id}`} className="post-read-more text-gray-900 dark:text-white text-sm font-medium hover:text-neon-blue transition-colors">
                        Read Article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="no-posts text-center text-gray-500">No blog posts available yet. Check back soon!</p>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent"></div>
          <div className="testimonials-container container mx-auto px-4">
            <div className="section-header text-center mb-16">
              <h2 className="section-title text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">Success <span className="text-neon-green">Stories</span></h2>
              <p className="section-subtitle text-gray-600 dark:text-gray-400">
                Real results from the community.
              </p>
            </div>
            {testimonialsLoading ? (
              <SkeletonLoader type="testimonial-card" count={3} />
            ) : testimonials.length > 0 ? (
              <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="testimonial-card glass-panel p-8 rounded-2xl border border-gray-200 dark:border-white/5 relative">
                    <div className="absolute -top-4 -right-4 text-6xl text-gray-200 dark:text-white/5 font-serif">"</div>
                    <div className="testimonial-stars flex gap-1 mb-6 text-neon-green">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <HiStar key={i} className="star-icon" />
                      ))}
                    </div>
                    <div className="testimonial-content mb-6">
                      <p className="testimonial-text text-gray-600 dark:text-gray-300 italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="testimonial-author flex items-center gap-4">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="author-avatar-img w-12 h-12 rounded-full border-2 border-neon-green/30"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="author-avatar w-12 h-12 rounded-full bg-gradient-to-br from-neon-green to-gray-800 dark:to-space-900 flex items-center justify-center text-white font-bold border border-white/10">
                          {getInitials(testimonial.name)}
                        </div>
                      )}
                      <div className="author-info">
                        <p className="author-name text-gray-900 dark:text-white font-bold">{testimonial.name}</p>
                        <p className="author-role text-xs text-neon-green">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-testimonials text-center text-gray-500">No testimonials available yet.</p>
            )}
          </div>
        </section>

        {/* Call To Action Section */}
        {/* Call To Action Section */}
        <section className="cta-section py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gray-50 dark:bg-space-900 transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="cta-container container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">FUTURE OF WORK</span>
            </div>
            <h2 className="cta-title text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Launch?</span>
            </h2>
            <p className="cta-text text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Join the future of work. Access the tools and guidance you need to secure your remote career today.
            </p>
            <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/learn" className="btn-primary bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-4 px-10 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Now <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/tools" className="btn-secondary glass-button text-gray-900 dark:text-white font-medium py-4 px-10 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/20 hover:-translate-y-1 transition-all duration-300">
                Explore Tools
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
