import { useState } from 'react'
import './App.css'
import MainPage from './components/MainPage'
import Theorem228 from './components/Theorem228'

function App() {
  const [currentPage, setCurrentPage] = useState('main')

  const renderPage = () => {
    if (currentPage === 'theorem-2.28') {
      return (
        <div>
          <button className="back-button" onClick={() => setCurrentPage('main')}>
            ← Back
          </button>
          <Theorem228 />
        </div>
      )
    }
    return <MainPage onNavigate={setCurrentPage} />
  }

  return <div className="app">{renderPage()}</div>
}

export default App
