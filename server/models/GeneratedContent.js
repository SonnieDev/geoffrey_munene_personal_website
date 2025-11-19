import mongoose from 'mongoose'

const generatedContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toolType: {
      type: String,
      required: true,
      enum: ['resume', 'cover-letter', 'email', 'interview-prep', 'skills-assessment', 'salary-negotiation'],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      // Store the input data used to generate the content (e.g., job title, company name, etc.)
    },
    tokensUsed: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
generatedContentSchema.index({ userId: 1, createdAt: -1 })

const GeneratedContent = mongoose.model('GeneratedContent', generatedContentSchema)

export default GeneratedContent

