import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['webinar', 'meetup', 'workshop', 'training', 'live-session'],
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      default: 'Online',
    },
    link: {
      type: String,
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
    }],
    maxAttendees: {
      type: Number,
      default: null, // null means unlimited
    },
    image: {
      type: String, // URL to event image
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
eventSchema.index({ startDate: 1, isPublished: 1 })
eventSchema.index({ type: 1, startDate: 1 })
eventSchema.index({ organizer: 1 })

const Event = mongoose.model('Event', eventSchema)

export default Event

