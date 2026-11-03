import api from '../api/axios'
import type { Category, Notification } from '../types/notification'

export interface NotificationData {
  header: string
  body: string
  category?: Category
  isClosed?: boolean
  date?: number
}

const notificationService = {
  async getAll(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications')

    return response.data
  },

  async getOne(id: string): Promise<Notification> {
    const response = await api.get<Notification>(`/notifications/${id}`)

    return response.data
  },

  async create(data: NotificationData): Promise<Notification> {
    const response = await api.post<Notification>('/notifications', data)

    return response.data
  },

  async update(id: string, data: Partial<NotificationData>): Promise<Notification> {
    const response = await api.put<Notification>(`/notifications/${id}`, data)

    return response.data
  },

  async remove(id: string): Promise<Notification> {
    const response = await api.delete<Notification>(`/notifications/${id}`)

    return response.data
  },
}

export default notificationService
