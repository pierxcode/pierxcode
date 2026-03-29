import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'

export default function Transfer() {
  const { currentUser, dispatch } = useBank()
  const { accounts } = currentUser

  const [from, setFrom] = useState('spending')
  const [to, setTo]     = useState('savings')
  const [amount, setAmount] = useState('')
  const [note, setNote]   = useState('')
  const [msg, setMsg]     = useState(null)

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const submit = () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (from === to) return flash('Pick different accounts', 'error')
    if (val > accounts[from].balance) return flash('Not enough money!', 'error')

    dispatch({
      type: 'TRANSFER',
      userId: currentUser.id,
      from,
      to,
      amount: val,
      note: note || `Transfer: ${from} → ${to}`,
    })
    flash(`${fmt(val)} moved! 🎉`, 'success')
    setAmount('')
    setNote('')
  }

  const flash = (text, type) => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="page">
      <h1 className="page-title">↔️ Move Money</h1>

      <div className="card transfer-visual">
        <AccountPill label="From" type={from} balance={accounts[from].balance} />
        <button className="swap-btn" onClick={swap}>⇄</button>
        <AccountPill label="To"   type={to}   balance={accounts[to].balance}   />
      </div>

      <div className="card form-card">
        <p className="tip-box">
          💡 Moving money to <strong>Savings</strong> earns you interest!
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
          placeholder="Why are you moving this?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="quick-amounts">
          {[1, 5, 10, 20].map((n) => (
            <button
              key={n}
              className="quick-amount-btn"
              onClick={() => setAmount(String(n))}
            >
              €{n}
            </button>
          ))}
        </div>

        <button className="btn btn-primary full-width" onClick={submit}>
          Transfer
        </button>
      </div>

      {/* Summary */}
      <div className="card balance-summary">
        <BalRow label="Spending" val={accounts.spending.balance} icon="💳" />
        <BalRow label="Savings"  val={accounts.savings.balance}  icon="🐷" />
        <div className="divider" />
        <BalRow
          label="Total"
          val={accounts.spending.balance + accounts.savings.balance}
          icon="💰"
          bold
        />
      </div>

      {msg && <div className={`toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}

function AccountPill({ label, type, balance }) {
  return (
    <div className={`transfer-pill ${type}`}>
      <p className="pill-label">{label}</p>
      <p className="pill-type">{type === 'spending' ? '💳 Spending' : '🐷 Savings'}</p>
      <p className="pill-balance">{fmt(balance)}</p>
    </div>
  )
}

function BalRow({ label, val, icon, bold }) {
  return (
    <div className="bal-row" style={{ fontWeight: bold ? 700 : 400 }}>
      <span>{icon} {label}</span>
      <span>{fmt(val)}</span>
    </div>
  )
}
