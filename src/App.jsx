import { useState } from 'react'
import { useBank } from './context/BankContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Accounts from './components/Accounts'
import Transfer from './components/Transfer'
import Goals from './components/Goals'
import History from './components/History'
import Learn from './components/Learn'
import ParentView from './components/ParentView'
import NavBar from './components/NavBar'

export default function App() {
  const { currentUser } = useBank()
  const [page, setPage] = useState('dashboard')

  if (!currentUser) return <Login />

  const renderPage = () => {
    if (currentUser.role === 'parent') return <ParentView />
    switch (page) {
      case 'dashboard':   return <Dashboard setPage={setPage} />
      case 'accounts':    return <Accounts />
      case 'transfer':    return <Transfer />
      case 'goals':       return <Goals />
      case 'history':     return <History />
      case 'learn':       return <Learn />
      default:            return <Dashboard setPage={setPage} />
    }
  }

  return (
    <div className="app-shell">
      <main className="page-content">{renderPage()}</main>
      {currentUser.role === 'kid' && (
        <NavBar page={page} setPage={setPage} />
      )}
    </div>
  )
}
