import { useState, useRef, useEffect } from 'react'
import {
  HiChartBar,
  HiBriefcase,
  HiLightBulb,
  HiDocumentText,
  HiUserGroup,
  HiWrenchScrewdriver,
  HiChatBubbleLeftRight,
  HiRocketLaunch,
  HiGlobeAlt,
  HiAcademicCap,
  HiCodeBracket,
  HiSparkles,
  HiFire,
  HiStar,
  HiHeart,
  HiBolt,
  HiCog6Tooth,
} from 'react-icons/hi2'
import '../../styles/components/forum-icon-picker.css'

const ICON_OPTIONS = [
  // Business & Growth
  { name: 'Chart Bar', icon: HiChartBar, category: 'business-growth' },
  { name: 'Rocket Launch', icon: HiRocketLaunch, category: 'business-growth' },
  { name: 'Sparkles', icon: HiSparkles, category: 'business-growth' },
  { name: 'Fire', icon: HiFire, category: 'business-growth' },
  
  // Remote Work
  { name: 'Briefcase', icon: HiBriefcase, category: 'remote-work' },
  { name: 'Globe', icon: HiGlobeAlt, category: 'remote-work' },
  { name: 'User Group', icon: HiUserGroup, category: 'remote-work' },
  
  // Productivity
  { name: 'Light Bulb', icon: HiLightBulb, category: 'productivity' },
  { name: 'Bolt', icon: HiBolt, category: 'productivity' },
  { name: 'Cog', icon: HiCog6Tooth, category: 'productivity' },
  
  // Content Strategy
  { name: 'Document Text', icon: HiDocumentText, category: 'content-strategy' },
  { name: 'Code Bracket', icon: HiCodeBracket, category: 'content-strategy' },
  { name: 'Academic Cap', icon: HiAcademicCap, category: 'content-strategy' },
  
  // Networking
  { name: 'User Group', icon: HiUserGroup, category: 'networking' },
  { name: 'Chat Bubble', icon: HiChatBubbleLeftRight, category: 'networking' },
  { name: 'Star', icon: HiStar, category: 'networking' },
  
  // Tools & Resources
  { name: 'Wrench Screwdriver', icon: HiWrenchScrewdriver, category: 'tools-resources' },
  { name: 'Sparkles', icon: HiSparkles, category: 'tools-resources' },
  { name: 'Bolt', icon: HiBolt, category: 'tools-resources' },
  
  // General
  { name: 'Chat Bubble', icon: HiChatBubbleLeftRight, category: 'general' },
  { name: 'Heart', icon: HiHeart, category: 'general' },
  { name: 'Star', icon: HiStar, category: 'general' },
]

function ForumIconPicker({ value, onChange, category }) {
  const [showPicker, setShowPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pickerRef = useRef(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
        setSearchTerm('')
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  // Filter icons by category and search term
  const filteredIcons = ICON_OPTIONS.filter((option) => {
    const matchesCategory = !category || option.category === category || option.category === 'general'
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get icon component from value (could be icon name or emoji)
  const getIconComponent = (iconValue) => {
    if (!iconValue) return HiChatBubbleLeftRight
    
    // Check if it's an emoji (contains non-ASCII characters)
    if (/[\u{1F300}-\u{1F9FF}]/u.test(iconValue)) {
      return null // Return null for emoji, will render as text
    }
    
    // Normalize the icon value for comparison
    const normalizedValue = iconValue.toLowerCase().trim()
    
    // Try to find matching icon by normalized name
    const iconOption = ICON_OPTIONS.find(
      (opt) => opt.name.toLowerCase().replace(/\s+/g, '-') === normalizedValue
    )
    return iconOption ? iconOption.icon : HiChatBubbleLeftRight
  }

  const handleIconSelect = (iconName, IconComponent) => {
    // Store icon name in format: "chart-bar" or keep emoji as is
    const iconValue = IconComponent ? iconName.toLowerCase().replace(/\s+/g, '-') : iconName
    onChange(iconValue)
    setShowPicker(false)
    setSearchTerm('')
  }

  const currentIcon = getIconComponent(value)
  const isEmoji = value && /[\u{1F300}-\u{1F9FF}]/u.test(value)

  return (
    <div className="forum-icon-picker" ref={pickerRef}>
      <div className="icon-picker-trigger" onClick={() => setShowPicker(!showPicker)}>
        <div className="icon-preview">
          {isEmoji ? (
            <span className="icon-emoji">{value}</span>
          ) : currentIcon ? (
            <currentIcon className="icon-react-icon" />
          ) : (
            <HiChatBubbleLeftRight className="icon-react-icon" />
          )}
        </div>
        <span className="icon-picker-label">Select Icon</span>
        <span className="icon-picker-arrow">{showPicker ? '▲' : '▼'}</span>
      </div>

      {showPicker && (
        <div className="icon-picker-dropdown">
          <div className="icon-picker-search">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icon-search-input"
            />
          </div>
          <div className="icon-picker-grid">
            {/* Emoji option */}
            <div
              className="icon-option emoji-option"
              onClick={() => {
                const emoji = prompt('Enter an emoji:')
                if (emoji) {
                  handleIconSelect(emoji, null)
                }
              }}
            >
              <span className="emoji-preview">😀</span>
              <span className="icon-option-name">Custom Emoji</span>
            </div>

            {/* React Icons */}
            {filteredIcons.map((option, index) => {
              const Icon = option.icon
              const iconName = option.name.toLowerCase().replace(/\s+/g, '-')
              const isSelected = value === iconName

              return (
                <div
                  key={index}
                  className={`icon-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(iconName, Icon)}
                  title={option.name}
                >
                  <Icon className="icon-react-icon" />
                  <span className="icon-option-name">{option.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumIconPicker

