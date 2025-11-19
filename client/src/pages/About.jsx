import SEO from '../components/SEO'
import { HiBriefcase, HiAcademicCap, HiLightBulb, HiChartBar } from 'react-icons/hi2'

function About() {
  return (
    <>
      <SEO
        title="About Geoffrey Munene"
        description="Learn about Geoffrey Munene, a content creator and remote work coach dedicated to helping people navigate the world of remote work and build successful digital careers."
        keywords="about Geoffrey Munene, remote work coach, content creator, digital nomad coach, remote work expert"
        url="/about"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-neon-green/10 dark:bg-neon-green/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-green text-sm font-medium tracking-wider">WHO I AM</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">Me</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Content Creator & Remote Work Coach
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Mission Section */}
            <div className="glass-panel p-8 rounded-2xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Mission</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  I'm Geoffrey Munene, a content creator and remote work coach dedicated to helping people
                  navigate the world of remote work. My mission is to empower individuals to land remote jobs,
                  work online, and build successful digital careers.
                </p>
                <p>
                  Through my content, tutorials, and resources, I share practical strategies, proven tips,
                  and real-world insights that make remote work accessible to everyone. Whether you're just
                  starting your remote work journey or looking to advance your digital career, I'm here to help.
                </p>
                <p>
                  I believe that remote work is the future, and everyone deserves the opportunity to work
                  from anywhere, build a fulfilling career, and achieve work-life balance.
                </p>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">What I Help With</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl hover:border-neon-blue/30 transition-all group">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-neon-blue inline-block mb-4">
                    <HiBriefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remote Job Search</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Finding the right remote opportunities that match your skills and goals
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl hover:border-neon-green/30 transition-all group">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-neon-green inline-block mb-4">
                    <HiChartBar className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Career Development</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Building skills and strategies to grow in the digital economy
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl hover:border-neon-purple/30 transition-all group">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-neon-purple inline-block mb-4">
                    <HiAcademicCap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Process</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Crafting resumes, cover letters, and applications that get noticed
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl hover:border-neon-pink/30 transition-all group">
                  <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-neon-pink inline-block mb-4">
                    <HiLightBulb className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remote Work Skills</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Developing the communication and productivity skills needed for remote success
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

export default About
