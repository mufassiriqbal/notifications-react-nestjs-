import { createContext } from 'react'
import type { Notification } from '../types/notification'

interface NotificationContextValue {
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined)
