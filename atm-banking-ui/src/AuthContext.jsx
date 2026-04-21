import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('atm_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (userData, token) => {
    localStorage.setItem('atm_token', token)
    localStorage.setItem('atm_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('atm_token')
    localStorage.removeItem('atm_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
