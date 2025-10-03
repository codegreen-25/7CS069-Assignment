import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
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
import './App.css'

function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Brand / Logo */}
        <div className="brand">
          <Link to="/">CodeGreen Quiz</Link>
        </div>

        {/* Desktop links */}
        <nav className={`primary-nav ${open ? 'is-open' : ''}`}>
          <Link to="/">Home</Link>
          {user && <Link to="/account/flags">Flags</Link>}
          {user && <Link to="/account/scores">My scores</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && (
            <button className="logout-btn" onClick={logout}>
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
          <Route path="/account/scores" element={<Protected><MyScoresPage/></Protected>} />
          <Route path="/account/flags" element={<Protected><FlaggedListPage/></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
