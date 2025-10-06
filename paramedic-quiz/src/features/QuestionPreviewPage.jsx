import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getQuestion, checkQuestion } from '../api/questions'
import { flagQuestion, unflagQuestion } from '../api/flags'

export default function QuestionPreviewPage(){
  const { questionId } = useParams()
  const nav = useNavigate()
  const [q, setQ] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null) // { correct, correctAnswerText, chosenAnswerText, explanation }
  const [flagged, setFlagged] = useState(false)

  useEffect(() => {
    setErr(null); setLoading(true)
    getQuestion(Number(questionId))
      .then(data => { setQ(data) })
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false))
  }, [questionId])

  const onCheck = async () => {
    if (!selected) return
    try {
      const res = await checkQuestion(Number(questionId), selected)
      setResult(res)
    } catch (e) {
      console.error(e)
    }
  }

  const toggleFlag = async () => {
    try {
      if (!flagged) { await flagQuestion(Number(questionId)); setFlagged(true) }
      else { await unflagQuestion(Number(questionId)); setFlagged(false) }
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className="quiz-intro-loading">Loading…</div>
  if (err) return <div className="quiz-intro-error">Error: {err}</div>
  if (!q) return <div className="quiz-intro-notfound">Question not found. <Link to="/">Back</Link></div>

  return (
    <div className="container">
      <div className="quiz-run-toolbar">
        <button onClick={() => nav('/account/flags')} className="back-btn">← Back</button>
        <button className="flag-btn" onClick={toggleFlag} aria-pressed={flagged}>
          {flagged ? '★ Unflag' : '☆ Flag'}
        </button>
        <div className="quiz-info">
          <strong>{q.quiz?.caseStudy?.title}</strong> › {q.quiz?.title}
        </div>
      </div>

      <h2 className="quiz-run-question-title">Question preview</h2>
          {/* Render HTML from DB so <br>, <strong> etc is rendered */}
        <div
          className="preview-stem"
          dangerouslySetInnerHTML={{ __html: q.stem || '' }}
        />

      <ul className="quiz-run-answers">
        {q.answers.map(a => (
          <li key={a.id}
              className={`quiz-run-answer ${selected===a.id ? 'answer--selected' : ''}`}
              onClick={() => { setSelected(a.id); setResult(null) }}>
            <label className="answer-label">{a.text}</label>
          </li>
        ))}
      </ul>

      {result && (
        <div className="preview-result">
          <span className={`answer-badge ${result.correct ? 'correct' : 'wrong'}`}>
            {result.correct ? 'Correct' : 'Incorrect'}
          </span>
          {!result.correct && (
            <div className="correct-line">
              <strong>Correct answer:</strong> {result.correctAnswerText}
            </div>
          )}
          {result.explanation && (
            <div className="review-explanation">{result.explanation}</div>
          )}
        </div>
      )}

      <div className="quiz-run-nav">
        <button disabled={!selected} onClick={onCheck}>Check answer</button>
        <button onClick={()=>nav(`/quiz/${q.quiz.id}`)}>Open full quiz</button>
      </div>

      <p className="error-notice" style={{opacity:.7, marginTop:8}}>
        Preview mode doesn’t create an attempt or affect your scores.
      </p>
    </div>
  )
}
