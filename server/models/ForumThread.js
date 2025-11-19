import mongoose from 'mongoose'

const forumThreadSchema = new mongoose.Schema(
  {
    forum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    views: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [5000, 'Reply cannot exceed 5000 characters'],
      },
      isSolution: {
        type: Boolean,
        default: false,
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    lastReplyAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
forumThreadSchema.index({ forum: 1, createdAt: -1 })
forumThreadSchema.index({ author: 1, createdAt: -1 })
forumThreadSchema.index({ isPinned: -1, lastReplyAt: -1 })
forumThreadSchema.index({ tags: 1 })

// Update forum's lastActivity when thread is created or updated
forumThreadSchema.post('save', async function () {
  const Forum = mongoose.model('Forum')
  await Forum.findByIdAndUpdate(this.forum, { lastActivity: new Date() })
})

const ForumThread = mongoose.model('ForumThread', forumThreadSchema)

export default ForumThread

