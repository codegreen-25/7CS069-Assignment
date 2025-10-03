import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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

  return (
     <nav className="app-nav">
      <Link to="/">Home</Link>
      {user && <Link to="/account/flags">Flagged Questions</Link>}
      {user && <Link to="/account/scores">Previous Scores</Link>}
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && (
        <button className="btn btn-outline logout-btn" onClick={logout}>Logout</button>
      )}
    </nav>
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
