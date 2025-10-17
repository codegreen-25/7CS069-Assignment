import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import BackButton from '../components/BackButton'

export default function ProfilePage() {
  const { user, updateName, loading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  // seed local name when user loads or changes
  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user])

  if (loading) return <div className="container">Loading…</div>
  if (!user) return <div className="container">Please sign in.</div>

  const onEdit = () => { setMsg(null); setErr(null); setEditing(true) }
  const onCancel = () => { setEditing(false); setName(user.name); setErr(null); setMsg(null) }

  const onSave = async (e) => {
    e?.preventDefault?.()
    const trimmed = name.trim()
    if (!trimmed || trimmed === user.name) { setEditing(false); return }
    setSaving(true); setErr(null); setMsg(null)
    try {
      await updateName(trimmed)
      setMsg('Name updated successfully.')
      setEditing(false)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not update name.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
    <BackButton />
      <h1>Profile</h1>

      <div className="profile-inline-row">
        <label className="profile-label">Display name: </label>

        {!editing ? (
          <>
            <span className="profile-name">{user.name}</span>
            <button className="btn profile-btn" onClick={onEdit} aria-label="Edit display name">Edit</button>
          </>
        ) : (
          <>
            <input
              className="input"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              disabled={saving}
              required
              autoFocus
            />
              <button className="btn profile-btn" onClick={onSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn btn-secondary profile-btn" onClick={onCancel} disabled={saving}>
                Cancel
              </button>
              </>
        )}
      </div>

      {msg && <p className="success-notice">{msg}</p>}
      {err && <p className="error-notice">{err}</p>}
    </div>
  )
}
