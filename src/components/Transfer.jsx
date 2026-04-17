import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { fmt } from './Dashboard'
import TopBar from './TopBar'

export default function Transfer() {
  const { currentUser, dispatch } = useBank()
  const { accounts } = currentUser

  const [from, setFrom]     = useState('spending')
  const [to, setTo]         = useState('savings')
  const [amount, setAmount] = useState('')
  const [note, setNote]     = useState('')
  const [msg, setMsg]       = useState(null)

  const flash = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg(null), 2800) }

  const swap = () => { setFrom(to); setTo(from) }

  const submit = () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return flash('Enter a valid amount', 'error')
    if (from === to) return flash('Select different accounts', 'error')
    if (val > accounts[from].balance) return flash('Not enough money!', 'error')
    dispatch({ type: 'TRANSFER', userId: currentUser.id, from, to, amount: val, note: note || `${from} → ${to}` })
    flash(`${fmt(val)} transferred! 🎉`, 'success')
    setAmount(''); setNote('')
  }

  const pill = (type) => (
    <div className={`transfer-side ${type}`}>
      <p className="transfer-side-label">{type === from ? 'From' : 'To'}</p>
      <p className="transfer-side-icon">{type === 'spending' ? '💳' : '🐷'}</p>
      <p className="transfer-side-name">{type === 'spending' ? 'Spending' : 'Savings'}</p>
      <p className="transfer-side-bal">{fmt(accounts[type].balance)}</p>
    </div>
  )

  return (
    <div className="ios-page">
      <TopBar title="Transfer" />
      <div className="ios-content">

        {/* Visual */}
        <div className="transfer-visual">
          {pill(from)}
          <button className="swap-circle" onClick={swap}>⇄</button>
          {pill(to)}
        </div>

        {/* Tip */}
        <div className="ios-infobox">
          💡 Move money to <strong>Savings</strong> to earn interest
        </div>

        {/* Form */}
        <div className="ios-group">
          <div className="ios-row ios-field">
            <span className="field-label">Amount</span>
            <input
              className="field-input"
              type="number" min="0.01" step="0.01" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
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
          {[1,5,10,20].map(n => (
            <button key={n} className="quick-chip" onClick={() => setAmount(String(n))}>€{n}</button>
          ))}
        </div>

        <button className="ios-confirm-btn" onClick={submit}>Transfer</button>

        {/* Summary */}
        <div className="ios-section-label">Balances</div>
        <div className="ios-group">
          {[['spending','💳','Spending'],['savings','🐷','Savings']].map(([k,ic,lb]) => (
            <div key={k}>
              <div className="ios-row">
                <span className="row-icon-sm">{ic}</span>
                <span className="row-label">{lb}</span>
                <span className="row-value">{fmt(accounts[k].balance)}</span>
              </div>
              {k === 'spending' && <div className="ios-sep" />}
            </div>
          ))}
        </div>
      </div>
      {msg && <div className={`ios-toast ${msg.type}`}>{msg.text}</div>}
    </div>
  )
}
