import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // Session-based identifier (stored in localStorage)
    sessionId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    // Optional: Email for registered users
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    // Token balance
    tokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Track if user has received trial tokens
    trialTokensGiven: {
      type: Boolean,
      default: false,
    },
    // Track total tokens ever purchased
    totalTokensPurchased: {
      type: Number,
      default: 0,
    },
    // Track total tokens used
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
    // Last activity timestamp
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster lookups
userSchema.index({ sessionId: 1 })
userSchema.index({ email: 1 })

// Update last activity before saving
userSchema.pre('save', function (next) {
  this.lastActivity = new Date()
  next()
})

const User = mongoose.model('User', userSchema)

export default User

