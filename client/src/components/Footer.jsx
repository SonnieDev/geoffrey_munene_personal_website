import { Link } from 'react-router-dom'
import {
  HiEnvelope,
} from 'react-icons/hi2'
import {
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'
import '../styles/components/footer.css'

function Footer() {
  return (
    <footer className="footer glass-panel border-t border-gray-200 dark:border-white/10 mt-auto">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-brand-name group">
              <span className="logo-first text-neon-blue font-display tracking-widest group-hover:text-neon-purple transition-colors">Geoffrey</span>
              <span className="logo-second text-gray-900 dark:text-white font-display tracking-widest">Munene</span>
            </h3>
            <p className="footer-brand-description text-gray-600 dark:text-gray-400">
              Helping people land remote jobs, work online, and grow digital careers.
            </p>
            <div className="footer-social">
              <a href="https://x.com/munene_muchoki" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.linkedin.com/in/munenemuchoki" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="social-icon hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="mailto:munenemuchokiofficial@gmail.com" className="social-icon hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400" aria-label="Email">
                <HiEnvelope />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h4 className="footer-links-title text-neon-purple font-display tracking-wider">SITE LINKS</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Home</Link></li>
                <li><Link to="/blog" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Blog</Link></li>
                <li><Link to="/services" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Services</Link></li>
                <li><Link to="/tools" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Tools</Link></li>
                <li><Link to="/learn" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Learn</Link></li>
                <li><Link to="/remote-jobs" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Remote Jobs</Link></li>
                <li><Link to="/community" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Community</Link></li>
                <li><Link to="/about" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">About</Link></li>
                <li><Link to="/contact" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-title text-neon-purple font-display tracking-wider">RESOURCES</h4>
              <ul className="footer-links-list">
                <li><Link to="/tools?tool=resume-builder" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Resume Builder</Link></li>
                <li><Link to="/tools?tool=email-templates" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Email Templates</Link></li>
                <li><Link to="/learn" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">YouTube Playlists</Link></li>
                <li><Link to="/blog?category=Interviewing" className="footer-link hover:text-neon-blue transition-colors text-gray-600 dark:text-gray-400">Interview Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom border-t border-gray-200 dark:border-white/10 pt-6">
          <div className="footer-legal-links">
            <Link to="/terms" className="footer-legal-link hover:text-neon-blue transition-colors text-gray-500 dark:text-gray-400">Terms & Conditions</Link>
            <span className="footer-legal-separator text-gray-400">|</span>
            <Link to="/privacy" className="footer-legal-link hover:text-neon-blue transition-colors text-gray-500 dark:text-gray-400">Privacy Policy</Link>
          </div>
          <p className="footer-copyright text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Geoffrey Munene. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

