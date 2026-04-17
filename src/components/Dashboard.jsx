import { useBank } from '../context/BankContext'
import TopBar from './TopBar'

export default function Dashboard({ setPage }) {
  const { currentUser, dispatch } = useBank()
  const { accounts, goals, transactions } = currentUser

  const total = accounts.spending.balance + accounts.savings.balance
  const recentTxs = transactions.slice(0, 4)
  const topGoal = goals.find(g => g.saved < g.target) ?? goals[0]

  return (
    <div className="ios-page">
      <TopBar
        title={`Hey, ${currentUser.name} ${currentUser.avatar}`}
        right={
          <button className="topbar-action" onClick={() =>
            dispatch({ type: 'ADD_INTEREST', userId: currentUser.id })
          }>
            ✨ Interest
          </button>
        }
      />

      <div className="ios-content">
        {/* Balance hero */}
        <div className="balance-hero">
          <p className="balance-hero-label">Total Balance</p>
          <p className="balance-hero-amount">{fmt(total)}</p>
          <div className="balance-hero-pills">
            <span className="hero-pill blue">💳 {fmt(accounts.spending.balance)}</span>
            <span className="hero-pill green">🐷 {fmt(accounts.savings.balance)}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="ios-section-label">Quick Actions</div>
        <div className="quick-grid">
          {[
            { icon: '➕', label: 'Deposit',  page: 'accounts',  color: 'blue'   },
            { icon: '↔',  label: 'Transfer', page: 'transfer',  color: 'purple' },
            { icon: '🎯', label: 'Goals',    page: 'goals',     color: 'orange' },
            { icon: '📚', label: 'Learn',    page: 'learn',     color: 'teal'   },
          ].map(a => (
            <button key={a.page} className={`quick-tile ${a.color}`} onClick={() => setPage(a.page)}>
              <span className="quick-tile-icon">{a.icon}</span>
              <span className="quick-tile-label">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Top goal */}
        {topGoal && (
          <>
            <div className="ios-section-label">Top Goal</div>
            <div className="ios-group" onClick={() => setPage('goals')} style={{ cursor: 'pointer' }}>
              <div className="ios-row goal-row-item">
                <span className="goal-row-emoji">{topGoal.emoji}</span>
                <div className="goal-row-body">
                  <div className="goal-row-name">{topGoal.name}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(100,(topGoal.saved/topGoal.target)*100)}%` }} />
                  </div>
                  <div className="goal-row-amounts">{fmt(topGoal.saved)} of {fmt(topGoal.target)}</div>
                </div>
                <span className="ios-chevron">›</span>
              </div>
            </div>
          </>
        )}

        {/* Recent transactions */}
        <div className="ios-section-label">Recent Activity</div>
        {recentTxs.length === 0
          ? <p className="ios-empty">No transactions yet!</p>
          : (
            <div className="ios-group">
              {recentTxs.map((tx, i) => (
                <div key={tx.id}>
                  <TxRow tx={tx} />
                  {i < recentTxs.length - 1 && <div className="ios-sep" />}
                </div>
              ))}
            </div>
          )
        }
        {transactions.length > 4 && (
          <button className="ios-more-btn" onClick={() => setPage('history')}>
            See All Transactions
          </button>
        )}
      </div>
    </div>
  )
}

export function TxRow({ tx }) {
  const { icon, color } = txMeta(tx.type)
  const isPositive = tx.type === 'deposit' || tx.type === 'interest'
  const sign = tx.type === 'transfer' ? '' : isPositive ? '+' : '−'
  const amtClass = isPositive ? 'amt-green' : tx.type === 'transfer' ? 'amt-blue' : 'amt-red'

  return (
    <div className="ios-row tx-item">
      <div className={`tx-bubble ${color}`}>{icon}</div>
      <div className="tx-body">
        <span className="tx-title">{tx.note || tx.type}</span>
        <span className="tx-sub">{tx.date} · {tx.account ?? `${tx.from}→${tx.to}`}</span>
      </div>
      <span className={`tx-amt ${amtClass}`}>{sign}{fmt(tx.amount)}</span>
    </div>
  )
}

function txMeta(type) {
  return {
    deposit:  { icon: '↑', color: 'green'  },
    withdraw: { icon: '↓', color: 'red'    },
    transfer: { icon: '↔', color: 'blue'   },
    interest: { icon: '✦', color: 'yellow' },
    goal:     { icon: '◎', color: 'orange' },
  }[type] ?? { icon: '●', color: 'grey' }
}

export function fmt(n) {
  return '€' + (n ?? 0).toFixed(2)
}
