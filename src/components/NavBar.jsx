import { useBank } from '../context/BankContext'

const TABS = [
  { id: 'dashboard', icon: '🏠', label: 'Home' },
  { id: 'accounts',  icon: '💳', label: 'Money' },
  { id: 'transfer',  icon: '↔️',  label: 'Move' },
  { id: 'goals',     icon: '🎯', label: 'Goals' },
  { id: 'history',   icon: '📋', label: 'History' },
  { id: 'learn',     icon: '📚', label: 'Learn' },
]

export default function NavBar({ page, setPage }) {
  const { dispatch } = useBank()

  return (
    <nav className="navbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${page === tab.id ? 'active' : ''}`}
          onClick={() => setPage(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
      <button className="nav-item logout-btn" onClick={() => dispatch({ type: 'LOGOUT' })}>
        <span className="nav-icon">🚪</span>
        <span className="nav-label">Exit</span>
      </button>
    </nav>
  )
}
