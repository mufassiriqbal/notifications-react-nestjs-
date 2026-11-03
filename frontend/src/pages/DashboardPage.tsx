import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useNotifications } from '../context/useNotifications'
import notificationService from '../services/notificationService'
import type { Notification } from '../types/notification'

function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { notifications, setNotifications } = useNotifications()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadNotifications() {
      try {
        setError('')
        const data = await notificationService.getAll()
        setNotifications(data)
      } catch {
        setError('Unable to load notifications. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadNotifications()
  }, [setNotifications])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function categoryBadgeClass(category: Notification['category']) {
    if (category === 'ERROR') {
      return 'text-bg-danger'
    }

    if (category === 'WARNING') {
      return 'text-bg-warning'
    }

    return 'text-bg-info'
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Notifications</h1>
        <div className="d-flex gap-2">
          <Link to="/notifications/new" className="btn btn-primary">
            New notification
          </Link>
          <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {isLoading && <p>Loading notifications...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && notifications.length === 0 && (
        <p>No notifications found.</p>
      )}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="list-group text-start">
          {notifications.map((notification) => (
            <Link
              key={notification._id}
              to={`/notifications/${notification._id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h2 className="h5 mb-1">{notification.header}</h2>
                  <p className="mb-0">{notification.body}</p>
                </div>
                <span className={`badge ${categoryBadgeClass(notification.category)}`}>
                  {notification.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export default DashboardPage
