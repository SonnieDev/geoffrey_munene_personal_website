import mongoose from 'mongoose'

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      enum: ['update', 'insight', 'win', 'challenge', 'question', 'general'],
      default: 'general',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    images: [{
      type: String, // URLs to images
    }],
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
communityPostSchema.index({ author: 1, createdAt: -1 })
communityPostSchema.index({ type: 1, createdAt: -1 })
communityPostSchema.index({ tags: 1 })
communityPostSchema.index({ isPinned: -1, createdAt: -1 })

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema)

export default CommunityPost

