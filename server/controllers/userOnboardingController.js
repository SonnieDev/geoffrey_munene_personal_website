import User from '../models/User.js'
import logger from '../utils/logger.js'

// @desc    Update user preferences and onboarding status
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { 
      signupPurpose, 
      experienceLevel, 
      interests, 
      goals, 
      onboardingCompleted, 
      onboardingSteps,
      // Profile preferences
      displayName,
      bio,
      location,
      website,
      // Notification preferences
      emailNotifications,
      marketingEmails,
      productUpdates,
      weeklyDigest,
      // General preferences
      theme,
      language,
      timezone
    } = req.body

    const updateData = {}
    
    if (signupPurpose !== undefined) updateData.signupPurpose = signupPurpose
    if (experienceLevel !== undefined) updateData['preferences.experienceLevel'] = experienceLevel
    if (interests !== undefined) updateData['preferences.interests'] = interests
    if (goals !== undefined) updateData['preferences.goals'] = goals
    if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted
    
    // Profile preferences
    if (displayName !== undefined) updateData['preferences.displayName'] = displayName
    if (bio !== undefined) updateData['preferences.bio'] = bio
    if (location !== undefined) updateData['preferences.location'] = location
    if (website !== undefined) updateData['preferences.website'] = website
    
    // Notification preferences
    if (emailNotifications !== undefined) updateData['preferences.emailNotifications'] = emailNotifications
    if (marketingEmails !== undefined) updateData['preferences.marketingEmails'] = marketingEmails
    if (productUpdates !== undefined) updateData['preferences.productUpdates'] = productUpdates
    if (weeklyDigest !== undefined) updateData['preferences.weeklyDigest'] = weeklyDigest
    
    // General preferences
    if (theme !== undefined) updateData['preferences.theme'] = theme
    if (language !== undefined) updateData['preferences.language'] = language
    if (timezone !== undefined) updateData['preferences.timezone'] = timezone
    
    // Update onboarding steps
    if (onboardingSteps) {
      Object.keys(onboardingSteps).forEach((step) => {
        updateData[`onboardingSteps.${step}`] = onboardingSteps[step]
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'updatePreferences' })
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
    })
  }
}

// @desc    Get user onboarding status
// @route   GET /api/users/onboarding
// @access  Private
export const getOnboardingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('onboardingCompleted onboardingSteps signupPurpose preferences progress')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        onboardingCompleted: user.onboardingCompleted,
        onboardingSteps: user.onboardingSteps,
        signupPurpose: user.signupPurpose,
        preferences: user.preferences,
        progress: user.progress,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'getOnboardingStatus' })
    res.status(500).json({
      success: false,
      message: 'Failed to get onboarding status',
    })
  }
}

// @desc    Update onboarding step
// @route   PUT /api/users/onboarding/step
// @access  Private
export const updateOnboardingStep = async (req, res) => {
  try {
    const { step, completed } = req.body

    if (!step || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Step and completed status are required',
      })
    }

    const validSteps = ['profileSetup', 'firstToolUsed', 'firstContentGenerated', 'tokensPurchased', 'resourcesViewed']
    if (!validSteps.includes(step)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step name',
      })
    }

    // Get current user first to calculate points
    const currentUser = await User.findById(req.user.id)
    
    const updateData = {
      [`onboardingSteps.${step}`]: completed,
    }

    // Award points for completing steps
    if (completed) {
      const pointsMap = {
        profileSetup: 10,
        firstToolUsed: 20,
        firstContentGenerated: 15,
        tokensPurchased: 25,
        resourcesViewed: 10,
      }

      const points = pointsMap[step] || 0
      const newPoints = (currentUser.progress?.points || 0) + points
      updateData['progress.points'] = newPoints
      updateData['progress.lastActiveDate'] = new Date()
      
      // Calculate level based on points (every 100 points = 1 level)
      updateData['progress.level'] = Math.floor(newPoints / 100) + 1
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    })
  } catch (error) {
    logger.errorWithContext(error, { action: 'updateOnboardingStep' })
    res.status(500).json({
      success: false,
      message: 'Failed to update onboarding step',
    })
  }
}

