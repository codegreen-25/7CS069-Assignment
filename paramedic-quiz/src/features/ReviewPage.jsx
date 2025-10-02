import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listFlags, flagQuestion, unflagQuestion } from '../api/flags'  // ✅ add

export default function ReviewPage() {
  const { quizId } = useParams()
  const { state } = useLocation()
  const data = state || { score: 0, total: 0, percentage: 0, review: [] }

  // ✅ flags state
  const [flaggedSet, setFlaggedSet] = useState(() => new Set())
  const [flagErr, setFlagErr] = useState(null)

  // ✅ load user’s flags once
  useEffect(() => {
    let mounted = true
    setFlagErr(null)
    listFlags()
      .then(items => {
        if (!mounted) return
        const s = new Set(items.map(i => i.questionId))
        setFlaggedSet(s)
      })
      .catch(e => setFlagErr(e?.response?.data?.message || e.message))
    return () => { mounted = false }
  }, [])

  // ✅ toggle handler
  const toggleFlag = async (questionId) => {
    try {
      if (flaggedSet.has(questionId)) {
        await unflagQuestion(questionId)
        const next = new Set(flaggedSet); next.delete(questionId)
        setFlaggedSet(next)
      } else {
        await flagQuestion(questionId)
        const next = new Set(flaggedSet); next.add(questionId)
        setFlaggedSet(next)
      }
    } catch (e) {
      setFlagErr(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="review-page">
      <h1>Results</h1>
      <p>
        <strong>Score:</strong> {data.score} / {data.total} ({data.percentage}%)
      </p>

      <div className="review-links">
        <Link to={`/quiz/${quizId}`}>Back to quiz intro</Link>
        &nbsp;|&nbsp;
        <Link to="/account/scores">My scores</Link>
        &nbsp;|&nbsp;
        <Link to="/account/flags">Flagged questions</Link>
      </div>

      {flagErr && <p className="error-notice">Flag error: {flagErr}</p>}

      <h2>Review</h2>
      <ol className="review-list">
        {data.review.map((r) => {
          const chosen = r.chosenAnswerText ?? '—'
          const correct = r.correctAnswerText ?? '—'
          const isCorrect =
            r.chosenAnswerText != null && r.chosenAnswerText === r.correctAnswerText
          const isFlagged = flaggedSet.has(r.questionId) // ✅

          return (
            <li key={r.questionId} className="review-item">
              {/* row header with flag toggle */}
              <div className="review-item-header">
                <div className="review-stem">{r.stem}</div>

                <button
                  type="button"
                  className="btn btn-flag"
                  aria-pressed={isFlagged}
                  onClick={() => toggleFlag(r.questionId)}
                  title={isFlagged ? 'Unflag question' : 'Flag question'}
                >
                  {isFlagged ? '★ Unflag' : '☆ Flag'}
                </button>
              </div>

              <div>
                <strong>Your answer:</strong> {chosen}
                {r.chosenAnswerText == null && ' (no answer)'}
                {r.chosenAnswerText != null && (
                  <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <div>
                <strong>Correct answer:</strong> {correct}
              </div>

              {r.explanation && (
                <div className="review-explanation">{r.explanation}</div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
