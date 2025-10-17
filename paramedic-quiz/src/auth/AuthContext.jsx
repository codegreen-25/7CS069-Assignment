import { createContext, useContext, useEffect, useState } from 'react'
import { me as apiMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth'
import { setAuthToken } from '../api/http'
import { updateProfileName } from '../api/account'

const AuthCtx = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)      
    apiMe().then(setUser).catch(()=>{})  
          .finally(()=>setLoading(false))
  }, [])

  const login = async (email, password) => { const u = await apiLogin(email, password); setUser(u) }
  const register = async (name, email, password) => { const u = await apiRegister(name, email, password); setUser(u) }
  const logout = async () => { await apiLogout(); setUser(null) }
  const updateName = async (name) => {
  const { user: updated } = await updateProfileName(name)
  setUser(updated)   
    return updated
  }

  return <AuthCtx.Provider value={{ user, loading, login, register, logout, updateName }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)
