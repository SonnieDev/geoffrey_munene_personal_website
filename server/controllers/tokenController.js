import User from '../models/User.js'
import TokenTransaction from '../models/TokenTransaction.js'
import { getOrCreateUser, getTokenBalance } from '../middleware/tokenMiddleware.js'

// @desc    Get token balance
// @route   GET /api/tokens/balance
// @access  Public
export const getBalance = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      })
    }

    const balance = await getTokenBalance(sessionId)
    const user = await User.findOne({ sessionId })

    res.status(200).json({
      success: true,
      data: {
        tokens: balance,
        trialTokensGiven: user?.trialTokensGiven || false,
        totalTokensUsed: user?.totalTokensUsed || 0,
        totalTokensPurchased: user?.totalTokensPurchased || 0,
      },
    })
  } catch (error) {
    console.error('Error getting token balance:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get token balance',
    })
  }
}

// @desc    Get token transaction history
// @route   GET /api/tokens/transactions
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId
    const limit = parseInt(req.query.limit) || 20

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      })
    }

    const user = await getOrCreateUser(sessionId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const transactions = await TokenTransaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-userId')

    res.status(200).json({
      success: true,
      data: {
        transactions,
      },
    })
  } catch (error) {
    console.error('Error getting transactions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions',
    })
  }
}

// @desc    Initialize Paystack payment for token purchase
// @route   POST /api/tokens/initialize-payment
// @access  Public
export const initializePayment = async (req, res) => {
  try {
    const axios = (await import('axios')).default
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    
    if (!paystackSecretKey) {
      return res.status(503).json({
        success: false,
        message: 'Payment processing is not available. Please contact support.',
      })
    }
    
    const { sessionId, tokenPackage, email } = req.body

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      })
    }

    // Token packages (tokens, price in KES - Kenyan Shillings)
    // Paystack expects amount in kobo (smallest currency unit), so multiply by 100
    const packages = {
      small: { tokens: 50, price: 500 }, // 500 KES for 50 tokens
      medium: { tokens: 150, price: 1300 }, // 1,300 KES for 150 tokens
      large: { tokens: 500, price: 4000 }, // 4,000 KES for 500 tokens
    }

    const selectedPackage = packages[tokenPackage]
    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token package',
      })
    }

    const user = await getOrCreateUser(sessionId)
    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize user session',
      })
    }

    // Generate unique reference
    const reference = `TOKENS_${user._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Initialize Paystack payment
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || `user_${sessionId}@example.com`,
        amount: selectedPackage.price * 100, // Paystack expects amount in kobo (smallest currency unit)
        currency: 'KES', // Kenyan Shillings
        reference: reference,
        callback_url: `${req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173'}/tools?payment=success&reference=${reference}`,
        metadata: {
          userId: user._id.toString(),
          sessionId: sessionId,
          tokens: selectedPackage.tokens.toString(),
          package: tokenPackage,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.data.status) {
      // Store pending transaction
      await TokenTransaction.create({
        userId: user._id,
        type: 'purchase',
        amount: selectedPackage.tokens,
        stripePaymentIntentId: reference, // Reusing field for Paystack reference
        balanceAfter: user.tokens,
        status: 'pending',
        description: `Purchasing ${selectedPackage.tokens} tokens`,
      })

      res.status(200).json({
        success: true,
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: reference,
        },
      })
    } else {
      throw new Error('Failed to initialize payment')
    }
  } catch (error) {
    console.error('Error initializing payment:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to initialize payment',
    })
  }
}

// @desc    Handle Paystack webhook (for payment confirmation)
// @route   POST /api/tokens/webhook
// @access  Public (Paystack webhook)
export const handleWebhook = async (req, res) => {
  try {
    const crypto = (await import('crypto')).default
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return res.status(503).json({ error: 'Paystack not configured' })
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash !== req.headers['x-paystack-signature']) {
      console.error('Paystack webhook signature verification failed')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body

    // Handle successful payment
    if (event.event === 'charge.success' || event.event === 'charge.successful') {
      const transaction = event.data

      if (transaction.status === 'success') {
        const reference = transaction.reference

        // Find the pending transaction
        const tokenTransaction = await TokenTransaction.findOne({
          stripePaymentIntentId: reference, // Reusing field for Paystack reference
          status: 'pending',
        })

        if (tokenTransaction) {
          const user = await User.findById(tokenTransaction.userId)
          if (user) {
            // Get tokens from metadata or transaction
            const tokens = parseInt(transaction.metadata?.tokens || tokenTransaction.amount, 10)

            // Add tokens to user
            user.tokens += tokens
            user.totalTokensPurchased += tokens
            await user.save()

            // Update transaction status
            tokenTransaction.status = 'completed'
            tokenTransaction.balanceAfter = user.tokens
            tokenTransaction.stripeSessionId = transaction.id // Store Paystack transaction ID
            await tokenTransaction.save()

            console.log(`Added ${tokens} tokens to user ${user._id} via Paystack`)
          }
        }
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error handling Paystack webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

// @desc    Verify Paystack payment and add tokens (fallback if webhook fails)
// @route   POST /api/tokens/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const axios = (await import('axios')).default
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    
    if (!paystackSecretKey) {
      return res.status(503).json({
        success: false,
        message: 'Payment processing is not available.',
      })
    }
    
    const { reference, sessionId } = req.body

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required',
      })
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    if (response.data.status && response.data.data.status === 'success') {
      const transaction = response.data.data
      const userId = transaction.metadata?.userId || sessionId

      // Find user by sessionId if userId not in metadata
      let user
      if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
        // It's a MongoDB ObjectId
        user = await User.findById(userId)
      } else {
        // It's a sessionId
        user = await getOrCreateUser(sessionId)
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      const tokens = parseInt(transaction.metadata?.tokens || '0', 10)

      if (tokens > 0) {
        // Check if tokens were already added
        const existingTransaction = await TokenTransaction.findOne({
          stripePaymentIntentId: reference, // Reusing field for Paystack reference
          status: 'completed',
        })

        if (!existingTransaction) {
          // Add tokens to user
          user.tokens += tokens
          user.totalTokensPurchased += tokens
          await user.save()

          // Update or create transaction
          const pendingTransaction = await TokenTransaction.findOne({
            stripePaymentIntentId: reference,
            status: 'pending',
          })

          if (pendingTransaction) {
            pendingTransaction.status = 'completed'
            pendingTransaction.balanceAfter = user.tokens
            pendingTransaction.stripeSessionId = transaction.id
            await pendingTransaction.save()
          } else {
            await TokenTransaction.create({
              userId: user._id,
              type: 'purchase',
              amount: tokens,
              stripePaymentIntentId: reference,
              stripeSessionId: transaction.id,
              balanceAfter: user.tokens,
              status: 'completed',
              description: `Purchased ${tokens} tokens`,
            })
          }
        }

        const updatedUser = await User.findById(user._id)
        return res.status(200).json({
          success: true,
          message: 'Payment verified and tokens added',
          data: {
            tokens: updatedUser.tokens,
          },
        })
      }
    }

    res.status(400).json({
      success: false,
      message: 'Payment not completed or verification failed',
    })
  } catch (error) {
    console.error('Error verifying Paystack payment:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to verify payment',
    })
  }
}

