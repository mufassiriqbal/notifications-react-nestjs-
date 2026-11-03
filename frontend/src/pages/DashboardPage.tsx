import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useNotifications } from '../context/useNotifications'
import NotificationBanner from '../components/NotificationBanner'
import notificationService from '../services/notificationService'
import type { Notification } from '../types/notification'

function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { notifications, setNotifications } = useNotifications()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  async function handleDelete(id: string) {
    setError('')
    setDeletingId(id)

    try {
      await notificationService.remove(id)
      setNotifications(
        notifications.filter((notification) => notification._id !== id),
      )
    } catch {
      setError('Unable to delete notification. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleClose = useCallback(
    async (id: string) => {
      setError('')

      try {
        const updatedNotification = await notificationService.update(id, {
          isClosed: true,
        })
        setNotifications((current) =>
          current.map((notification) =>
            notification._id === updatedNotification._id
              ? updatedNotification
              : notification,
          ),
        )
      } catch {
        setError('Unable to close notification. Please try again.')
      }
    },
    [setNotifications],
  )

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
      {!isLoading && (
        <div className="mb-4">
          {notifications
            .filter((notification) => !notification.isClosed)
            .sort((a, b) => b.date - a.date)
            .slice(0, 5)
            .map((notification) => (
              <NotificationBanner
                key={notification._id}
                notification={notification}
                onClose={handleClose}
              />
            ))}
          {notifications.filter((notification) => !notification.isClosed).length >
            5 && (
            <div className="alert alert-info" role="alert">
              You have more notifications
            </div>
          )}
        </div>
      )}
      {!isLoading && !error && notifications.length === 0 && (
        <p>No notifications found.</p>
      )}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="list-group text-start">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="list-group-item"
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <Link
                  to={`/notifications/${notification._id}`}
                  className="text-decoration-none text-reset flex-grow-1"
                >
                  <h2 className="h5 mb-1">{notification.header}</h2>
                  <p className="mb-0">{notification.body}</p>
                </Link>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${categoryBadgeClass(notification.category)}`}>
                    {notification.category}
                  </span>
                  <Link
                    to={`/notifications/${notification._id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => void handleDelete(notification._id)}
                    disabled={deletingId === notification._id}
                  >
                    {deletingId === notification._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default DashboardPage
