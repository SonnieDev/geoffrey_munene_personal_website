import { Link } from 'react-router-dom'
import { HiWrenchScrewdriver, HiUser, HiBookOpen, HiSparkles, HiArrowRight } from 'react-icons/hi2'
import { useUser } from '../contexts/UserContext'
import '../styles/components/service-highlights.css'

const SERVICES = [
  {
    id: 'tools',
    title: 'AI Tools & Productivity',
    description: 'Generate resumes, cover letters, emails, and more with AI-powered tools',
    icon: HiWrenchScrewdriver,
    link: '/tools',
    color: 'blue',
    features: ['Resume Builder', 'Cover Letter Generator', 'Email Writer', 'Interview Prep'],
  },
  {
    id: 'coaching',
    title: 'Remote Work Coaching',
    description: 'Get personalized guidance and support for your remote career journey',
    icon: HiUser,
    link: '/contact',
    color: 'green',
    features: ['1-on-1 Sessions', 'Career Guidance', 'Skill Development', 'Goal Setting'],
  },
  {
    id: 'content',
    title: 'Content & Learning',
    description: 'Access guides, videos, tutorials, and resources to level up your skills',
    icon: HiBookOpen,
    link: '/learn',
    color: 'purple',
    features: ['Video Tutorials', 'Blog Posts', 'Guides & Tips', 'FAQs'],
  },
]

function ServiceHighlights() {
  const { user } = useUser()
  const signupPurpose = user?.signupPurpose

  // Filter services based on user's signup purpose
  const getServicesToShow = () => {
    if (signupPurpose === 'all' || !signupPurpose) {
      return SERVICES
    }
    // Show primary service first, then others
    const primary = SERVICES.find(s => s.id === signupPurpose)
    const others = SERVICES.filter(s => s.id !== signupPurpose)
    return primary ? [primary, ...others] : SERVICES
  }

  const servicesToShow = getServicesToShow()

  return (
    <div className="service-highlights">
      <div className="service-highlights-header">
        <h2 className="service-highlights-title">Your Services</h2>
        <p className="service-highlights-subtitle">
          {signupPurpose === 'all' || !signupPurpose
            ? 'Explore all our services to boost your remote career'
            : `Focus on ${servicesToShow[0]?.title.toLowerCase()} and explore more`}
        </p>
      </div>

      <div className="service-grid">
        {servicesToShow.map((service) => {
          const Icon = service.icon
          const isPrimary = service.id === signupPurpose

          return (
            <div
              key={service.id}
              className={`service-card ${service.color} ${isPrimary ? 'primary' : ''}`}
            >
              <div className="service-card-header">
                <div className={`service-icon ${service.color}`}>
                  <Icon />
                </div>
                {isPrimary && (
                  <span className="service-badge">
                    <HiSparkles /> Your Focus
                  </span>
                )}
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="service-feature">
                    <span className="feature-bullet">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={service.link} className="service-link">
                Explore {service.title}
                <HiArrowRight />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ServiceHighlights

