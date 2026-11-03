export const Category = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const

export type Category = (typeof Category)[keyof typeof Category]

export interface Notification {
  _id: string
  header: string
  body: string
  category: Category
  isClosed: boolean
  userId: string
  date: number
  createdAt: string
  updatedAt: string
}
