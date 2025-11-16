import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { HiTrash, HiCheckCircle, HiXCircle } from 'react-icons/hi2'
import '../../styles/pages/admin-contacts.css'

function AdminContacts() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    fetchContacts()
  }, [isAuthenticated, navigate])

  const fetchContacts = async () => {
    try {
      const response = await adminAPI.getAllContacts()
      if (response.success) {
        setContacts(response.data || [])
      }
    } catch (error) {
      setError('Failed to fetch contacts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await adminAPI.updateContactStatus(id, status)
      if (response.success) {
        setContacts(contacts.map((contact) =>
          contact._id === id ? { ...contact, status } : contact
        ))
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status })
        }
      }
    } catch (error) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return
    }

    try {
      const response = await adminAPI.deleteContact(id)
      if (response.success) {
        setContacts(contacts.filter((contact) => contact._id !== id))
        if (selectedContact?._id === id) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      alert('Failed to delete contact')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading contacts...</div>
  }

  return (
    <div className="admin-contacts">
      <div className="admin-page-header">
        <h1>Contact Messages</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-contacts-layout">
        <div className="admin-contacts-list">
          {contacts.length === 0 ? (
            <div className="admin-empty">No contact messages found.</div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                className={`admin-contact-item ${selectedContact?._id === contact._id ? 'active' : ''} ${contact.status === 'new' ? 'unread' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-item-header">
                  <h3>{contact.name}</h3>
                  <span className={`admin-badge status-${contact.status}`}>
                    {contact.status}
                  </span>
                </div>
                <p className="contact-item-email">{contact.email}</p>
                <p className="contact-item-subject">{contact.subject}</p>
                <p className="contact-item-date">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {selectedContact && (
          <div className="admin-contact-detail">
            <div className="contact-detail-header">
              <h2>{selectedContact.name}</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="admin-close-btn"
              >
                ×
              </button>
            </div>

            <div className="contact-detail-info">
              <div className="contact-info-item">
                <strong>Email:</strong>
                <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
              </div>
              <div className="contact-info-item">
                <strong>Subject:</strong>
                <span>{selectedContact.subject}</span>
              </div>
              <div className="contact-info-item">
                <strong>Date:</strong>
                <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
              </div>
              <div className="contact-info-item">
                <strong>Status:</strong>
                <span className={`admin-badge status-${selectedContact.status}`}>
                  {selectedContact.status}
                </span>
              </div>
            </div>

            <div className="contact-detail-message">
              <strong>Message:</strong>
              <p>{selectedContact.message}</p>
            </div>

            <div className="contact-detail-actions">
              <div className="status-actions">
                <button
                  onClick={() => handleStatusUpdate(selectedContact._id, 'read')}
                  className={`admin-status-btn ${selectedContact.status === 'read' ? 'active' : ''}`}
                >
                  <HiCheckCircle /> Mark as Read
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedContact._id, 'replied')}
                  className={`admin-status-btn ${selectedContact.status === 'replied' ? 'active' : ''}`}
                >
                  <HiCheckCircle /> Mark as Replied
                </button>
              </div>
              <button
                onClick={() => handleDelete(selectedContact._id)}
                className="admin-delete-btn"
              >
                <HiTrash /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContacts

