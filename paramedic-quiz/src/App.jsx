import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/AuthContext'
import Protected from './auth/Protected'

import Login from './auth/Login'
import Register from './auth/Register'
import CatalogPage from './features/CatalogPage'
import QuizIntroPage from './features/QuizIntroPage'
import QuizRunPage from './features/QuizRunPage'
import ReviewPage from './features/ReviewPage'
import MyScoresPage from './features/MyScoresPage'     
import FlaggedListPage from './features/FlaggedListPage'
import QuestionPreviewPage from './features/QuestionPreviewPage'
import ProfilePage from './features/ProfilePage'
import './App.css'

function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

    // Close menu when clicking/tapping outside
 useEffect(() => {
    const handleOutside = (e) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    // pointerdown works for both mouse + touch
    document.addEventListener('pointerdown', handleOutside, { passive: true })
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [])

  const handleLinkClick = () => setOpen(false)

  return (
    <header className="app-header">
      <div className="app-header-inner" ref={menuRef}>
        {/* Brand / Logo */}
        <div className="brand">
          <Link to="/"><img src="/logo-trimmed.png" alt="Code Green Quiz logo" className="brand-logo" /></Link>
        </div>

        {/* Desktop links */}
        <nav className={`primary-nav ${open ? 'is-open' : ''}`}>
          <NavLink to="/" onClick={handleLinkClick}>Home</NavLink>
          {user && <NavLink to="/account/flags" onClick={handleLinkClick}>Flags</NavLink>}
          {user && <NavLink to="/account/scores" onClick={handleLinkClick}>My scores</NavLink>}
          {user && <Link to="/account/profile" onClick={handleLinkClick}>Profile</Link>}
          {!user && <NavLink to="/login" onClick={handleLinkClick}>Login</NavLink>}
          {!user && <NavLink to="/register" onClick={handleLinkClick}>Register</NavLink>}
          {user && (
            <button className="logout-btn" onClick={() => { logout(); setOpen(false) }}>
              Logout
            </button>
          )}
        </nav>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger ${open ? 'is-open' : ''}`}
          aria-label="Menu"
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  )
}


export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav/>
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>

          {/* protected */}
          <Route path="/" element={<Protected><CatalogPage/></Protected>} />
          <Route path="/quiz/:quizId" element={<Protected><QuizIntroPage/></Protected>} />
          <Route path="/quiz/:quizId/run" element={<Protected><QuizRunPage/></Protected>} />
          <Route path="/quiz/:quizId/review/:attemptId" element={<Protected><ReviewPage/></Protected>} />
          <Route path="/account/profile" element={<Protected><ProfilePage/></Protected>} />
          <Route path="/account/scores" element={<Protected><MyScoresPage/></Protected>} />
          <Route path="/account/flags" element={<Protected><FlaggedListPage/></Protected>} />
          <Route path="/question/:questionId" element={<Protected><QuestionPreviewPage/></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
