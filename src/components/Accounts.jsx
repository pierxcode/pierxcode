import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'
import TopBar from './TopBar'

export default function Accounts() {
  const { currentUser, dispatch } = useBank()
  const { accounts } = currentUser

  const [acct, setAcct]     = useState('spending')
  const [mode, setMode]     = useState(null)
  const [amount, setAmount] = useState('')
  const [note, setNote]     = useState('')
  const [msg, setMsg]       = useState(null)

  const flash = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg(null), 2800) }

  const submit = () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (mode === 'withdraw' && val > accounts[acct].balance) return flash('Not enough money!', 'error')
    dispatch({
      type: mode === 'deposit' ? 'DEPOSIT' : 'WITHDRAW',
      userId: currentUser.id, account: acct, amount: val,
      note: note || (mode === 'deposit' ? 'Deposit' : 'Withdrawal'),
    })
    flash(mode === 'deposit' ? `+${fmt(val)} added! 🎉` : `${fmt(val)} withdrawn`, 'success')
    setAmount(''); setNote(''); setMode(null)
  }

  return (
    <div className="ios-page">
      <TopBar title="Accounts" />
      <div className="ios-content">

        {/* Account cards */}
        <div className="acct-cards">
          {['spending','savings'].map(a => (
            <button
              key={a}
              className={`acct-card ${a} ${acct === a ? 'active' : ''}`}
              onClick={() => { setAcct(a); setMode(null) }}
            >
              <span className="acct-card-icon">{a === 'spending' ? '💳' : '🐷'}</span>
              <span className="acct-card-label">{a === 'spending' ? 'Spending' : 'Savings'}</span>
              <span className="acct-card-bal">{fmt(accounts[a].balance)}</span>
              {a === 'savings' && (
                <span className="acct-card-sub">{(accounts.savings.interestRate*100).toFixed(0)}% / mo</span>
              )}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="ios-btn-row">
          <button
            className={`ios-action-btn ${mode==='deposit' ? 'active-green' : ''}`}
            onClick={() => setMode(mode==='deposit' ? null : 'deposit')}
          >
            ＋ Deposit
          </button>
          <button
            className={`ios-action-btn ${mode==='withdraw' ? 'active-red' : ''}`}
            onClick={() => setMode(mode==='withdraw' ? null : 'withdraw')}
          >
            − Withdraw
          </button>
        </div>

        {/* Form */}
        {mode && (
          <>
            <div className="ios-section-label">
              {mode === 'deposit' ? 'Add money to' : 'Take from'} {acct}
            </div>
            <div className="ios-group">
              <div className="ios-row ios-field">
                <span className="field-label">Amount</span>
                <input
                  className="field-input"
                  type="number" min="0.01" step="0.01" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="ios-sep" />
              <div className="ios-row ios-field">
                <span className="field-label">Note</span>
                <input
                  className="field-input"
                  type="text" placeholder="Optional"
                  value={note} onChange={e => setNote(e.target.value)}
                />
              </div>
            </div>
            <div className="quick-amounts">
              {[1,2,5,10,20].map(n => (
                <button key={n} className="quick-chip" onClick={() => setAmount(String(n))}>€{n}</button>
              ))}
            </div>
            <button className="ios-confirm-btn" onClick={submit}>Confirm</button>
          </>
        )}
      </div>
      {msg && <div className={`ios-toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
