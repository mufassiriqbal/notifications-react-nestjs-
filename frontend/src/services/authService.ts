import api from '../api/axios'

export interface AuthUser {
  _id?: string
  userId?: string
  username: string
  fullName?: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/users/login', {
      username,
      password,
    })

    return response.data
  },

  async register(
    fullName: string,
    username: string,
    password: string,
  ): Promise<AuthUser> {
    const response = await api.post<AuthUser>('/users/register', {
      fullName,
      username,
      password,
    })

    return response.data
  },
}

export default authService
