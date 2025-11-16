import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogsAPI } from '../services/api'
import SEO from '../components/SEO'
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
import '../styles/pages/home.css'

function Home() {
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentPosts()
  }, [])

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

  return (
    <>
      <SEO
        title="Land Your Dream Remote Job"
        description="Learn how to land your dream remote job. Get free tools, resources, and guidance to build a successful remote career. AI-powered resume builder, job listings, and video tutorials."
        keywords="remote work, remote jobs, work from home, digital nomad, remote career, online jobs, remote work tips, remote work coaching"
        url="/"
      />
      <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Land Your Dream <span className="text-blue-600">Remote</span> Job
              </h1>
              <p className="hero-description">
                I help people learn the skills, find opportunities, and build careers in the remote work economy.
              </p>
              <div className="hero-buttons">
                <Link to="/learn" className="btn-primary">
                  Get Started <HiArrowRight className="inline ml-2" />
                </Link>
                <a href="https://www.youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Watch My Videos
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop" 
                  alt="Remote work professional" 
                  className="hero-img"
                />
                <div className="hero-badge">
                  <span className="badge-text">500+ Remote workers coached</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">How I Can Help You</h2>
            <p className="section-subtitle">
              I provide the resources, tools, and guidance you need to succeed in the remote work landscape.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <HiBriefcase />
              </div>
              <h3 className="service-title">Remote Job Coaching</h3>
              <p className="service-description">
                Learn proven strategies to find and secure remote work opportunities that fit your skills and lifestyle.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <HiVideoCamera />
              </div>
              <h3 className="service-title">Video Tutorials</h3>
              <p className="service-description">
                Watch step-by-step guides and tutorials on YouTube to master remote work skills at your own pace.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <HiAcademicCap />
              </div>
              <h3 className="service-title">Career Growth</h3>
              <p className="service-description">
                Build the skills and knowledge needed to thrive in the digital economy and advance your career online.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <HiDocumentText />
              </div>
              <h3 className="service-title">Remote Work Resources</h3>
              <p className="service-description">
                Access free tools, templates, and resources to help you succeed in your remote work journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="blog-section-container">
          <div className="blog-section-header">
            <div>
              <h2 className="section-title">Latest Content</h2>
              <p className="section-subtitle">
                Remote work insights and tips from my blog.
              </p>
            </div>
            <Link to="/blog" className="view-all-link">
              View all posts <HiArrowRight className="inline ml-1" />
            </Link>
          </div>
          {loading ? (
            <div className="blog-loading">
              <p>Loading recent posts...</p>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="blog-posts-grid">
              {recentPosts.map((post) => (
                <article key={post._id} className="blog-post-card">
                  {post.thumbnail && (
                    <div className="post-thumbnail">
                      <img src={post.thumbnail} alt={post.title} />
                    </div>
                  )}
                  <div className="post-content">
                    <div className="post-header">
                      <span className="post-category">{post.category}</span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post._id}`} className="post-read-more">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-posts">No blog posts available yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              Hear from people who have transformed their careers with remote work.
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="star-icon" />
                ))}
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "Geoffrey's tips helped me land my first remote job in just 3 months! His YouTube videos are incredibly practical and easy to follow."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SJ</div>
                <div className="author-info">
                  <p className="author-name">Sarah Johnson</p>
                  <p className="author-role">Digital Marketing Manager</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="star-icon" />
                ))}
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The AI tools on this site saved me hours of work. The resume builder is amazing and helped me get multiple interview calls!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JK</div>
                <div className="author-info">
                  <p className="author-name">James K.</p>
                  <p className="author-role">Software Developer</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="star-icon" />
                ))}
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "I've been following Geoffrey's content for a year now. His blog posts and job listings have been game-changers for my career transition."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AL</div>
                <div className="author-info">
                  <p className="author-name">Alex L.</p>
                  <p className="author-role">Freelance Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Remote Work Journey?</h2>
          <p className="cta-text">
            Get access to resources, tools, and guidance to help you find and land your dream remote job.
          </p>
          <div className="cta-buttons">
            <Link to="/learn" className="btn-primary">
              Get Started <HiArrowRight className="inline ml-2" />
            </Link>
            <Link to="/tools" className="btn-secondary-white">
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

