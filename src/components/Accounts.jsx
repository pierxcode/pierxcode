import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'

export default function Accounts() {
  const { currentUser, dispatch } = useBank()
  const { accounts } = currentUser

  const [mode, setMode] = useState(null) // 'deposit' | 'withdraw'
  const [acct, setAcct] = useState('spending')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState(null)

  const balance = accounts[acct].balance

  const submit = () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (mode === 'withdraw' && val > balance) return flash('Not enough money!', 'error')

    dispatch({
      type: mode === 'deposit' ? 'DEPOSIT' : 'WITHDRAW',
      userId: currentUser.id,
      account: acct,
      amount: val,
      note: note || (mode === 'deposit' ? 'Deposit' : 'Withdrawal'),
    })
    flash(mode === 'deposit' ? `+${fmt(val)} added! 🎉` : `-${fmt(val)} withdrawn`, 'success')
    setAmount('')
    setNote('')
    setMode(null)
  }

  const flash = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="page">
      <h1 className="page-title">💳 My Accounts</h1>

      {/* Account cards */}
      <div className="accounts-grid">
        <div className={`card account-card spending ${acct === 'spending' ? 'selected' : ''}`}
          onClick={() => setAcct('spending')}>
          <p className="acct-type">Spending</p>
          <p className="acct-emoji">💳</p>
          <p className="acct-balance">{fmt(accounts.spending.balance)}</p>
          <p className="acct-desc">For everyday things</p>
        </div>
        <div className={`card account-card savings ${acct === 'savings' ? 'selected' : ''}`}
          onClick={() => setAcct('savings')}>
          <p className="acct-type">Savings</p>
          <p className="acct-emoji">🐷</p>
          <p className="acct-balance">{fmt(accounts.savings.balance)}</p>
          <p className="acct-desc">Earns {(accounts.savings.interestRate * 100).toFixed(0)}% interest/month</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-row">
        <button className={`btn btn-green ${mode === 'deposit' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'deposit' ? null : 'deposit')}>
          ➕ Deposit
        </button>
        <button className={`btn btn-red ${mode === 'withdraw' ? 'active' : ''}`}
          onClick={() => setMode(mode === 'withdraw' ? null : 'withdraw')}>
          ➖ Withdraw
        </button>
      </div>

      {/* Form */}
      {mode && (
        <div className="card form-card">
          <p className="form-title">
            {mode === 'deposit' ? '➕ Add money to' : '➖ Take money from'}{' '}
            <strong>{acct}</strong>
          </p>
          <label className="form-label">Amount (€)</label>
          <input
            className="form-input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label className="form-label">Note (optional)</label>
          <input
            className="form-input"
            type="text"
            placeholder="What's this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="quick-amounts">
            {[1, 2, 5, 10, 20].map((n) => (
              <button key={n} className="quick-amount-btn" onClick={() => setAmount(String(n))}>
                €{n}
              </button>
            ))}
          </div>
          <button className="btn btn-primary full-width" onClick={submit}>
            Confirm
          </button>
        </div>
      )}

      {msg && (
        <div className={`toast ${msg.type}`}>{msg.text}</div>
      )}
    </div>
  )
}
