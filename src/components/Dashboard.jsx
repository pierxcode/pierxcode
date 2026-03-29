import { useBank } from '../context/BankContext'

export default function Dashboard({ setPage }) {
  const { currentUser, dispatch } = useBank()
  const { accounts, goals, transactions } = currentUser

  const totalBalance = accounts.spending.balance + accounts.savings.balance
  const recentTxs = transactions.slice(0, 3)

  const handleInterest = () => {
    dispatch({ type: 'ADD_INTEREST', userId: currentUser.id })
  }

  const topGoal = goals.find((g) => g.saved < g.target) ?? goals[0]

  return (
    <div className="page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="greeting">Hey, {currentUser.name}! 👋</p>
          <p className="greeting-sub">Here's your money overview</p>
        </div>
        <span className="avatar-bubble">{currentUser.avatar}</span>
      </div>

      {/* Total Balance Card */}
      <div className="card hero-card">
        <p className="card-label">Total Balance</p>
        <p className="hero-amount">{fmt(totalBalance)}</p>
        <div className="account-pills">
          <span className="pill spending">💳 Spending {fmt(accounts.spending.balance)}</span>
          <span className="pill savings">🐷 Savings {fmt(accounts.savings.balance)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions">
        {[
          { label: 'Add Money',   icon: '➕', page: 'accounts' },
          { label: 'Move Money',  icon: '↔️',  page: 'transfer' },
          { label: 'My Goals',    icon: '🎯', page: 'goals' },
          { label: 'Learn',       icon: '📚', page: 'learn' },
        ].map((a) => (
          <button key={a.page} className="quick-btn" onClick={() => setPage(a.page)}>
            <span className="quick-icon">{a.icon}</span>
            <span className="quick-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Savings interest sim */}
      <div className="card interest-card">
        <div>
          <p className="card-label">Savings Interest</p>
          <p className="interest-rate">Rate: {(accounts.savings.interestRate * 100).toFixed(0)}% / month</p>
        </div>
        <button className="btn-sm btn-green" onClick={handleInterest}>
          Earn Interest!
        </button>
      </div>

      {/* Top goal progress */}
      {topGoal && (
        <div className="card goal-preview" onClick={() => setPage('goals')} style={{ cursor: 'pointer' }}>
          <p className="card-label">Top Goal</p>
          <div className="goal-row">
            <span className="goal-emoji">{topGoal.emoji}</span>
            <div className="goal-info">
              <p className="goal-name">{topGoal.name}</p>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, (topGoal.saved / topGoal.target) * 100)}%` }}
                />
              </div>
              <p className="goal-amounts">{fmt(topGoal.saved)} of {fmt(topGoal.target)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <h2 className="section-title">Recent Activity</h2>
      {recentTxs.length === 0 ? (
        <p className="empty-msg">No transactions yet!</p>
      ) : (
        <div className="tx-list">
          {recentTxs.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
      {transactions.length > 3 && (
        <button className="link-btn" onClick={() => setPage('history')}>
          View all transactions →
        </button>
      )}
    </div>
  )
}

export function TxRow({ tx }) {
  const icon = txIcon(tx.type)
  const color = tx.type === 'deposit' || tx.type === 'interest' ? 'green' : tx.type === 'transfer' ? 'blue' : 'red'
  const sign  = tx.type === 'deposit' || tx.type === 'interest' ? '+' : tx.type === 'transfer' ? '↔' : '-'

  return (
    <div className="tx-row">
      <span className="tx-icon">{icon}</span>
      <div className="tx-info">
        <p className="tx-note">{tx.note || tx.type}</p>
        <p className="tx-date">{tx.date} · {tx.account || `${tx.from} → ${tx.to}`}</p>
      </div>
      <span className={`tx-amount ${color}`}>{sign}{fmt(tx.amount)}</span>
    </div>
  )
}

function txIcon(type) {
  return { deposit: '⬆️', withdraw: '⬇️', transfer: '↔️', interest: '✨', goal: '🎯' }[type] ?? '💰'
}

export function fmt(n) {
  return '€' + (n ?? 0).toFixed(2)
}
