import { useState } from 'react'
import { useBank } from '../context/BankContext'

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function Login() {
  const { state, dispatch } = useBank()
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSelect = (user) => { setSelected(user); setPin(''); setError('') }

  const handleKey = (k) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); setError(''); return }
    if (k === '') return
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === selected.pin) {
          dispatch({ type: 'LOGIN', userId: selected.id })
        } else {
          setShake(true)
          setError('Incorrect PIN')
          setPin('')
          setTimeout(() => setShake(false), 500)
        }
      }, 120)
    }
  }

  /* ── User picker ───────────────────────────────────────── */
  if (!selected) return (
    <div className="ios-screen lock-screen">
      <div className="lock-top">
        <div className="lock-icon">🏦</div>
        <h1 className="lock-appname">KidBank</h1>
        <p className="lock-sub">Learn to Save &amp; Spend Smart</p>
      </div>
      <div className="user-list">
        {state.users.map(u => (
          <button key={u.id} className="user-row" onClick={() => handleSelect(u)}>
            <span className="user-row-avatar">{u.avatar}</span>
            <span className="user-row-name">{u.name}</span>
            {u.role === 'parent'
              ? <span className="user-row-badge">Parent</span>
              : <span className="user-row-age">Age {u.age}</span>}
            <span className="user-row-chevron">›</span>
          </button>
        ))}
      </div>
    </div>
  )

  /* ── PIN entry ─────────────────────────────────────────── */
  return (
    <div className="ios-screen pin-screen">
      <button className="ios-back-btn" onClick={() => setSelected(null)}>
        ‹ Back
      </button>

      <div className="pin-identity">
        <div className="pin-avatar">{selected.avatar}</div>
        <p className="pin-name">{selected.name}</p>
        <p className="pin-prompt">Enter PIN</p>
      </div>

      <div className={`pin-dots-row ${shake ? 'shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <span key={i} className={`ios-dot ${pin.length > i ? 'filled' : ''} ${error ? 'error' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-err">{error}</p>}

      <div className="ios-numpad">
        {KEYS.map((k, i) => (
          <button
            key={i}
            className={`numpad-key ${k === '' ? 'numpad-empty' : ''} ${k === '⌫' ? 'numpad-del' : ''}`}
            onClick={() => handleKey(k)}
            disabled={k === ''}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
