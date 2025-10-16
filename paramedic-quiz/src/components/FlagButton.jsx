import { useEffect, useState } from 'react'
import { flagQuestion, unflagQuestion } from '../api/flags'


export default function FlagButton({
  questionId,
  initialFlagged = false,
  onChange,
  className = '',
}) {
  const [flagged, setFlagged] = useState(!!initialFlagged)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setFlagged(!!initialFlagged)
  }, [initialFlagged, questionId])

  const toggle = async () => {
    if (!questionId || loading) return
    setLoading(true)
    try {
      if (!flagged) await flagQuestion(questionId)
      else await unflagQuestion(questionId)
      const next = !flagged
      setFlagged(next)
      onChange && onChange(next)
    } catch (e) {
      console.error('flag toggle failed', e)
    } finally {
      setLoading(false)
    }
  }

  const label = flagged ? '★ Unflag' : '☆ Flag'

  return (
    <button
      type="button"
      className={`flag-btn ${flagged ? 'is-flagged' : ''} ${className}`}
      aria-pressed={flagged}
      onClick={toggle}
      disabled={!questionId || loading}
      title={flagged ? 'Unflag this question' : 'Flag this question'}
    >
      {label}
    </button>
  )
}
