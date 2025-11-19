import mongoose from 'mongoose'

const showcaseSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['project', 'achievement', 'portfolio', 'case-study'],
      required: true,
    },
    images: [{
      type: String, // URLs to images
    }],
    link: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
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
        maxlength: [500, 'Comment cannot exceed 500 characters'],
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
showcaseSchema.index({ author: 1, createdAt: -1 })
showcaseSchema.index({ type: 1, isPublished: 1, createdAt: -1 })
showcaseSchema.index({ isFeatured: -1, createdAt: -1 })
showcaseSchema.index({ tags: 1 })

const Showcase = mongoose.model('Showcase', showcaseSchema)

export default Showcase

