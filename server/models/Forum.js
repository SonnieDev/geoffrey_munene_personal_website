import mongoose from 'mongoose'

const forumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Forum name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'business-growth',
        'remote-work',
        'productivity',
        'content-strategy',
        'networking',
        'tools-resources',
        'general',
      ],
    },
    icon: {
      type: String,
      default: '💬',
    },
    threadCount: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for better query performance
forumSchema.index({ category: 1, isActive: 1 })
forumSchema.index({ lastActivity: -1 })

const Forum = mongoose.model('Forum', forumSchema)

export default Forum

