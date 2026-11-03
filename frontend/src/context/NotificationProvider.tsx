import { useState, type ReactNode } from 'react'
import type { Notification } from '../types/notification'
import { NotificationContext } from './notification-context'

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function addNotification(notification: Notification) {
    setNotifications((current) => [notification, ...current])
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
