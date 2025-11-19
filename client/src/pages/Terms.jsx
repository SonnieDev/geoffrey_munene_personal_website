import SEO from '../components/SEO'
import { HiShieldCheck } from 'react-icons/hi2'

function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Read the Terms & Conditions for using Geoffrey Munene's website, including user responsibilities, content usage, and service limitations."
        keywords="terms and conditions, terms of service, user agreement, website terms"
        url="/terms"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-neon-purple mb-6 animate-fade-in">
              <HiShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Conditions</span>
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
                Welcome to Geoffrey Munene's website. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              {/* Sections */}
              <div className="space-y-8">
                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use License</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of the materials on Geoffrey Munene's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                    <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    This license shall automatically terminate if you violate any of these restrictions and may be terminated by Geoffrey Munene at any time.
                  </p>
                </div>

                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Disclaimer</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    The materials on Geoffrey Munene's website are provided on an 'as is' basis. Geoffrey Munene makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Further, Geoffrey Munene does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                  </p>
                </div>

                <div className="border-l-4 border-neon-pink pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Limitations</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    In no event shall Geoffrey Munene or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Geoffrey Munene's website.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                  </p>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Accuracy of Materials</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The materials appearing on Geoffrey Munene's website could include technical, typographical, or photographic errors. Geoffrey Munene does not warrant that any of the materials on its website are accurate, complete, or current. Geoffrey Munene may make changes to the materials contained on its website at any time without notice.
                  </p>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Links</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Geoffrey Munene has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Geoffrey Munene of the site. Use of any such linked website is at the user's own risk.
                  </p>
                </div>

                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Modifications</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Geoffrey Munene may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>

                <div className="border-l-4 border-neon-pink pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. User Content</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    You retain ownership of any content you submit, post, or display on or through the website ("User Content"). By submitting, posting, or displaying User Content on or through the website, you grant Geoffrey Munene a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such User Content.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    You are responsible for your User Content. You represent and warrant that you have all rights, power, and authority necessary to grant the rights granted herein to any User Content that you submit.
                  </p>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Prohibited Uses</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    You may not use the website:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>In any way that violates any applicable national or international law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                    <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                    <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
                  </ul>
                </div>

                <div className="border-l-4 border-neon-blue pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Intellectual Property Rights</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The website and its original content, features, and functionality are and will remain the exclusive property of Geoffrey Munene and its licensors. The website is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                  </p>
                </div>

                <div className="border-l-4 border-neon-green pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Termination</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the website will cease immediately.
                  </p>
                </div>

                <div className="border-l-4 border-neon-pink pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    These Terms shall be interpreted and governed by the laws of the jurisdiction in which Geoffrey Munene operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                  </p>
                </div>

                <div className="border-l-4 border-neon-purple pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Contact Information</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    If you have any questions about these Terms & Conditions, please contact us at:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Email: <a href="mailto:munenemuchokiofficial@gmail.com" className="text-neon-blue hover:text-neon-blue/80 transition-colors font-medium">munenemuchokiofficial@gmail.com</a>
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

export default Terms
