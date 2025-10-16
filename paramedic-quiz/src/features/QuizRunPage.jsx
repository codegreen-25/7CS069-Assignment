import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { getQuiz, getQuestionByIndex } from '../api/quiz'
import { createAttempt, saveAnswer, submitAttempt } from '../api/attempts'
import FlagButton from '../components/FlagButton'

export default function QuizRunPage(){
  const { quizId } = useParams()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const jumpTo = Number(sp.get('jumpTo')) || 0

  // quiz meta
  const [total, setTotal] = useState(null) // number of questions
  const [title, setTitle] = useState('')

  // attempt + nav state
  const [attemptId, setAttemptId] = useState(null)
  const [index, setIndex] = useState(jumpTo) // 0-based index
  const [err, setErr] = useState(null)

  // current question
  const [question, setQuestion] = useState(null) // { id, stem, answers[], flagged? }
  const [loading, setLoading] = useState(true)

  // answers cache: questionId -> chosenAnswerId
  const answersByQuestionIdRef = useRef({})   // useRef to persist across re-renders without replacing object
  const [chosen, setChosen] = useState(null)  // radio selection for current question

  const questionsCacheRef = useRef(new Map()) // key: index, value: question json
  const [isFetching, setIsFetching] = useState(false) // small background fetch flag
  const [firstQuestionLoading, setFirstQuestionLoading] = useState(true)



  const [flagged, setFlagged] = useState(false)
  const [navError, setNavError] = useState(null)


// 1) Load quiz meta only (title + questions_count). No attempt creation here.
useEffect(() => {
  let mounted = true
  setErr(null)
  ;(async () => {
    try {
      setLoading(true)
      const qz = await getQuiz(Number(quizId))   // must return questions_count
      if (!mounted) return
      setTitle(qz.title || '')
      setTotal(qz.questions_count ?? 0)
    } catch (e) {
      console.error('quiz meta error', e)
      setErr(e?.response?.data?.message || e.message)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  })()
  return () => { mounted = false }
}, [quizId])


  // 2) Fetch the current question when index changes (or after attempt ready)
useEffect(() => {
  if (total === null) return

  let mounted = true
  const cached = questionsCacheRef.current?.get
    ? questionsCacheRef.current.get(index)
    : undefined

  // If we have a cached question, show it immediately and mark first load done
  if (cached) {
    setQuestion(cached)
    setFlagged(!!cached.flagged)
    const cachedChoice = answersByQuestionIdRef.current[cached.id]
    const initial = (cachedChoice != null)
      ? cachedChoice
      : (cached.previouslyChosenAnswerId ?? null)
    setChosen(initial ?? null)
    setFirstQuestionLoading(false)    
  } else {
    setFirstQuestionLoading(true)       
  }

  // Fetch (silent—no global Loading…)
  setIsFetching(true)
  getQuestionByIndex(Number(quizId), index, attemptId || undefined)
    .then(q => {
      if (!mounted) return
      questionsCacheRef.current.set(index, q)
      setQuestion(q)
      setFlagged(!!q.flagged)
      const cachedChoice2 = answersByQuestionIdRef.current[q.id]
      const initial2 = (cachedChoice2 != null)
        ? cachedChoice2
        : (q.previouslyChosenAnswerId ?? null)
      setChosen(initial2 ?? null)
    })
    .catch(e => {
      console.error('load question failed', e)
      if (!cached) setQuestion(null)
    })
    .finally(() => {
      if (!mounted) return
      setIsFetching(false)
      setFirstQuestionLoading(false)    
    })

  return () => { mounted = false }
}, [quizId, index, total])  


    useEffect(() => {
      if (total == null) return
      const next = index + 1
      if (next >= total) return
      if (questionsCacheRef.current.has(next)) return

      getQuestionByIndex(Number(quizId), next, attemptId || undefined)
        .then(q => { questionsCacheRef.current.set(next, q) })
        .catch(() => {}) // silently ignore errors
    }, [index, total, quizId, attemptId])




  // 3) Choose an answer: update UI + local cache + autosave to API
    const onChoose = async (answerId) => {
      setNavError(null)  
      setChosen(answerId)
      if (question) {
        answersByQuestionIdRef.current[question.id] = answerId
      }
      try {
        let aId = attemptId
        if (!aId) {
          const r = await createAttempt(Number(quizId)) // returns { attemptId }
          aId = r.attemptId
          setAttemptId(aId)
        }
        await saveAnswer(aId, question.id, answerId)
      } catch (e) {
        console.error('saveAnswer failed', 
          e?.response?.status,
          e?.response?.data || e.message)
      }
    }


  // 4) Navigation
  const onBack = () => { setNavError(null); setIndex(i => Math.max(0, i - 1)) }
  const onNext = () => {
  if (chosen == null) {                 // ✅ block if nothing chosen
    setNavError('Please select an answer to continue.')
    return
  }
  setNavError(null)
  setIndex(i => Math.min((total ?? 1) - 1, i + 1))
}


  // 5) Submit on the LAST question only
const onSubmit = async () => {
  if (chosen == null) {                 // ✅ block if last is unanswered
    setNavError('Please select an answer before submitting.')
    return
  }
  try {
    let aId = attemptId
    if (!aId) {
      const r = await createAttempt(Number(quizId))
      aId = r.attemptId
      setAttemptId(aId)
    }
    const res = await submitAttempt(aId)
    nav(`/quiz/${quizId}/review/${aId}`, { state: res })
  } catch (e) {
     console.error('submit failed',
      e?.response?.status,
      e?.response?.data || e.message
     )
  }
}

  // Derived booleans
  const isFirst = index === 0
  const isLast  = (total != null) ? index === total - 1 : false



  if (err) return (
  <div className="error-notice">
    <div className="container"><p className="error-notice">Error: {err}</p>
    <p><Link to="/">Back to catalog</Link></p></div>
  </div>
  )
 if (loading || total === null || firstQuestionLoading) {
  return <div className="container">Loading…</div>
}if (total === 0) {
  return <div className="container">This quiz has no questions.<Link to="/">Back</Link></div>
}
if (!question) {
  return <div className="container">No question.<Link to={`/quiz/${quizId}`}>Back</Link></div>
}



return (
  <div className="container">
    <div className="quiz-run-toolbar">
      <button className="btn btn-outline exit-btn" onClick={()=>nav(`/quiz/${quizId}`)}>← Exit</button>
      <FlagButton questionId={question?.id}  initialFlagged={flagged}  onChange={setFlagged}/>
      <div className="quiz-info">
        {title ? <strong>{title}</strong> : null} &nbsp; Q{index + 1}/{total}
      </div>
    </div>

    <h2 className="quiz-run-question-title">Question {index + 1}</h2>
    {/* Render HTML from DB so <br>, <strong> etc is rendered */}
    <div
      className="quiz-run-stem"
      dangerouslySetInnerHTML={{ __html: question.stem || '' }}
    />

    <ul className="quiz-run-answers">
      {question.answers.map((a) => (
        <li
          key={a.id}
          className={`quiz-run-answer ${chosen === a.id ? 'answer--selected' : ''}`}
          onClick={() => onChoose(a.id)}      
          role="radio"
          aria-checked={chosen === a.id}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChoose(a.id) }}
        >
          <label className="answer-label">{a.text}</label>

          <input
            type="radio"
            name="opt"
            checked={chosen === a.id}
            onChange={() => onChoose(a.id)}
            className="sr-only"   // visually hidden, see CSS
          />
        </li>
      ))}
    </ul>



    {navError && <p className="quiz-run-error">{navError}</p>}

    <div className="quiz-run-nav">
      {!isFirst && <button className="btn btn-outline" onClick={onBack}>Back</button>}
      {!isLast  && <button className="btn btn-outline" onClick={onNext}>Next</button>}
      {isLast   && <button className="btn btn-primary" onClick={onSubmit}>Submit Quiz</button>}
    </div>
  </div>
)

}
