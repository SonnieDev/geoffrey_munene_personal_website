import { useState } from 'react'
import {
  HiBolt,
  HiChatBubbleLeftRight,
  HiCalendar,
  HiBookOpen,
  HiStar
} from 'react-icons/hi2'
import SEO from '../components/SEO'
import CommunityFeed from '../components/community/CommunityFeed'
import ForumsSection from '../components/community/ForumsSection'
import EventsSection from '../components/community/EventsSection'
import ResourcesSection from '../components/community/ResourcesSection'
import ShowcaseSection from '../components/community/ShowcaseSection'

function Community() {
  const [activeTab, setActiveTab] = useState('feed')

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: HiBolt, color: 'text-blue-500', borderColor: 'border-blue-500' },
    { id: 'forums', label: 'Forums', icon: HiChatBubbleLeftRight, color: 'text-purple-500', borderColor: 'border-purple-500' },
    { id: 'events', label: 'Events', icon: HiCalendar, color: 'text-pink-500', borderColor: 'border-pink-500' },
    { id: 'resources', label: 'Resources', icon: HiBookOpen, color: 'text-emerald-500', borderColor: 'border-emerald-500' },
    { id: 'showcase', label: 'Showcase', icon: HiStar, color: 'text-amber-500', borderColor: 'border-amber-500' },
  ]

  return (
    <>
      <SEO
        title="Community - Connect, Learn & Grow Together"
        description="Join our vibrant community of entrepreneurs and professionals. Share insights, ask questions, showcase your work, and learn from each other."
        keywords="community, forums, networking, remote work community, entrepreneur community, professional network"
        url="/community"
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
              <span className="text-neon-blue text-sm font-medium tracking-wider">JOIN THE MOVEMENT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Community</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Connect, learn, and grow together with fellow entrepreneurs and professionals in the remote work ecosystem.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-24 relative z-10">
          <div className="community-wrapper max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="glass-panel p-2 rounded-xl mb-8 overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex space-x-2 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${isActive
                          ? `bg-white dark:bg-white/10 shadow-sm ${tab.color} dark:text-white ring-1 ring-black/5 dark:ring-white/10`
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {activeTab === 'feed' && <CommunityFeed />}
              {activeTab === 'forums' && <ForumsSection />}
              {activeTab === 'events' && <EventsSection />}
              {activeTab === 'resources' && <ResourcesSection />}
              {activeTab === 'showcase' && <ShowcaseSection />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Community
