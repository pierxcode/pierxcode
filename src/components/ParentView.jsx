import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'
import TopBar from './TopBar'

const AVATARS = ['🦊','🐼','🦁','🐸','🐧','🦄','🐻','🦋']

export default function ParentView() {
  const { kids, dispatch } = useBank()

  const [addMode, setAddMode]     = useState(false)
  const [newName, setNewName]     = useState('')
  const [newAge, setNewAge]       = useState('')
  const [newPin, setNewPin]       = useState('')
  const [newAvatar, setNewAvatar] = useState('🦊')

  const [giveKid, setGiveKid]   = useState(null)
  const [giveAcct, setGiveAcct] = useState('spending')
  const [giveAmt, setGiveAmt]   = useState('')
  const [giveNote, setGiveNote] = useState('')
  const [msg, setMsg]           = useState(null)

  const flash = (t, type) => { setMsg({ text: t, type }); setTimeout(() => setMsg(null), 2800) }

  const addKid = () => {
    const age = parseInt(newAge)
    if (!newName.trim()) return flash('Enter a name', 'error')
    if (!age || age < 9 || age > 17) return flash('Age must be 9–17', 'error')
    if (!/^\d{4}$/.test(newPin)) return flash('PIN must be 4 digits', 'error')
    const id = `kid-${Date.now()}`
    dispatch({ type: 'PARENT_ADD_KID', kid: {
      id, role: 'kid', name: newName.trim(), avatar: newAvatar, age, pin: newPin,
      accounts: { spending: { balance: 0, id: `sp-${id}` }, savings: { balance: 0, id: `sv-${id}`, interestRate: 0.05 } },
      goals: [], transactions: [],
    }})
    flash(`${newName} added! 🎉`, 'success')
    setAddMode(false); setNewName(''); setNewAge(''); setNewPin(''); setNewAvatar('🦊')
  }

  const give = (kidId) => {
    const val = parseFloat(giveAmt)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    dispatch({ type: 'PARENT_DEPOSIT', kidId, account: giveAcct, amount: val, note: giveNote || 'Allowance from Parent' })
    flash('Money sent! 🎉', 'success')
    setGiveKid(null); setGiveAmt(''); setGiveNote('')
  }

  return (
    <div className="ios-page">
      <TopBar
        title="Parent Dashboard"
        right={<button className="topbar-exit" onClick={() => dispatch({ type: 'LOGOUT' })}>Exit</button>}
      />
      <div className="ios-content">

        {kids.length === 0 && !addMode && (
          <div className="ios-empty-state">
            <p style={{fontSize:'3rem'}}>👶</p>
            <p className="ios-empty-title">No children yet</p>
            <p className="ios-empty-sub">Tap Add Child to create an account</p>
          </div>
        )}

        {kids.length > 0 && (
          <>
            <div className="ios-section-label">Children</div>
            {kids.map((kid, ki) => (
              <div key={kid.id} className="ios-group" style={{marginBottom: 16}}>
                {/* Kid header row */}
                <div className="ios-row kid-header-row">
                  <span className="kid-big-avatar">{kid.avatar}</span>
                  <div className="kid-header-info">
                    <p className="kid-header-name">{kid.name}</p>
                    <p className="kid-header-meta">Age {kid.age} · PIN {kid.pin}</p>
                  </div>
                  <button
                    className={`topbar-action ${giveKid === kid.id ? 'action-cancel' : ''}`}
                    onClick={() => setGiveKid(giveKid === kid.id ? null : kid.id)}
                  >
                    {giveKid === kid.id ? 'Cancel' : '💸 Give'}
                  </button>
                </div>

                <div className="ios-sep" />

                {/* Balances */}
                <div className="ios-row">
                  <span className="row-icon-sm">💳</span>
                  <span className="row-label">Spending</span>
                  <span className="row-value blue">{fmt(kid.accounts.spending.balance)}</span>
                </div>
                <div className="ios-sep ios-sep-inset" />
                <div className="ios-row">
                  <span className="row-icon-sm">🐷</span>
                  <span className="row-label">Savings</span>
                  <span className="row-value green">{fmt(kid.accounts.savings.balance)}</span>
                </div>

                {/* Give allowance form */}
                {giveKid === kid.id && (
                  <>
                    <div className="ios-sep" />
                    <div className="give-form-inner">
                      <div className="seg-row">
                        {['spending','savings'].map(a => (
                          <button key={a} className={`seg-pill ${giveAcct === a ? 'active' : ''}`} onClick={() => setGiveAcct(a)}>
                            {a === 'spending' ? '💳' : '🐷'} {a}
                          </button>
                        ))}
                      </div>
                      <input className="give-input" type="number" min="0.01" step="0.01" placeholder="Amount (€)" value={giveAmt} onChange={e => setGiveAmt(e.target.value)} />
                      <input className="give-input" type="text" placeholder="Note (e.g. Weekly allowance)" value={giveNote} onChange={e => setGiveNote(e.target.value)} />
                      <div className="quick-amounts">
                        {[1,2,5,10,20].map(n => <button key={n} className="quick-chip" onClick={() => setGiveAmt(String(n))}>€{n}</button>)}
                      </div>
                      <button className="ios-confirm-btn" onClick={() => give(kid.id)}>Send Money</button>
                    </div>
                  </>
                )}

                {/* Recent */}
                {kid.transactions.length > 0 && (
                  <>
                    <div className="ios-sep" />
                    {kid.transactions.slice(0,3).map((tx, i) => (
                      <div key={tx.id}>
                        <div className="ios-row">
                          <span className="row-label" style={{flex:1}}>{tx.note || tx.type}</span>
                          <span className={tx.type === 'withdraw' ? 'row-value red' : 'row-value green'}>
                            {tx.type === 'withdraw' ? '−' : '+'}{fmt(tx.amount)}
                          </span>
                        </div>
                        {i < Math.min(2, kid.transactions.length-1) && <div className="ios-sep ios-sep-inset" />}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {/* Add child */}
        <button className="ios-confirm-btn" style={{marginBottom: 12}} onClick={() => setAddMode(!addMode)}>
          {addMode ? '✕ Cancel' : '+ Add Child'}
        </button>

        {addMode && (
          <>
            <div className="ios-section-label">Child Details</div>
            <div className="ios-group">
              <div className="ios-row ios-field">
                <span className="field-label">Name</span>
                <input className="field-input" placeholder="e.g. Alex" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="ios-sep" />
              <div className="ios-row ios-field">
                <span className="field-label">Age</span>
                <input className="field-input" type="number" min="9" max="17" placeholder="9–17" value={newAge} onChange={e => setNewAge(e.target.value)} />
              </div>
              <div className="ios-sep" />
              <div className="ios-row ios-field">
                <span className="field-label">PIN</span>
                <input className="field-input" type="password" maxLength={4} placeholder="4 digits" value={newPin} onChange={e => setNewPin(e.target.value)} />
              </div>
            </div>
            <div className="ios-section-label">Avatar</div>
            <div className="emoji-grid">
              {AVATARS.map(av => (
                <button key={av} className={`emoji-tile ${newAvatar === av ? 'active' : ''}`} onClick={() => setNewAvatar(av)}>{av}</button>
              ))}
            </div>
            <button className="ios-confirm-btn" onClick={addKid}>Create Account</button>
          </>
        )}
      </div>
      {msg && <div className={`ios-toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
