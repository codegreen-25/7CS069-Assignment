import { createContext, useContext, useEffect, useState } from 'react'
import { me as apiMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth'
import { setAuthToken } from '../api/http'

const AuthCtx = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)        // ← set header first
    apiMe().then(setUser).catch(()=>{})   // then try /api/user
          .finally(()=>setLoading(false))
  }, [])

  const login = async (email, password) => { const u = await apiLogin(email, password); setUser(u) }
  const register = async (name, email, password) => { const u = await apiRegister(name, email, password); setUser(u) }
  const logout = async () => { await apiLogout(); setUser(null) }

  return <AuthCtx.Provider value={{ user, loading, login, register, logout }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)
