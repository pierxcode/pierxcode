import { useBank } from '../context/BankContext'

/**
 * iOS-style Large Title navigation bar.
 * Sticks to the top; content scrolls beneath it.
 */
export default function TopBar({ title, right }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1 className="topbar-title">{title}</h1>
        {right && <div className="topbar-right">{right}</div>}
      </div>
    </header>
  )
}
