import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import {
  HiBriefcase,
  HiDocumentText,
  HiUserCircle,
  HiMicrophone,
  HiMagnifyingGlass,
  HiCurrencyDollar,
  HiArrowPath,
  HiCheckCircle,
  HiArrowRight,
  HiSparkles,
  HiLightBulb,
  HiChartBar
} from 'react-icons/hi2'
import '../styles/pages/services.css'

function Services() {
  const services = [
    {
      id: 'career-coaching',
      icon: HiBriefcase,
      title: 'Career Coaching & Consulting',
      description: 'One-on-one personalized career coaching sessions to help you identify your strengths, set career goals, and create a strategic plan for success.',
      features: [
        'Personalized career assessment',
        'Goal setting and action planning',
        'Career path exploration',
        'Skills gap analysis',
        'Ongoing support and accountability'
      ],
      duration: '60-90 minutes',
      format: 'Video call or in-person'
    },
    {
      id: 'resume-writing',
      icon: HiDocumentText,
      title: 'Resume & CV Writing',
      description: 'Professional resume and CV writing services tailored for remote positions. ATS-optimized and designed to get you noticed by recruiters.',
      features: [
        'ATS-optimized formatting',
        'Keyword optimization',
        'Achievement-focused content',
        'Multiple format options',
        '2 rounds of revisions included'
      ],
      duration: '3-5 business days',
      format: 'Delivered via email'
    },
    {
      id: 'linkedin-optimization',
      icon: HiUserCircle,
      title: 'LinkedIn Profile Optimization',
      description: 'Transform your LinkedIn profile into a powerful career tool that attracts recruiters and showcases your professional brand.',
      features: [
        'Profile headline optimization',
        'Compelling summary writing',
        'Experience section enhancement',
        'Skills and endorsements strategy',
        'Profile photo and banner guidance'
      ],
      duration: '2-3 business days',
      format: 'Delivered via email'
    },
    {
      id: 'interview-prep',
      icon: HiMicrophone,
      title: 'Interview Preparation',
      description: 'Comprehensive interview coaching to help you ace remote job interviews. Practice sessions, feedback, and strategies for success.',
      features: [
        'Mock interview sessions',
        'Common questions practice',
        'Behavioral interview prep',
        'Video interview tips',
        'Follow-up email templates'
      ],
      duration: '60-90 minutes',
      format: 'Video call'
    },
    {
      id: 'job-search-strategy',
      icon: HiMagnifyingGlass,
      title: 'Job Search Strategy Sessions',
      description: 'Develop a targeted job search strategy that helps you find the right remote opportunities faster and more efficiently.',
      features: [
        'Job search plan development',
        'Target company identification',
        'Application tracking system',
        'Networking strategies',
        'Follow-up techniques'
      ],
      duration: '60 minutes',
      format: 'Video call'
    },
    {
      id: 'salary-negotiation',
      icon: HiCurrencyDollar,
      title: 'Salary Negotiation Coaching',
      description: 'Learn proven strategies to negotiate your salary and benefits package confidently. Maximize your earning potential.',
      features: [
        'Market research guidance',
        'Negotiation script development',
        'Benefits package evaluation',
        'Counter-offer strategies',
        'Confidence building techniques'
      ],
      duration: '60 minutes',
      format: 'Video call'
    },
    {
      id: 'career-transition',
      icon: HiArrowPath,
      title: 'Career Transition Support',
      description: 'Navigate career changes smoothly with expert guidance. Whether switching industries or going remote, we\'ll help you succeed.',
      features: [
        'Transition planning',
        'Skills transfer analysis',
        'Industry research support',
        'Networking strategies',
        'Timeline development'
      ],
      duration: '90 minutes',
      format: 'Video call'
    },
    {
      id: 'linkedin-strategy',
      icon: HiSparkles,
      title: 'LinkedIn Content Strategy',
      description: 'Build your professional brand on LinkedIn with a content strategy that positions you as an industry expert.',
      features: [
        'Content calendar development',
        'Post ideas and templates',
        'Engagement strategies',
        'Thought leadership positioning',
        'Networking best practices'
      ],
      duration: '60 minutes',
      format: 'Video call + resources'
    }
  ]

  const packages = [
    {
      name: 'Starter Package',
      price: '$50',
      description: 'Perfect for getting started with your remote job search',
      services: [
        'Resume/CV Review & Optimization',
        'LinkedIn Profile Optimization',
        'Job Search Strategy Session (30 min)',
        'Email Templates Pack'
      ],
      popular: false
    },
    {
      name: 'Professional Package',
      price: '$100',
      description: 'Comprehensive support for serious job seekers',
      services: [
        'Professional Resume/CV Writing',
        'LinkedIn Profile Optimization',
        'Career Coaching Session (60 min)',
        'Interview Preparation Session',
        'Job Search Strategy Session',
        'Email Templates & Follow-up Guides'
      ],
      popular: true
    },
    {
      name: 'Complete Career Transformation',
      price: '$200',
      description: 'Full-service career support from start to finish',
      services: [
        'Professional Resume/CV Writing',
        'LinkedIn Profile Optimization',
        'LinkedIn Content Strategy',
        '3x Career Coaching Sessions',
        'Interview Preparation & Mock Interviews',
        'Job Search Strategy & Support',
        'Salary Negotiation Coaching',
        'Career Transition Planning',
        'All Templates & Resources',
        '30-day follow-up support'
      ],
      popular: false
    }
  ]

  return (
    <>
      <SEO
        title="Career Services"
        description="Professional career coaching, resume writing, LinkedIn optimization, interview preparation, and job search strategy services. Get expert help to land your dream remote job."
        keywords="career coaching, resume writing, LinkedIn optimization, interview prep, job search strategy, salary negotiation, career transition, remote work coaching"
        url="/services"
      />
      <div className="services-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="services-hero-container">
            <h1 className="services-hero-title">Professional Career Services</h1>
            <p className="services-hero-subtitle">
              Get expert guidance and support to accelerate your remote career journey. 
              From resume writing to interview prep, we've got you covered.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-list-section">
          <div className="services-list-container">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">
                Choose the service that fits your needs, or combine multiple services for comprehensive support.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.id} className="service-item-card">
                    <div className="service-item-icon">
                      <Icon />
                    </div>
                    <h3 className="service-item-title">{service.title}</h3>
                    <p className="service-item-description">{service.description}</p>
                    <div className="service-item-features">
                      <h4 className="features-title">What's Included:</h4>
                      <ul className="features-list">
                        {service.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <HiCheckCircle className="feature-icon" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="service-item-meta">
                      <div className="meta-item">
                        <span className="meta-label">Duration:</span>
                        <span className="meta-value">{service.duration}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Format:</span>
                        <span className="meta-value">{service.format}</span>
                      </div>
                    </div>
                    <Link to="/contact" className="service-cta-button">
                      Book This Service <HiArrowRight className="inline ml-2" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="packages-section">
          <div className="packages-container">
            <div className="section-header">
              <h2 className="section-title">Service Packages</h2>
              <p className="section-subtitle">
                Save money with our bundled packages. Choose the package that best fits your career goals.
              </p>
            </div>
            <div className="packages-grid">
              {packages.map((pkg, index) => (
                <div key={index} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">{pkg.price}</div>
                  <p className="package-description">{pkg.description}</p>
                  <ul className="package-services-list">
                    {pkg.services.map((service, idx) => (
                      <li key={idx} className="package-service-item">
                        <HiCheckCircle className="package-check-icon" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="package-cta-button">
                    Get Started <HiArrowRight className="inline ml-2" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta-section">
          <div className="services-cta-container">
            <HiLightBulb className="cta-icon" />
            <h2 className="cta-title">Ready to Transform Your Career?</h2>
            <p className="cta-text">
              Book a free consultation call to discuss your career goals and find the perfect service for you.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">
                Book Free Consultation <HiArrowRight className="inline ml-2" />
              </Link>
              <Link to="/about" className="btn-secondary-white">
                Learn More About Me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Services

