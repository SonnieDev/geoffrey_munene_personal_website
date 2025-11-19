import { Link } from 'react-router-dom'
import { HiBookOpen, HiVideoCamera, HiQuestionMarkCircle, HiArrowRight, HiDocumentText, HiAcademicCap } from 'react-icons/hi2'
import '../styles/components/resource-center.css'

const RESOURCES = [
  {
    id: 'guides',
    title: 'Guides & Tutorials',
    description: 'Step-by-step guides to help you succeed',
    icon: HiBookOpen,
    link: '/learn',
    count: '10+',
    color: 'blue',
  },
  {
    id: 'videos',
    title: 'Video Tutorials',
    description: 'Watch and learn from our video library',
    icon: HiVideoCamera,
    link: '/learn',
    count: '20+',
    color: 'red',
  },
  {
    id: 'faqs',
    title: 'FAQs',
    description: 'Find answers to common questions',
    icon: HiQuestionMarkCircle,
    link: '/contact',
    count: '15+',
    color: 'green',
  },
  {
    id: 'blog',
    title: 'Blog Posts',
    description: 'Read articles and tips from our blog',
    icon: HiDocumentText,
    link: '/blog',
    count: '50+',
    color: 'purple',
  },
]

const QUICK_LINKS = [
  { label: 'Getting Started Guide', link: '/learn', icon: HiAcademicCap },
  { label: 'How to Use AI Tools', link: '/tools', icon: HiBookOpen },
  { label: 'Contact Support', link: '/contact', icon: HiQuestionMarkCircle },
]

function ResourceCenter() {
  return (
    <div className="resource-center">
      <div className="resource-center-header">
        <h3 className="resource-center-title">Resource Center</h3>
        <p className="resource-center-subtitle">Everything you need to succeed</p>
      </div>

      <div className="resource-grid">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon
          return (
            <Link
              key={resource.id}
              to={resource.link}
              className={`resource-card ${resource.color}`}
            >
              <div className={`resource-icon ${resource.color}`}>
                <Icon />
              </div>
              <div className="resource-content">
                <h4 className="resource-card-title">{resource.title}</h4>
                <p className="resource-card-description">{resource.description}</p>
                <div className="resource-count">{resource.count} resources</div>
              </div>
              <HiArrowRight className="resource-arrow" />
            </Link>
          )
        })}
      </div>

      <div className="quick-links-section">
        <h4 className="quick-links-title">Quick Links</h4>
        <div className="quick-links-list">
          {QUICK_LINKS.map((link, idx) => {
            const LinkIcon = link.icon
            return (
              <Link key={idx} to={link.link} className="quick-link">
                <LinkIcon />
                <span>{link.label}</span>
                <HiArrowRight />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ResourceCenter

