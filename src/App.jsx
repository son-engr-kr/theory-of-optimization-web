import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MainPage from './components/MainPage'
import Theorem228 from './components/Theorem228'
import Lemma270 from './components/Lemma270'

function App() {
  return (
    <Router basename="/theory-of-optimization-web">
      <div className="app">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/theorem-2.28" element={<Theorem228 />} />
          <Route path="/lemma-2.70" element={<Lemma270 />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
