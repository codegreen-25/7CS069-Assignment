import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await login(email, password)
      nav('/', { replace: true })
    } catch (e) {
      const msg = e?.response?.data?.message
        || (e?.response?.data?.errors && JSON.stringify(e.response.data.errors))
        || e.message
      setErr(msg || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label>
          Email<br/>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <label>
          Password<br/>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <button disabled={loading} type="submit">
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      {err && <p className="login-error">{err}</p>}

      <p className="login-register-link">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
