import { createContext } from 'react'

export interface AuthUser {
  _id?: string
  userId?: string
  username: string
  fullName?: string
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
