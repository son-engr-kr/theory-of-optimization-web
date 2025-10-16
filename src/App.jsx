import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'
import MainPage from './components/MainPage'

const Theorem228 = lazy(() => import('./components/Theorem228'))
const Lemma270 = lazy(() => import('./components/Lemma270'))

function App() {
  return (
    <Router>
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/theorem-2.28" element={<Theorem228 />} />
            <Route path="/lemma-2.70" element={<Lemma270 />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
