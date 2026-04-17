import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'
import TopBar from './TopBar'

const EMOJIS = ['🎮','🚲','🎧','📱','👟','🎨','🏕️','🎁','✈️','📷','🪖','🎸','⚽','🎯','🍕']

export default function Goals() {
  const { currentUser, dispatch } = useBank()
  const { goals, accounts } = currentUser

  const [showAdd, setShowAdd] = useState(false)
  const [name, setName]       = useState('')
  const [emoji, setEmoji]     = useState('🎯')
  const [target, setTarget]   = useState('')
  const [fundId, setFundId]   = useState(null)
  const [fundAmt, setFundAmt] = useState('')
  const [msg, setMsg]         = useState(null)

  const flash = (t, type) => { setMsg({ text: t, type }); setTimeout(() => setMsg(null), 2800) }

  const addGoal = () => {
    const t = parseFloat(target)
    if (!name.trim()) return flash('Give your goal a name!', 'error')
    if (!t || t <= 0)  return flash('Enter a valid amount', 'error')
    dispatch({ type: 'ADD_GOAL', userId: currentUser.id, goal: { id: `g-${Date.now()}`, name: name.trim(), emoji, target: t, saved: 0 } })
    setShowAdd(false); setName(''); setTarget(''); setEmoji('🎯')
    flash('Goal created! 🎉', 'success')
  }

  const fund = (id) => {
    const val = parseFloat(fundAmt)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (val > accounts.savings.balance) return flash('Not enough in Savings!', 'error')
    dispatch({ type: 'FUND_GOAL', userId: currentUser.id, goalId: id, amount: val })
    flash('Goal funded! 🌟', 'success')
    setFundId(null); setFundAmt('')
  }

  return (
    <div className="ios-page">
      <TopBar
        title="Goals"
        right={
          <button className="topbar-action" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '+ New'}
          </button>
        }
      />
      <div className="ios-content">

        <div className="ios-infobox">
          🐷 Savings available: <strong>{fmt(accounts.savings.balance)}</strong>
        </div>

        {/* Add goal form */}
        {showAdd && (
          <>
            <div className="ios-section-label">New Goal</div>
            <div className="ios-group">
              <div className="ios-row ios-field">
                <span className="field-label">Name</span>
                <input className="field-input" placeholder="e.g. New bike" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="ios-sep" />
              <div className="ios-row ios-field">
                <span className="field-label">Target (€)</span>
                <input className="field-input" type="number" min="0.01" step="0.01" placeholder="0.00" value={target} onChange={e => setTarget(e.target.value)} />
              </div>
            </div>
            <div className="ios-section-label">Pick an Emoji</div>
            <div className="emoji-grid">
              {EMOJIS.map(e => (
                <button key={e} className={`emoji-tile ${emoji === e ? 'active' : ''}`} onClick={() => setEmoji(e)}>{e}</button>
              ))}
            </div>
            <button className="ios-confirm-btn" onClick={addGoal}>Create Goal</button>
          </>
        )}

        {/* Goals list */}
        {goals.length === 0 && !showAdd && (
          <div className="ios-empty-state">
            <p style={{fontSize:'3rem'}}>🌱</p>
            <p className="ios-empty-title">No goals yet</p>
            <p className="ios-empty-sub">Tap + New to set your first savings goal</p>
          </div>
        )}

        {goals.length > 0 && (
          <>
            <div className="ios-section-label">My Goals</div>
            <div className="ios-group">
              {goals.map((goal, i) => {
                const pct = Math.min(100, (goal.saved / goal.target) * 100)
                const done = goal.saved >= goal.target
                return (
                  <div key={goal.id}>
                    <div className="ios-row goal-item">
                      <span className="goal-item-emoji">{goal.emoji}</span>
                      <div className="goal-item-body">
                        <div className="goal-item-top">
                          <span className="goal-item-name">{goal.name}</span>
                          {done
                            ? <span className="goal-done-badge">Done ✓</span>
                            : <button className="goal-fund-btn" onClick={() => setFundId(fundId === goal.id ? null : goal.id)}>
                                {fundId === goal.id ? 'Cancel' : 'Fund'}
                              </button>
                          }
                          <button className="goal-del-btn" onClick={() => dispatch({ type: 'DELETE_GOAL', userId: currentUser.id, goalId: goal.id })}>✕</button>
                        </div>
                        <div className="progress-track">
                          <div className={`progress-fill ${done ? 'complete' : ''}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="goal-item-meta">
                          <span>{fmt(goal.saved)} of {fmt(goal.target)}</span>
                          <span className="goal-pct">{pct.toFixed(0)}%</span>
                        </div>
                        {fundId === goal.id && !done && (
                          <div className="fund-inline">
                            <input
                              className="fund-input"
                              type="number" min="0.01" step="0.01" placeholder="Amount from Savings"
                              value={fundAmt} onChange={e => setFundAmt(e.target.value)}
                              autoFocus
                            />
                            <div className="quick-amounts" style={{marginTop: 8}}>
                              {[1,5,10].map(n => <button key={n} className="quick-chip" onClick={() => setFundAmt(String(n))}>€{n}</button>)}
                            </div>
                            <button className="ios-confirm-btn" style={{marginTop: 10}} onClick={() => fund(goal.id)}>Add to Goal</button>
                          </div>
                        )}
                      </div>
                    </div>
                    {i < goals.length - 1 && <div className="ios-sep ios-sep-inset" />}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      {msg && <div className={`ios-toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
