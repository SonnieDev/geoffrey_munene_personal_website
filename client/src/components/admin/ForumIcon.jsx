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

const ICON_MAP = {
  'chart-bar': HiChartBar,
  'rocket-launch': HiRocketLaunch,
  'sparkles': HiSparkles,
  'fire': HiFire,
  'briefcase': HiBriefcase,
  'globe': HiGlobeAlt,
  'user-group': HiUserGroup,
  'light-bulb': HiLightBulb,
  'bolt': HiBolt,
  'cog': HiCog6Tooth,
  'document-text': HiDocumentText,
  'code-bracket': HiCodeBracket,
  'academic-cap': HiAcademicCap,
  'chat-bubble': HiChatBubbleLeftRight,
  'chat-bubble-left-right': HiChatBubbleLeftRight,
  'star': HiStar,
  'heart': HiHeart,
  'wrench-screwdriver': HiWrenchScrewdriver,
}

function ForumIcon({ icon, className = '', size = 24 }) {
  if (!icon) {
    const DefaultIcon = HiChatBubbleLeftRight
    return <DefaultIcon className={className} size={size} />
  }

  // Check if it's an emoji
  if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
    return <span className={`forum-icon-emoji ${className}`} style={{ fontSize: `${size}px` }}>{icon}</span>
  }

  // Get React Icon component
  const IconComponent = ICON_MAP[icon.toLowerCase()] || HiChatBubbleLeftRight

  return <IconComponent className={className} size={size} />
}

export default ForumIcon

