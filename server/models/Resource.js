import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['tip', 'template', 'tool', 'guide', 'article', 'video'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'business-growth',
        'remote-work',
        'productivity',
        'content-strategy',
        'networking',
        'tools-resources',
        'general',
      ],
      required: true,
    },
    url: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String, // For downloadable resources
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    views: {
      type: Number,
      default: 0,
    },
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
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
resourceSchema.index({ category: 1, type: 1, isPublished: 1 })
resourceSchema.index({ author: 1, createdAt: -1 })
resourceSchema.index({ isFeatured: -1, createdAt: -1 })
resourceSchema.index({ tags: 1 })

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource

