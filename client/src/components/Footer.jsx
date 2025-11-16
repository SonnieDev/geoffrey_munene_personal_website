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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-brand-name">
              <span className="logo-first">Geoffrey</span>
              <span className="logo-second">Munene</span>
            </h3>
            <p className="footer-brand-description">
              Helping people land remote jobs, work online, and grow digital careers.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com/@munenegeoffrey" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="mailto:contact@geoffreymunene.com" className="social-icon" aria-label="Email">
                <HiEnvelope />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4 className="footer-links-title">SITE LINKS</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/blog" className="footer-link">Blog</Link></li>
                <li><Link to="/tools" className="footer-link">Tools</Link></li>
                <li><Link to="/learn" className="footer-link">Learn</Link></li>
                <li><Link to="/remote-jobs" className="footer-link">Remote Jobs</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-links-title">RESOURCES</h4>
              <ul className="footer-links-list">
                <li><Link to="/tools" className="footer-link">Resume Builder</Link></li>
                <li><Link to="/tools" className="footer-link">Email Templates</Link></li>
                <li><Link to="/learn" className="footer-link">YouTube Playlists</Link></li>
                <li><Link to="/blog" className="footer-link">Interview Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Geoffrey Munene. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

