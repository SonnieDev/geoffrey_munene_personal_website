import mongoose from 'mongoose'

const tokenTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'usage', 'trial', 'refund', 'admin_grant'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // For purchases
    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },
    stripeSessionId: {
      type: String,
      sparse: true,
    },
    // For usage tracking
    toolUsed: {
      type: String,
      enum: ['resume', 'cover-letter', 'email', 'interview-prep', 'skills-assessment', 'salary-negotiation'],
      sparse: true,
    },
    // Description for admin grants or refunds
    description: {
      type: String,
    },
    // Balance after this transaction
    balanceAfter: {
      type: Number,
      required: true,
    },
    // Status for purchases
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
tokenTransactionSchema.index({ userId: 1, createdAt: -1 })
tokenTransactionSchema.index({ stripePaymentIntentId: 1 })
tokenTransactionSchema.index({ type: 1 })

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema)

export default TokenTransaction

