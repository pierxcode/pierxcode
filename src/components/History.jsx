import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { TxRow, fmt } from './Dashboard'
import TopBar from './TopBar'

const FILTERS = ['All','Deposits','Withdrawals','Transfers','Interest','Goals']
const MAP = { All: null, Deposits: 'deposit', Withdrawals: 'withdraw', Transfers: 'transfer', Interest: 'interest', Goals: 'goal' }

export default function History() {
  const { currentUser } = useBank()
  const { transactions, accounts } = currentUser
  const [filter, setFilter] = useState('All')

  const filtered = MAP[filter] ? transactions.filter(t => t.type === MAP[filter]) : transactions
  const totalIn  = transactions.filter(t => t.type === 'deposit' || t.type === 'interest').reduce((s,t) => s+t.amount, 0)
  const totalOut = transactions.filter(t => t.type === 'withdraw').reduce((s,t) => s+t.amount, 0)

  return (
    <div className="ios-page">
      <TopBar title="History" />
      <div className="ios-content">

        {/* Summary strip */}
        <div className="history-strip">
          <div className="strip-cell green">
            <p className="strip-label">Money In</p>
            <p className="strip-val">+{fmt(totalIn)}</p>
          </div>
          <div className="strip-divider" />
          <div className="strip-cell red">
            <p className="strip-label">Money Out</p>
            <p className="strip-val">−{fmt(totalOut)}</p>
          </div>
          <div className="strip-divider" />
          <div className="strip-cell blue">
            <p className="strip-label">Balance</p>
            <p className="strip-val">{fmt(accounts.spending.balance + accounts.savings.balance)}</p>
          </div>
        </div>

        {/* Segmented filter */}
        <div className="seg-scroll">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`seg-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0
          ? (
            <div className="ios-empty-state">
              <p style={{fontSize:'2.5rem'}}>📭</p>
              <p className="ios-empty-title">Nothing here</p>
              <p className="ios-empty-sub">No {filter.toLowerCase()} yet</p>
            </div>
          )
          : (
            <div className="ios-group">
              {filtered.map((tx, i) => (
                <div key={tx.id}>
                  <TxRow tx={tx} />
                  {i < filtered.length - 1 && <div className="ios-sep ios-sep-inset" />}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}
