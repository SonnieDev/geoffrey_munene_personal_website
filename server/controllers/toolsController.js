import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// @desc    Generate resume content
// @route   POST /api/tools/resume
// @access  Public
export const generateResume = async (req, res) => {
  try {
    const { name, email, phone, experience, skills, jobTitle, summary } = req.body

    if (!name || !experience || !skills) {
      return res.status(400).json({
        success: false,
        message: 'Name, experience, and skills are required',
      })
    }

    const prompt = `Create a professional, ATS-friendly resume for a remote work position. 

Name: ${name}
Email: ${email || 'Not provided'}
Phone: ${phone || 'Not provided'}
Target Job Title: ${jobTitle || 'Remote Position'}
Professional Summary: ${summary || 'Experienced professional seeking remote opportunities'}

Work Experience:
${experience}

Skills:
${skills}

Please format this as a professional resume with clear sections: Header (name, contact), Professional Summary, Work Experience, and Skills. Make it ATS-friendly and optimized for remote work positions.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer specializing in remote work positions and ATS optimization.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        resume: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating resume:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume',
      error: error.message,
    })
  }
}

// @desc    Generate cover letter
// @route   POST /api/tools/cover-letter
// @access  Public
export const generateCoverLetter = async (req, res) => {
  try {
    const { name, companyName, jobTitle, experience, skills, whyInterested } = req.body

    if (!name || !companyName || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Name, company name, and job title are required',
      })
    }

    const prompt = `Write a compelling cover letter for a remote work position.

Applicant Name: ${name}
Company Name: ${companyName}
Job Title: ${jobTitle}
Relevant Experience: ${experience || 'Not provided'}
Key Skills: ${skills || 'Not provided'}
Why Interested: ${whyInterested || 'Seeking remote work opportunities'}

Create a professional cover letter that:
1. Highlights remote work readiness
2. Shows enthusiasm for the position
3. Demonstrates relevant skills and experience
4. Is personalized to the company and role
5. Is concise and impactful (3-4 paragraphs)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cover letter writer specializing in remote work applications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        coverLetter: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate cover letter',
      error: error.message,
    })
  }
}

// @desc    Generate email template
// @route   POST /api/tools/email
// @access  Public
export const generateEmail = async (req, res) => {
  try {
    const { emailType, recipientName, purpose, context } = req.body

    if (!emailType || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email type and purpose are required',
      })
    }

    const emailTypes = {
      networking: 'professional networking email',
      followup: 'follow-up email after an interview or application',
      application: 'job application inquiry email',
      thankYou: 'thank you email after an interview',
    }

    const prompt = `Write a professional ${emailTypes[emailType] || 'email'} for remote work context.

Recipient: ${recipientName || 'Hiring Manager'}
Purpose: ${purpose}
Additional Context: ${context || 'None'}

Create a professional, concise email that:
1. Is appropriate for the ${emailType} context
2. Shows professionalism and remote work awareness
3. Is clear and actionable
4. Maintains appropriate tone
5. Is 2-3 paragraphs maximum`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer specializing in remote work communications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        email: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating email:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate email',
      error: error.message,
    })
  }
}

// @desc    Generate interview prep questions
// @route   POST /api/tools/interview-prep
// @access  Public
export const generateInterviewPrep = async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body

    const prompt = `Generate 10 common remote work interview questions and provide sample answers for each.

Job Title: ${jobTitle || 'Remote Position'}
Experience Level: ${experience || 'Mid-level'}
Key Skills: ${skills || 'General remote work skills'}

For each question, provide:
1. The question
2. A strong sample answer that highlights remote work readiness
3. Key points to emphasize

Focus on questions about:
- Remote work experience and preferences
- Time management and self-motivation
- Communication skills
- Technical setup and tools
- Work-life balance
- Collaboration in remote settings`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an interview coach specializing in remote work interviews.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        interviewPrep: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating interview prep:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview prep',
      error: error.message,
    })
  }
}

// @desc    Generate skills assessment
// @route   POST /api/tools/skills-assessment
// @access  Public
export const generateSkillsAssessment = async (req, res) => {
  try {
    const { currentSkills, experience, goals } = req.body

    const prompt = `Assess remote work readiness and provide recommendations.

Current Skills: ${currentSkills || 'Not specified'}
Experience Level: ${experience || 'Not specified'}
Career Goals: ${goals || 'Remote work opportunities'}

Provide:
1. Assessment of current remote work readiness (1-10 scale)
2. Strengths for remote work
3. Areas for improvement
4. Recommended skills to develop
5. Actionable steps to improve remote work readiness
6. Tools and resources to consider`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a career coach specializing in remote work skills assessment.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        assessment: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating skills assessment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate skills assessment',
      error: error.message,
    })
  }
}

// @desc    Generate salary negotiation guide
// @route   POST /api/tools/salary-negotiation
// @access  Public
export const generateSalaryNegotiation = async (req, res) => {
  try {
    const { jobTitle, location, experience, currentSalary, offerAmount } = req.body

    const prompt = `Create a salary negotiation guide for a remote work position.

Job Title: ${jobTitle || 'Remote Position'}
Location/Time Zone: ${location || 'Remote'}
Experience Level: ${experience || 'Not specified'}
Current Salary: ${currentSalary || 'Not disclosed'}
Offer Amount: ${offerAmount || 'Not provided'}

Provide:
1. Market rate research guidance
2. Negotiation strategy for remote positions
3. Key points to discuss (salary, benefits, flexibility)
4. Sample negotiation email/script
5. Common mistakes to avoid
6. Tips specific to remote work negotiations`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a salary negotiation expert specializing in remote work positions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    res.status(200).json({
      success: true,
      data: {
        guide: completion.choices[0].message.content,
      },
    })
  } catch (error) {
    console.error('Error generating salary negotiation guide:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate salary negotiation guide',
      error: error.message,
    })
  }
}

