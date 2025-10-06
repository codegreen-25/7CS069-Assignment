import { useEffect, useState } from 'react'
import { myAttempts } from '../api/attempts'

export default function MyScoresPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    myAttempts().then(setItems).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <h1>My scores</h1>

      {loading && <p>Loading…</p>}

      <ul className="my-scores-list">
        {items.map(a => (
          <li key={a.id}>
            {a.quiz?.title ?? 'Quiz'} — {a.score}/{a.total} ({a.percentage}%)
          </li>
        ))}
      </ul>

      {!loading && !items.length && <p>No attempts yet.</p>}
    </div>
  )
}
