import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // When the app opens, check if a saved token still works
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  // Save the token and user after login or register
  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    return saveSession(res.data)
  }

  const register = async (formData) => {
    const res = await api.post('/register', formData)
    return saveSession(res.data)
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}