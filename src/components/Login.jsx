import { useState } from 'react'
import { useBank } from '../context/BankContext'

export default function Login() {
  const { state, dispatch } = useBank()
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSelect = (user) => {
    setSelected(user)
    setPin('')
    setError('')
  }

  const handlePinPress = (digit) => {
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === selected.pin) {
          dispatch({ type: 'LOGIN', userId: selected.id })
        } else {
          setError('Wrong PIN, try again!')
          setPin('')
        }
      }, 200)
    }
  }

  const handleBack = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  if (!selected) {
    return (
      <div className="login-screen">
        <div className="login-header">
          <div className="login-logo">🏦</div>
          <h1 className="login-title">KidBank</h1>
          <p className="login-subtitle">Learn to Save &amp; Spend Smart</p>
        </div>
        <div className="user-grid">
          {state.users.map((user) => (
            <button key={user.id} className="user-card" onClick={() => handleSelect(user)}>
              <span className="user-avatar">{user.avatar}</span>
              <span className="user-name">{user.name}</span>
              {user.role === 'parent' && <span className="badge-parent">Parent</span>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="login-screen">
      <div className="pin-header">
        <button className="back-btn" onClick={() => setSelected(null)}>← Back</button>
        <span className="user-avatar-lg">{selected.avatar}</span>
        <h2>Hi, {selected.name}!</h2>
        <p className="pin-label">Enter your 4-digit PIN</p>
      </div>

      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />
        ))}
      </div>

      {error && <p className="pin-error">{error}</p>}

      <div className="pin-pad">
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
          <button
            key={i}
            className={`pin-key ${k === '' ? 'invisible' : ''}`}
            onClick={() => k === '⌫' ? handleBack() : k !== '' && handlePinPress(k)}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
