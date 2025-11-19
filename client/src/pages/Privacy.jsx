import SEO from '../components/SEO'
import { HiLockClosed } from 'react-icons/hi2'

function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Geoffrey Munene collects, uses, and protects your personal information. Our commitment to your privacy and data security."
        keywords="privacy policy, data protection, privacy statement, user privacy, data security"
        url="/privacy"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-green/10 dark:bg-neon-green/20 blur-[100px] animate-pulse-slow"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-neon-green mb-6 animate-fade-in">
              <HiLockClosed className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel p-8 md:p-12 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                At Geoffrey Munene, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully.
              </p>

              {/* Sections */}
              <div className="space-y-8">
                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>

                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">1.1 Personal Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                    <li>Register for an account or use our services</li>
                    <li>Subscribe to our newsletter or mailing list</li>
                    <li>Fill out a contact form or request information</li>
                    <li>Participate in surveys, contests, or promotions</li>
                    <li>Make a purchase or transaction</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    The personal information we may collect includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Name and contact information (email address, phone number, mailing address)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Payment information (credit card details, billing address)</li>
                    <li>Professional information (job title, company name, resume/CV)</li>
                    <li>Any other information you choose to provide</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">1.2 Automatically Collected Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    When you visit our website, we automatically collect certain information about your device and browsing behavior:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>To provide, maintain, and improve our services</li>
                    <li>To process transactions and send related information</li>
                    <li>To send you newsletters, marketing communications, and promotional materials</li>
                    <li>To respond to your comments, questions, and requests</li>
                    <li>To provide customer support and assistance</li>
                    <li>To monitor and analyze usage patterns and trends</li>
                    <li>To detect, prevent, and address technical issues and security threats</li>
                    <li>To personalize your experience and deliver content relevant to your interests</li>
                  </ul>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Information Sharing and Disclosure</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.1 Service Providers</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We may share your information with third-party service providers who perform services on our behalf, such as:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                    <li>Payment processing</li>
                    <li>Email delivery and marketing services</li>
                    <li>Website hosting and analytics</li>
                    <li>Customer support services</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.2 Legal Requirements</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3.3 With Your Consent</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may share your information with third parties when you have given us explicit consent to do so.
                  </p>
                </div>

                <div className="border-l-4 border-neon-pink pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to track activity on our website and store certain information.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Types of cookies we use:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                </div>

                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    We implement appropriate technical and organizational security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Secure data storage and backup systems</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Privacy Rights</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
                    <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                  </ul>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Data Retention</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                  </p>
                </div>

                <div className="border-l-4 border-neon-pink pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe your child has provided us with personal information, please contact us immediately.
                  </p>
                </div>

                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Third-Party Links</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our website may contain links to third-party websites, services, or applications that are not owned or controlled by us. This Privacy Policy does not apply to such third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
                  </p>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Us</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Email: <a href="mailto:munenemuchokiofficial@gmail.com" className="text-neon-green hover:text-neon-green/80 transition-colors font-medium">munenemuchokiofficial@gmail.com</a>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We will respond to your inquiry within a reasonable timeframe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacy
