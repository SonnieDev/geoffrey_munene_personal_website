import { useState } from 'react'
import { contactAPI } from '../services/api'
import SEO from '../components/SEO'
import toast from 'react-hot-toast'
import {
  HiEnvelope,
  HiPhone,
  HiClock,
  HiMapPin,
  HiPaperAirplane
} from 'react-icons/hi2'
import {
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactAPI.sendMessage(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Message sent successfully! I will get back to you soon.')
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Contact Geoffrey Munene"
        description="Get in touch with Geoffrey Munene. Have questions about remote work, need career advice, or want to collaborate? Reach out through the contact form."
        keywords="contact Geoffrey Munene, remote work consultation, career coaching contact"
        url="/contact"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">LET'S CONNECT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Me</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Have questions or want to work together? Get in touch!
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Left Column - Contact Info */}
            <div className="glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                I'm always open to discussing remote work coaching, content creation opportunities,
                speaking engagements, or answering your questions about working remotely.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-neon-blue flex-shrink-0">
                    <HiEnvelope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <a href="mailto:munenemuchokiofficial@gmail.com" className="text-neon-blue hover:text-neon-blue/80 transition-colors">
                      munenemuchokiofficial@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-neon-green flex-shrink-0">
                    <HiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                    <a href="tel:+254700127598" className="text-neon-green hover:text-neon-green/80 transition-colors">
                      +254700127598
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-neon-purple flex-shrink-0">
                    <HiClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">Mon-Fri: 9AM - 5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-neon-pink flex-shrink-0">
                    <HiMapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">Remote (Worldwide)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Connect on Social Media</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Follow me for regular remote work tips, job opportunities, and resource updates.
                </p>
                <div className="flex gap-3">
                  <a href="https://x.com/munene_muchoki" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-neon-blue/10 hover:text-neon-blue transition-all" aria-label="Twitter">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/munenemuchoki" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-neon-blue/10 hover:text-neon-blue transition-all" aria-label="LinkedIn">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href="https://youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-neon-blue/10 hover:text-neon-blue transition-all" aria-label="YouTube">
                    <FaYoutube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all disabled:opacity-50"
                  >
                    <option value="" className="bg-white dark:bg-space-800">Select a subject</option>
                    <option value="coaching" className="bg-white dark:bg-space-800">Remote Work Coaching</option>
                    <option value="collaboration" className="bg-white dark:bg-space-800">Content Collaboration</option>
                    <option value="speaking" className="bg-white dark:bg-space-800">Speaking Engagement</option>
                    <option value="question" className="bg-white dark:bg-space-800">General Question</option>
                    <option value="other" className="bg-white dark:bg-space-800">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all disabled:opacity-50 resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                    Thank you for your message! I will get back to you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : (
                    <>
                      Send Message
                      <HiPaperAirplane className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
