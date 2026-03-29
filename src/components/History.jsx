import { useState } from 'react'
import { useBank } from '../context/BankContext'
import { TxRow, fmt } from './Dashboard'

const FILTERS = ['All', 'Deposits', 'Withdrawals', 'Transfers', 'Interest', 'Goals']

const filterMap = {
  All: null,
  Deposits: 'deposit',
  Withdrawals: 'withdraw',
  Transfers: 'transfer',
  Interest: 'interest',
  Goals: 'goal',
}

export default function History() {
  const { currentUser } = useBank()
  const { transactions, accounts } = currentUser
  const [filter, setFilter] = useState('All')

  const filtered = filterMap[filter]
    ? transactions.filter((t) => t.type === filterMap[filter])
    : transactions

  const totalIn  = transactions.filter((t) => t.type === 'deposit' || t.type === 'interest')
                               .reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter((t) => t.type === 'withdraw')
                               .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="page">
      <h1 className="page-title">📋 Transaction History</h1>

      {/* Summary */}
      <div className="history-summary">
        <div className="summary-card green">
          <p className="summary-label">Total In</p>
          <p className="summary-val">+{fmt(totalIn)}</p>
        </div>
        <div className="summary-card red">
          <p className="summary-label">Total Out</p>
          <p className="summary-val">-{fmt(totalOut)}</p>
        </div>
        <div className="summary-card blue">
          <p className="summary-label">Balance</p>
          <p className="summary-val">{fmt(accounts.spending.balance + accounts.savings.balance)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-emoji">📭</p>
          <p className="empty-msg">No transactions here yet!</p>
        </div>
      ) : (
        <div className="tx-list">
          {filtered.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  )
}
