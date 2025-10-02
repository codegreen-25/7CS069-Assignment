import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}
