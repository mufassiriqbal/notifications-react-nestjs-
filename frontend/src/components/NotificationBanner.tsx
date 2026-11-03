import { useEffect } from 'react'
import type { Notification } from '../types/notification'

interface NotificationBannerProps {
  notification: Notification
  onClose: (id: string) => void
}

function NotificationBanner({
  notification,
  onClose,
}: NotificationBannerProps) {
  useEffect(() => {
    if (notification.category !== 'INFO') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onClose(notification._id)
    }, 90_000)

    return () => window.clearTimeout(timeoutId)
  }, [notification._id, notification.category, onClose])

  const alertClass = {
    ERROR: 'alert-danger',
    WARNING: 'alert-warning',
    INFO: 'alert-info',
  }[notification.category]

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show`}
      role="alert"
    >
      <strong>{notification.header}</strong>
      <div>{notification.body}</div>
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={() => onClose(notification._id)}
      />
    </div>
  )
}

export default NotificationBanner
