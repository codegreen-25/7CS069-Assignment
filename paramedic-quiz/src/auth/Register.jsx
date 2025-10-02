import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await register(name, email, password)
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
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label>
          Name<br/>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <br /><br />
        <label>
          Email<br/>
          <input value={email} onChange={e => setEmail(e.target.value)} required />
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
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      {err && <p className="register-error">{err}</p>}

      <p className="register-login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
