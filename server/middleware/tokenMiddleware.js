import User from '../models/User.js'
import TokenTransaction from '../models/TokenTransaction.js'

// Token costs per tool (configurable)
const TOKEN_COSTS = {
  resume: 5,
  'cover-letter': 4,
  email: 2,
  'interview-prep': 6,
  'skills-assessment': 5,
  'salary-negotiation': 5,
}

// Get or create user by session ID
export const getOrCreateUser = async (sessionId) => {
  if (!sessionId) {
    return null
  }

  let user = await User.findOne({ sessionId })

  if (!user) {
    // Create new user with trial tokens
    const TRIAL_TOKENS = parseInt(process.env.TRIAL_TOKENS || '10', 10)
    user = await User.create({
      sessionId,
      tokens: TRIAL_TOKENS,
      trialTokensGiven: true,
    })

    // Record trial token transaction
    await TokenTransaction.create({
      userId: user._id,
      type: 'trial',
      amount: TRIAL_TOKENS,
      balanceAfter: TRIAL_TOKENS,
      description: 'Welcome trial tokens',
    })
  }

  return user
}

// Check if user has enough tokens
export const checkTokens = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId
    // Extract tool ID from the route path (e.g., /api/tools/resume -> resume)
    const pathParts = req.path.split('/').filter(p => p)
    const toolId = pathParts[pathParts.length - 1] || req.body.toolId

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required. Please refresh the page.',
      })
    }

    const user = await getOrCreateUser(sessionId)
    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize user session',
      })
    }

    const tokenCost = TOKEN_COSTS[toolId] || 5 // Default cost

    if (user.tokens < tokenCost) {
      return res.status(402).json({
        success: false,
        message: `Insufficient tokens. This tool requires ${tokenCost} tokens. You have ${user.tokens} tokens remaining.`,
        tokensRequired: tokenCost,
        tokensAvailable: user.tokens,
      })
    }

    // Attach user and token cost to request
    req.user = user
    req.tokenCost = tokenCost
    req.toolId = toolId

    next()
  } catch (error) {
    console.error('Error checking tokens:', error)
    res.status(500).json({
      success: false,
      message: 'Error checking token balance',
    })
  }
}

// Deduct tokens after successful tool usage
export const deductTokens = async (userId, toolId, tokenCost) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Deduct tokens
    user.tokens -= tokenCost
    user.totalTokensUsed += tokenCost
    await user.save()

    // Record transaction
    await TokenTransaction.create({
      userId: user._id,
      type: 'usage',
      amount: -tokenCost,
      toolUsed: toolId,
      balanceAfter: user.tokens,
      description: `Used ${toolId} tool`,
    })

    return user.tokens
  } catch (error) {
    console.error('Error deducting tokens:', error)
    throw error
  }
}

// Get token balance
export const getTokenBalance = async (sessionId) => {
  try {
    const user = await getOrCreateUser(sessionId)
    return user ? user.tokens : 0
  } catch (error) {
    console.error('Error getting token balance:', error)
    return 0
  }
}

export { TOKEN_COSTS }

