import axios, { AxiosError, AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

const AUTH_TOKEN_KEY = 'auth_token'
const USER_KEY = 'user'
const LOGIN_PATH = '/auth/login'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle expired sessions.
// Only redirect when a token existed (session expired), never for anonymous
// requests, and never while already on the login page. Otherwise an
// unauthenticated 401 on /auth/login triggers a reload loop.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const hadToken = localStorage.getItem(AUTH_TOKEN_KEY) !== null
      const onAuthPage = window.location.pathname.startsWith('/auth')

      if (hadToken) {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }

      if (hadToken && !onAuthPage) {
        const redirect = encodeURIComponent(window.location.pathname)
        window.location.href = `${LOGIN_PATH}?redirect=${redirect}`
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
