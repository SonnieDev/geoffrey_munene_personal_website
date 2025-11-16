import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Blog from '../models/Blog.js'

dotenv.config()

const blogs = [
  {
    title: '5 Essential Tips for Landing Your First Remote Job',
    excerpt: 'Learn the key strategies that successful remote job seekers use to stand out in a competitive market. From optimizing your resume to acing virtual interviews, discover what it takes to land your dream remote position.',
    content: `# 5 Essential Tips for Landing Your First Remote Job

Landing your first remote job can feel overwhelming, but with the right strategy, you can stand out from the competition. Here are five essential tips to help you succeed:

## 1. Optimize Your Resume for Remote Work

Your resume needs to highlight remote-ready skills. Emphasize:
- Self-motivation and time management
- Communication skills (especially written)
- Experience with remote collaboration tools
- Results-oriented work style

Use keywords like "remote work," "distributed team," and "virtual collaboration" to catch the attention of ATS systems.

## 2. Build a Strong Online Presence

Remote employers will Google you. Make sure they find:
- A professional LinkedIn profile
- A portfolio or personal website
- Active professional social media presence
- Positive online reputation

## 3. Master Virtual Interviews

Remote interviews require different skills:
- Test your technology beforehand
- Create a professional background
- Maintain eye contact with the camera
- Prepare for common remote work questions

## 4. Showcase Remote Work Skills

Even without remote experience, highlight transferable skills:
- Independent project management
- Clear written communication
- Ability to work with minimal supervision
- Tech-savviness

## 5. Be Persistent and Patient

Remote job hunting takes time. Stay consistent:
- Apply to multiple positions daily
- Follow up on applications
- Network with remote workers
- Continue learning new skills

Remember, landing your first remote job is a journey. Stay focused, keep improving, and don't give up!`,
    category: 'Remote Work Tips',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    title: 'How to Build a Remote Work Resume That Gets Noticed',
    excerpt: 'Discover what hiring managers look for in remote work applications and how to highlight your remote-ready skills. Learn the secrets to crafting a resume that stands out in the digital job market.',
    content: `# How to Build a Remote Work Resume That Gets Noticed

Your resume is your first impression in the remote job market. Here's how to make it count:

## Key Sections for Remote Work Resumes

### 1. Professional Summary
Start with a compelling summary that mentions:
- Your interest in remote work
- Key remote-ready skills
- Years of relevant experience
- What you bring to remote teams

### 2. Skills Section
Highlight these essential remote work skills:
- Communication tools (Slack, Zoom, Teams)
- Project management (Asana, Trello, Jira)
- Time management and organization
- Self-motivation and discipline

### 3. Work Experience
Format your experience to show:
- Results and achievements (use numbers!)
- Independent work capabilities
- Collaboration across time zones
- Use of remote collaboration tools

### 4. Remote Work Experience
If you have any remote experience, make it prominent:
- Highlight remote projects
- Mention distributed team collaboration
- Showcase virtual communication skills

## Pro Tips

- Use action verbs: "Managed," "Collaborated," "Delivered"
- Quantify achievements: "Increased productivity by 30%"
- Include remote work keywords naturally
- Keep it to 1-2 pages maximum
- Use a clean, ATS-friendly format

## Common Mistakes to Avoid

- Don't just list job duties
- Avoid generic statements
- Don't ignore the cover letter
- Never use unprofessional email addresses
- Don't forget to proofread!

Your resume is your ticket to remote work opportunities. Make it count!`,
    category: 'Career Development',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    title: 'Top 10 Remote Work Platforms in 2025',
    excerpt: 'A comprehensive guide to the best platforms for finding remote work opportunities across different industries. Compare features, pricing, and success rates to find the perfect platform for your job search.',
    content: `# Top 10 Remote Work Platforms in 2025

Finding the right platform can make all the difference in your remote job search. Here are the top platforms to consider:

## 1. Remote.co
**Best for:** Curated quality listings
- Hand-screened remote jobs
- Multiple industries
- Free to use
- Great for beginners

## 2. We Work Remotely
**Best for:** Tech and design roles
- Largest remote work community
- High-quality listings
- Free for job seekers
- Active community

## 3. FlexJobs
**Best for:** Premium job seekers
- Hand-screened opportunities
- No scams or ads
- Career resources included
- Subscription-based

## 4. Remote OK
**Best for:** Tech professionals
- Programming and design focus
- Free to use
- Good filtering options
- Active job board

## 5. AngelList
**Best for:** Startup opportunities
- Startup-focused
- Equity options
- Free to use
- Great for tech roles

## 6. Upwork
**Best for:** Freelancers
- Project-based work
- Long-term contracts available
- Rating system
- Commission-based

## 7. Toptal
**Best for:** Top-tier freelancers
- Elite talent network
- High-paying projects
- Rigorous screening
- Premium platform

## 8. LinkedIn
**Best for:** Professional networking
- Remote job filters
- Networking opportunities
- Company insights
- Free and premium options

## 9. Indeed
**Best for:** Broad job search
- Large job database
- Remote filters available
- Free to use
- Easy application process

## 10. Working Nomads
**Best for:** Digital nomads
- Curated remote jobs
- Weekly email digest
- Free to use
- Nomad-friendly focus

## Choosing the Right Platform

Consider:
- Your industry and skills
- Budget (free vs. paid)
- Job type preference (full-time vs. freelance)
- Your experience level
- Desired company size

Diversify your search across multiple platforms for best results!`,
    category: 'Remote Work Tips',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    featured: false,
  },
  {
    title: 'Mastering Asynchronous Communication in Remote Teams',
    excerpt: 'Learn how to communicate effectively across time zones and build strong relationships with your remote team. Discover tools, techniques, and best practices for asynchronous collaboration.',
    content: `# Mastering Asynchronous Communication in Remote Teams

Asynchronous communication is the backbone of successful remote work. Here's how to master it:

## What is Asynchronous Communication?

Asynchronous communication happens when team members don't need to be online at the same time. This is essential for:
- Global teams across time zones
- Flexible work schedules
- Deep focus work
- Better work-life balance

## Key Principles

### 1. Write Clear, Complete Messages
- Provide all necessary context
- Use clear subject lines
- Include action items
- Set expectations for response time

### 2. Choose the Right Channel
- **Email:** Formal, detailed, documentation
- **Slack/Teams:** Quick updates, team chat
- **Project tools:** Task-specific discussions
- **Documentation:** Knowledge sharing

### 3. Set Response Time Expectations
- Define "urgent" vs. "normal" priority
- Use status indicators (available, away, busy)
- Set clear deadlines
- Respect others' time zones

## Best Practices

### Documentation First
- Document decisions and processes
- Create shared knowledge bases
- Use wikis and documentation tools
- Keep information searchable

### Use Video When Needed
- Complex discussions
- Relationship building
- Sensitive topics
- Team meetings

### Be Proactive
- Share updates before being asked
- Over-communicate important information
- Provide status updates regularly
- Anticipate questions

## Tools for Async Communication

- **Slack:** Team messaging
- **Notion:** Documentation and wikis
- **Loom:** Video messages
- **Google Docs:** Collaborative documents
- **Trello/Asana:** Project management

## Common Mistakes to Avoid

- Assuming everyone saw your message
- Using async tools for urgent matters
- Not providing enough context
- Ignoring time zones
- Over-relying on meetings

Master asynchronous communication, and you'll thrive in remote work!`,
    category: 'Remote Work Skills',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    featured: false,
  },
  {
    title: 'Creating Your Perfect Remote Work Setup: A Complete Guide',
    excerpt: 'Transform your space into a productive remote work environment. From ergonomic furniture to tech essentials, learn how to create a home office that boosts productivity and supports your well-being.',
    content: `# Creating Your Perfect Remote Work Setup: A Complete Guide

Your workspace directly impacts your productivity and well-being. Here's how to create the perfect remote work setup:

## Essential Equipment

### 1. Ergonomic Chair
- Lumbar support
- Adjustable height
- Armrests
- Breathable material
- Budget: $100-$500

### 2. Standing Desk (Optional but Recommended)
- Adjustable height
- Spacious surface
- Cable management
- Budget: $200-$800

### 3. Monitor Setup
- External monitor (24" minimum)
- Proper height adjustment
- Blue light filter
- Dual monitor setup (optional)

### 4. Keyboard and Mouse
- Ergonomic keyboard
- Wireless mouse
- Wrist support
- Comfortable for long hours

## Tech Essentials

### Reliable Internet
- Minimum 25 Mbps download
- 5 Mbps upload
- Backup connection option
- Ethernet cable for stability

### Quality Webcam
- HD resolution (1080p)
- Good low-light performance
- Built-in microphone (or separate)
- Privacy shutter

### Headset/Headphones
- Noise cancellation
- Clear microphone
- Comfortable for long calls
- Wireless option

## Workspace Design

### Lighting
- Natural light when possible
- Task lighting
- Avoid screen glare
- Warm, comfortable ambiance

### Organization
- Cable management
- Storage solutions
- Minimal distractions
- Personal touches

### Background
- Professional appearance
- Good lighting
- Minimal clutter
- Virtual backgrounds (backup)

## Productivity Boosters

### Plants
- Improve air quality
- Reduce stress
- Add visual interest
- Low-maintenance options

### Whiteboard/Notebook
- Quick notes
- Brainstorming
- Visual planning
- Stay organized

### Proper Ventilation
- Fresh air circulation
- Comfortable temperature
- Good air quality

## Budget-Friendly Tips

- Start with essentials
- Upgrade gradually
- Buy used furniture
- DIY solutions
- Company reimbursement

## Health Considerations

- Take regular breaks
- Use ergonomic accessories
- Maintain good posture
- Exercise regularly
- Stay hydrated

## Quick Setup Checklist

- [ ] Comfortable chair
- [ ] Proper desk height
- [ ] External monitor
- [ ] Good lighting
- [ ] Reliable internet
- [ ] Quality webcam
- [ ] Headset/headphones
- [ ] Organized space
- [ ] Professional background
- [ ] Personal touches

Invest in your workspace - it's an investment in your productivity and health!`,
    category: 'Remote Work Tips',
    thumbnail: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
    featured: true,
  },
]

const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB Connected')

    // Clear existing blogs
    await Blog.deleteMany({})
    console.log('Cleared existing blogs')

    // Insert new blogs
    const createdBlogs = await Blog.insertMany(blogs)
    console.log(`Created ${createdBlogs.length} blog posts`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding blogs:', error)
    process.exit(1)
  }
}

seedBlogs()

