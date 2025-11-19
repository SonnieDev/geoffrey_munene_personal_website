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
      <div className="services-page min-h-screen pt-20 pb-12">
        {/* Hero Section */}
        <section className="services-hero relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">LEVEL UP YOUR CAREER</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Career Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Get expert guidance and support to accelerate your remote career journey.
              From resume writing to interview prep, we've got you covered.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-list-section py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Choose the service that fits your needs, or combine multiple services for comprehensive support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.id} className="glass-panel p-8 rounded-2xl flex flex-col group hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30 hover:shadow-neon-blue/10">
                    <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mb-6 flex-grow">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <HiCheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2 mb-6 pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Duration:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{service.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Format:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{service.format}</span>
                      </div>
                    </div>
                    <Link
                      to="/contact"
                      className="w-full py-3 px-6 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 text-center flex items-center justify-center gap-2"
                    >
                      Book This Service <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="packages-section py-12 bg-gray-50 dark:bg-space-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Service Packages</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Save money with our bundled packages. Choose the package that best fits your career goals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {packages.map((pkg, index) => (
                <div key={index} className={`glass-panel p-8 rounded-2xl flex flex-col relative transition-all duration-300 border ${pkg.popular ? 'border-neon-blue shadow-neon-blue/20 transform scale-105 z-10' : 'border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neon-blue text-space-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-neon-blue/20">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">{pkg.name}</h3>
                  <div className="text-4xl font-bold mb-4 text-neon-blue text-center">{pkg.price}</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                    {pkg.description}
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {pkg.services.map((service, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <HiCheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-2 ${pkg.popular
                      ? 'bg-neon-blue text-space-900 hover:bg-neon-purple hover:text-white shadow-neon-blue/20'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-space-900 hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white'
                      }`}
                  >
                    Get Started <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta-section py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <HiLightBulb className="w-16 h-16 mx-auto mb-6 text-neon-blue animate-pulse-slow" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">Ready to Transform Your Career?</h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Book a free consultation call to discuss your career goals and find the perfect service for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="px-8 py-4 rounded-lg bg-neon-blue text-space-900 font-bold hover:bg-neon-purple hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 flex items-center justify-center gap-2">
                Book Free Consultation <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="px-8 py-4 rounded-lg border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-space-900 transition-all duration-300 flex items-center justify-center">
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

