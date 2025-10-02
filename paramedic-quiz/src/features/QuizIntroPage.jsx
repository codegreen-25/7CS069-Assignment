import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getQuiz } from '../api/quiz'

export default function QuizIntroPage() {
  const { quizId } = useParams()
  const nav = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    setErr(null)
    getQuiz(Number(quizId))
      .then(setQuiz)
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false))
  }, [quizId])

  if (loading) return <div className="quiz-intro-loading">Loading…</div>
  if (err) return <div className="error-notice">Error: {err}</div>
  if (!quiz) return (
    <div className="quiz-intro-notfound">
      Quiz not found. <Link to="/">Back</Link>
    </div>
  )

  return (
    <div className="quiz-intro-page">
      <h1>{quiz.title ?? `Quiz #${quiz.id}`}</h1>
      <p><strong>Questions:</strong> {quiz.questions_count ?? '—'}</p>
      <button onClick={() => nav(`/quiz/${quizId}/run`)}>Start quiz</button>
      <div className="quiz-intro-links">
        <Link to="/account/flags">View flagged questions</Link>
        &nbsp;|&nbsp;
        <Link to="/account/scores">My scores</Link>
      </div>
    </div>
  )
}
