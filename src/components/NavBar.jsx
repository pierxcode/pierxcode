import { useBank } from '../context/BankContext'

const TABS = [
  { id: 'dashboard', icon: '􀎞', emoji: '🏠', label: 'Home'    },
  { id: 'accounts',  icon: '􀋂', emoji: '💳', label: 'Accounts' },
  { id: 'transfer',  icon: '􀄿', emoji: '↔',  label: 'Transfer' },
  { id: 'goals',     icon: '􀎭', emoji: '🎯', label: 'Goals'   },
  { id: 'history',   icon: '􀋚', emoji: '📋', label: 'History'  },
  { id: 'learn',     icon: '􀉻', emoji: '📚', label: 'Learn'   },
]

export default function NavBar({ page, setPage }) {
  const { dispatch } = useBank()

  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${page === tab.id ? 'active' : ''}`}
            onClick={() => setPage(tab.id)}
          >
            <span className="tab-icon">{tab.emoji}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
        <button
          className="tab-item tab-exit"
          onClick={() => dispatch({ type: 'LOGOUT' })}
        >
          <span className="tab-icon">🚪</span>
          <span className="tab-label">Exit</span>
        </button>
      </div>
    </nav>
  )
}
