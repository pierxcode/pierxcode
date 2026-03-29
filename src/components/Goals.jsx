import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'

const GOAL_EMOJIS = ['🎮','🚲','🎧','📱','👟','🎨','🏕️','🎁','✈️','📷','🪖','🎸','⚽','🎯','🍕']

export default function Goals() {
  const { currentUser, dispatch } = useBank()
  const { goals, accounts } = currentUser

  const [showAdd, setShowAdd] = useState(false)
  const [name, setName]       = useState('')
  const [emoji, setEmoji]     = useState('🎯')
  const [target, setTarget]   = useState('')
  const [fundGoalId, setFundGoalId] = useState(null)
  const [fundAmt, setFundAmt] = useState('')
  const [msg, setMsg]         = useState(null)

  const flash = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const addGoal = () => {
    const t = parseFloat(target)
    if (!name.trim()) return flash('Give your goal a name!', 'error')
    if (!t || t <= 0)  return flash('Enter a valid target amount', 'error')

    dispatch({
      type: 'ADD_GOAL',
      userId: currentUser.id,
      goal: {
        id: `g-${Date.now()}`,
        name: name.trim(),
        emoji,
        target: t,
        saved: 0,
      },
    })
    setShowAdd(false)
    setName('')
    setTarget('')
    flash('Goal created! 🎉', 'success')
  }

  const fundGoal = (goalId) => {
    const val = parseFloat(fundAmt)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (val > accounts.savings.balance) return flash('Not enough in Savings!', 'error')

    dispatch({ type: 'FUND_GOAL', userId: currentUser.id, goalId, amount: val })
    flash('Goal funded! Keep it up 🌟', 'success')
    setFundGoalId(null)
    setFundAmt('')
  }

  const allDone = goals.every((g) => g.saved >= g.target)

  return (
    <div className="page">
      <div className="page-header-row">
        <h1 className="page-title">🎯 My Goals</h1>
        <button className="btn-sm btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      <p className="savings-avail">
        Savings available: <strong>{fmt(accounts.savings.balance)}</strong>
      </p>

      {/* Add goal form */}
      {showAdd && (
        <div className="card form-card">
          <p className="form-title">🌟 New Savings Goal</p>
          <label className="form-label">Goal name</label>
          <input
            className="form-input"
            placeholder="e.g. New bike"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="form-label">Target amount (€)</label>
          <input
            className="form-input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <label className="form-label">Pick an emoji</label>
          <div className="emoji-picker">
            {GOAL_EMOJIS.map((e) => (
              <button
                key={e}
                className={`emoji-btn ${emoji === e ? 'selected' : ''}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <button className="btn btn-primary full-width" onClick={addGoal}>
            Create Goal
          </button>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 && (
        <div className="empty-state">
          <p className="empty-emoji">🌱</p>
          <p className="empty-msg">No goals yet! Create one to start saving.</p>
        </div>
      )}

      {allDone && goals.length > 0 && (
        <div className="card tip-box success-banner">
          🏆 You've reached all your goals! Amazing job!
        </div>
      )}

      <div className="goals-list">
        {goals.map((goal) => {
          const pct = Math.min(100, (goal.saved / goal.target) * 100)
          const done = goal.saved >= goal.target

          return (
            <div key={goal.id} className={`card goal-card ${done ? 'done' : ''}`}>
              <div className="goal-top">
                <span className="goal-emoji-lg">{goal.emoji}</span>
                <div className="goal-details">
                  <p className="goal-name">{goal.name}</p>
                  <p className="goal-amounts">
                    {fmt(goal.saved)} <span>of</span> {fmt(goal.target)}
                  </p>
                </div>
                {done
                  ? <span className="badge-done">Done! ✅</span>
                  : <button
                      className="btn-sm btn-outline"
                      onClick={() =>
                        setFundGoalId(fundGoalId === goal.id ? null : goal.id)
                      }
                    >
                      Fund
                    </button>
                }
                <button
                  className="delete-btn"
                  onClick={() => dispatch({ type: 'DELETE_GOAL', userId: currentUser.id, goalId: goal.id })}
                  title="Delete goal"
                >
                  ✕
                </button>
              </div>

              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${done ? 'complete' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="pct-label">{pct.toFixed(0)}%</p>

              {fundGoalId === goal.id && !done && (
                <div className="fund-form">
                  <input
                    className="form-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Amount from Savings"
                    value={fundAmt}
                    onChange={(e) => setFundAmt(e.target.value)}
                  />
                  <div className="quick-amounts">
                    {[1, 5, 10].map((n) => (
                      <button
                        key={n}
                        className="quick-amount-btn"
                        onClick={() => setFundAmt(String(n))}
                      >
                        €{n}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn-primary full-width" onClick={() => fundGoal(goal.id)}>
                    Add to Goal
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {msg && <div className={`toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
