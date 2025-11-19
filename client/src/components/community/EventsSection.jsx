import { useState, useEffect } from 'react'
import { communityAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { HiCalendar, HiClock, HiMapPin, HiLink, HiUserGroup, HiPlus } from 'react-icons/hi2'
import SkeletonLoader from '../SkeletonLoader'
import toast from 'react-hot-toast'
import '../../styles/components/events-section.css'

function EventsSection() {
  const { isAuthenticated, user } = useUser()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'webinar',
    startDate: '',
    endDate: '',
    location: 'Online',
    link: '',
    maxAttendees: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getEvents({ upcoming: true })
      setEvents(response.data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to create an event')
      return
    }

    if (!newEvent.title || !newEvent.description || !newEvent.startDate || !newEvent.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      await communityAPI.createEvent({
        ...newEvent,
        maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
      })

      toast.success('Event created successfully!')
      setNewEvent({
        title: '',
        description: '',
        type: 'webinar',
        startDate: '',
        endDate: '',
        location: 'Online',
        link: '',
        maxAttendees: '',
      })
      setShowCreateEvent(false)
      fetchEvents()
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events')
      return
    }

    try {
      await communityAPI.registerForEvent(eventId)
      toast.success('Successfully registered for event!')
      fetchEvents()
    } catch (error) {
      console.error('Error registering for event:', error)
      toast.error(error.response?.data?.message || 'Failed to register for event')
    }
  }

  const isRegistered = (event) => {
    if (!isAuthenticated || !event.attendees || !user) return false
    return event.attendees.some((attendee) => {
      const userId = typeof attendee.user === 'string' ? attendee.user : attendee.user?._id
      return userId === user.id
    })
  }

  const getEventTypeLabel = (type) => {
    const labels = {
      webinar: 'Webinar',
      meetup: 'Meetup',
      workshop: 'Workshop',
      training: 'Training',
      'live-session': 'Live Session',
    }
    return labels[type] || type
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="events-section">
      <div className="events-header">
        <div>
          <h2>Upcoming Events</h2>
          <p>Join webinars, workshops, and community meetups</p>
        </div>
        {isAuthenticated && (
          <button
            className="create-event-btn"
            onClick={() => setShowCreateEvent(!showCreateEvent)}
          >
            <HiPlus />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {showCreateEvent && (
        <form className="create-event-form" onSubmit={handleCreateEvent}>
          <div className="form-row">
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
                required
              />
            </div>
            <div className="form-group">
              <label>Event Type *</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                required
              >
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="workshop">Workshop</option>
                <option value="training">Training</option>
                <option value="live-session">Live Session</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description"
              rows="4"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date & Time *</label>
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Online or physical location"
              />
            </div>
            <div className="form-group">
              <label>Event Link</label>
              <input
                type="url"
                value={newEvent.link}
                onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="form-group">
            <label>Max Attendees (leave empty for unlimited)</label>
            <input
              type="number"
              value={newEvent.maxAttendees}
              onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
              placeholder="Unlimited"
              min="1"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowCreateEvent(false)
                setNewEvent({
                  title: '',
                  description: '',
                  type: 'webinar',
                  startDate: '',
                  endDate: '',
                  location: 'Online',
                  link: '',
                  maxAttendees: '',
                })
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      )}

      <div className="events-grid">
        {loading ? (
          <SkeletonLoader type="blog-card" count={3} />
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming events. Check back soon or create one!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <span className="event-type-badge">{getEventTypeLabel(event.type)}</span>
                <h3 className="event-title">{event.title}</h3>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <div className="event-detail">
                  <HiCalendar />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="event-detail">
                  <HiMapPin />
                  <span>{event.location}</span>
                </div>
                {event.link && (
                  <div className="event-detail">
                    <HiLink />
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      Event Link
                    </a>
                  </div>
                )}
                <div className="event-detail">
                  <HiUserGroup />
                  <span>
                    {event.attendees?.length || 0}
                    {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
                  </span>
                </div>
              </div>
              {isAuthenticated && (
                <button
                  className={`register-btn ${isRegistered(event) ? 'registered' : ''}`}
                  onClick={() => handleRegister(event._id)}
                  disabled={isRegistered(event) || (event.maxAttendees && event.attendees?.length >= event.maxAttendees)}
                >
                  {isRegistered(event) ? 'Registered ✓' : 'Register'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EventsSection

