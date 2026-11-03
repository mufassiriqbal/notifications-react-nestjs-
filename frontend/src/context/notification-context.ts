import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { Notification } from '../types/notification'

interface NotificationContextValue {
  notifications: Notification[]
  setNotifications: Dispatch<SetStateAction<Notification[]>>
  addNotification: (notification: Notification) => void
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined)
