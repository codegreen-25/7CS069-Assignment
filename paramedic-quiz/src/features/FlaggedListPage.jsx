import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listFlags, unflagQuestion } from '../api/flags'

export default function FlaggedListPage() {
  const nav = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listFlags().then(setItems).finally(() => setLoading(false))
  }, [])

  const open = (q) => {
    nav(`/question/${q.questionId}`)
  }

  const unflag = async (q) => {
    await unflagQuestion(q.questionId)
    setItems(items.filter(i => i.questionId !== q.questionId))
  }

  return (
    <div className="flagged-page container">
      <h1>Flagged questions</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>No flags yet.</p>}

      <ul className="flagged-list">
        {items.map(q => (
          <li key={q.flagId} className="flagged-item">
            <div className="flagged-item-title">
              {q.caseStudy.title} › {q.quiz.title}
            </div>
            <div className="flagged-item-stem">{q.stem}</div>
            <div className="flagged-item-actions">
              <button onClick={() => open(q)}>Open</button>
              <button className="btn btn-danger" onClick={()=>unflag(q)}>Remove flag</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
