import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCaseStudies } from '../api/quiz'
import { useAuth } from '../auth/AuthContext'


export default function CatalogPage(){
  const { user } = useAuth()      
  const [caseStudies, setCaseStudies] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(()=>{
    getCaseStudies()
      .then(setItems)
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(()=>setLoading(false))
  },[])

  if (loading) return <p>Loading…</p>
  if (err) return <p className="error-notice">{err}</p>

  return (
    <div className="container">
      <img src="/logo.png" alt="Code Green Quiz logo" className="home-logo" />
            {user && (
        <section className="home-greeting card">
          <h2>
            Hello, {user.name}! <span role="img" aria-label="ambulance">🚑</span>
          </h2>
          <p>
            Ready to sharpen those life-saving skills?  
            Every quiz you complete helps you respond faster and with more confidence.
          </p>
        </section>
      )}
      <h1>Case Studies</h1>
      {!items.length && <p>No case studies yet.</p>}
      {items.map(cs => (
        <div className="home-cs-container" key={cs.id} >
          <h2 className="home-cs-title">{cs.title}</h2>
          <p className="home-cs-description">{cs.description}</p>

        {(cs.quizzes || []).length ? (
          <ul className="home-quizzes-list">
            {cs.quizzes.map((q) => {
              const label = q.title?.trim() || 'Untitled Quiz'

              return (
                <li key={q.id}>
                  <Link
                    className="open-qz-btn"
                    to={`/quiz/${q.id}`}
                    data-discover="true"
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No quizzes in this case study.</p>
        )}


        </div>
      ))}
    </div>
  )
}
