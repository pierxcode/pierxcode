import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'

const KID_AVATARS = ['🦊','🐼','🦁','🐸','🐧','🦄','🐻','🦋']

export default function ParentView() {
  const { kids, dispatch } = useBank()

  const [addMode, setAddMode]     = useState(false)
  const [newName, setNewName]     = useState('')
  const [newAge, setNewAge]       = useState('')
  const [newPin, setNewPin]       = useState('')
  const [newAvatar, setNewAvatar] = useState('🦊')

  const [giveMode, setGiveMode]   = useState(null) // kidId
  const [giveAcct, setGiveAcct]   = useState('spending')
  const [giveAmt, setGiveAmt]     = useState('')
  const [giveNote, setGiveNote]   = useState('')
  const [msg, setMsg]             = useState(null)

  const flash = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const addKid = () => {
    const age = parseInt(newAge)
    if (!newName.trim()) return flash('Enter a name', 'error')
    if (!age || age < 9 || age > 17) return flash('Age must be 9–17', 'error')
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) return flash('PIN must be 4 digits', 'error')

    const id = `kid-${Date.now()}`
    dispatch({
      type: 'PARENT_ADD_KID',
      kid: {
        id,
        role: 'kid',
        name: newName.trim(),
        avatar: newAvatar,
        age,
        pin: newPin,
        accounts: {
          spending: { balance: 0, id: `spend-${id}` },
          savings:  { balance: 0, id: `save-${id}`, interestRate: 0.05 },
        },
        goals: [],
        transactions: [],
      },
    })
    flash(`${newName} added! 🎉`, 'success')
    setAddMode(false)
    setNewName('')
    setNewAge('')
    setNewPin('')
    setNewAvatar('🦊')
  }

  const giveAllowance = (kidId) => {
    const val = parseFloat(giveAmt)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')

    dispatch({
      type: 'PARENT_DEPOSIT',
      kidId,
      account: giveAcct,
      amount: val,
      note: giveNote || 'Allowance from Parent',
    })
    flash('Money sent! 🎉', 'success')
    setGiveMode(null)
    setGiveAmt('')
    setGiveNote('')
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="parent-header">
        <div>
          <h1 className="page-title">👨‍👩‍👧 Parent Dashboard</h1>
          <p className="parent-sub">Manage your kids' accounts</p>
        </div>
        <button
          className="btn-sm btn-outline logout"
          onClick={() => dispatch({ type: 'LOGOUT' })}
        >
          🚪 Exit
        </button>
      </div>

      {/* Kids overview */}
      {kids.length === 0 && (
        <div className="empty-state">
          <p className="empty-emoji">👶</p>
          <p className="empty-msg">No kids added yet. Add one below!</p>
        </div>
      )}

      {kids.map((kid) => (
        <div key={kid.id} className="card kid-card">
          <div className="kid-header">
            <span className="kid-avatar">{kid.avatar}</span>
            <div>
              <p className="kid-name">{kid.name}</p>
              <p className="kid-age">Age {kid.age} · PIN: {kid.pin}</p>
            </div>
            <button
              className={`btn-sm ${giveMode === kid.id ? 'btn-red' : 'btn-green'}`}
              onClick={() => setGiveMode(giveMode === kid.id ? null : kid.id)}
            >
              {giveMode === kid.id ? 'Cancel' : '💸 Give'}
            </button>
          </div>

          <div className="kid-balances">
            <div className="kid-bal spending">
              <p>💳 Spending</p>
              <p className="bal">{fmt(kid.accounts.spending.balance)}</p>
            </div>
            <div className="kid-bal savings">
              <p>🐷 Savings</p>
              <p className="bal">{fmt(kid.accounts.savings.balance)}</p>
            </div>
            <div className="kid-bal total">
              <p>💰 Total</p>
              <p className="bal">{fmt(kid.accounts.spending.balance + kid.accounts.savings.balance)}</p>
            </div>
          </div>

          {giveMode === kid.id && (
            <div className="give-form">
              <div className="acct-toggle">
                {['spending','savings'].map((a) => (
                  <button
                    key={a}
                    className={`toggle-btn ${giveAcct === a ? 'active' : ''}`}
                    onClick={() => setGiveAcct(a)}
                  >
                    {a === 'spending' ? '💳' : '🐷'} {a}
                  </button>
                ))}
              </div>
              <input
                className="form-input"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount (€)"
                value={giveAmt}
                onChange={(e) => setGiveAmt(e.target.value)}
              />
              <input
                className="form-input"
                type="text"
                placeholder="Note (e.g. Weekly allowance)"
                value={giveNote}
                onChange={(e) => setGiveNote(e.target.value)}
              />
              <div className="quick-amounts">
                {[1, 2, 5, 10, 20].map((n) => (
                  <button key={n} className="quick-amount-btn" onClick={() => setGiveAmt(String(n))}>
                    €{n}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary full-width" onClick={() => giveAllowance(kid.id)}>
                Send Money
              </button>
            </div>
          )}

          {kid.transactions.length > 0 && (
            <div className="kid-recent">
              <p className="section-title" style={{ fontSize: '0.85rem', margin: '8px 0 4px' }}>
                Recent
              </p>
              {kid.transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="tx-mini">
                  <span>{tx.note || tx.type}</span>
                  <span className={tx.type === 'withdraw' ? 'red' : 'green'}>
                    {tx.type === 'withdraw' ? '-' : '+'}{fmt(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add kid */}
      <button className="btn btn-primary full-width mt-16" onClick={() => setAddMode(!addMode)}>
        {addMode ? '✕ Cancel' : '+ Add Child'}
      </button>

      {addMode && (
        <div className="card form-card">
          <p className="form-title">👶 Add a Child</p>
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="e.g. Alex" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <label className="form-label">Age (9–17)</label>
          <input className="form-input" type="number" min="9" max="17" placeholder="12" value={newAge} onChange={(e) => setNewAge(e.target.value)} />
          <label className="form-label">4-digit PIN</label>
          <input className="form-input" type="password" maxLength={4} placeholder="••••" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
          <label className="form-label">Avatar</label>
          <div className="emoji-picker">
            {KID_AVATARS.map((av) => (
              <button key={av} className={`emoji-btn ${newAvatar === av ? 'selected' : ''}`} onClick={() => setNewAvatar(av)}>
                {av}
              </button>
            ))}
          </div>
          <button className="btn btn-primary full-width" onClick={addKid}>
            Create Account
          </button>
        </div>
      )}

      {msg && <div className={`toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
