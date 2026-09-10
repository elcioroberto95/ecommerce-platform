'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '@/lib/api-client'
import { User, AuthContextType, LoginResponse } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  // Backend contract: POST /auth/login -> { accessToken, user }
  const authenticate = async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password })
    const { accessToken, user: userData } = response.data

    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))

    setToken(accessToken)
    setUser(userData)
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await authenticate(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  // Backend has no /auth/register: create the user via POST /users, then log in.
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      await apiClient.post('/users', { name, email, password })
      await authenticate(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
