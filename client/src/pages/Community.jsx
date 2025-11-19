import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
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
import '../styles/pages/community.css'

function Community() {
  const [activeTab, setActiveTab] = useState('feed')

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: HiBolt, color: '#3b82f6' },
    { id: 'forums', label: 'Forums', icon: HiChatBubbleLeftRight, color: '#8b5cf6' },
    { id: 'events', label: 'Events', icon: HiCalendar, color: '#ec4899' },
    { id: 'resources', label: 'Resources', icon: HiBookOpen, color: '#10b981' },
    { id: 'showcase', label: 'Showcase', icon: HiStar, color: '#f59e0b' },
  ]

  return (
    <>
      <SEO
        title="Community - Connect, Learn & Grow Together"
        description="Join our vibrant community of entrepreneurs and professionals. Share insights, ask questions, showcase your work, and learn from each other."
        keywords="community, forums, networking, remote work community, entrepreneur community, professional network"
        url="/community"
      />
      <div className="community-page">
        <section className="community-hero">
          <div className="community-container">
            <h1 className="page-title">Community</h1>
            <p className="page-subtitle">
              Connect, learn, and grow together with fellow entrepreneurs and professionals
            </p>
          </div>
        </section>

        <section className="community-content">
          <div className="community-wrapper">
            {/* Tab Navigation */}
            <div className="community-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    className={`community-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={activeTab === tab.id ? { '--tab-color': tab.color } : {}}
                  >
                    <Icon className="tab-icon" />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="community-tab-content">
              {activeTab === 'feed' && <CommunityFeed />}
              {activeTab === 'forums' && <ForumsSection />}
              {activeTab === 'events' && <EventsSection />}
              {activeTab === 'resources' && <ResourcesSection />}
              {activeTab === 'showcase' && <ShowcaseSection />}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Community

