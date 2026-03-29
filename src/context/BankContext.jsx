import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── Initial seed data ────────────────────────────────────────────────────────
const SEED_STATE = {
  currentUserId: null,
  users: [
    {
      id: 'parent-1',
      role: 'parent',
      name: 'Parent',
      avatar: '👨‍👩‍👧',
      pin: '1234',
    },
    {
      id: 'kid-1',
      role: 'kid',
      name: 'Alex',
      avatar: '🦊',
      age: 12,
      pin: '0000',
      accounts: {
        spending: { balance: 25.5, id: 'spend-1' },
        savings: { balance: 80.0, id: 'save-1', interestRate: 0.05 },
      },
      goals: [
        { id: 'g1', name: 'New Game', emoji: '🎮', target: 60, saved: 20 },
        { id: 'g2', name: 'Bike Helmet', emoji: '🪖', target: 40, saved: 40 },
      ],
      transactions: [
        { id: 't1', type: 'deposit', account: 'savings', amount: 20, note: 'Birthday money', date: '2026-03-01' },
        { id: 't2', type: 'deposit', account: 'spending', amount: 10, note: 'Pocket money', date: '2026-03-10' },
        { id: 't3', type: 'transfer', from: 'spending', to: 'savings', amount: 5, note: 'Saving up!', date: '2026-03-15' },
        { id: 't4', type: 'withdraw', account: 'spending', amount: 3.5, note: 'Snack', date: '2026-03-20' },
      ],
    },
    {
      id: 'kid-2',
      role: 'kid',
      name: 'Sam',
      avatar: '🐼',
      age: 15,
      pin: '1111',
      accounts: {
        spending: { balance: 45.0, id: 'spend-2' },
        savings: { balance: 150.0, id: 'save-2', interestRate: 0.05 },
      },
      goals: [
        { id: 'g3', name: 'Headphones', emoji: '🎧', target: 120, saved: 80 },
      ],
      transactions: [
        { id: 't5', type: 'deposit', account: 'savings', amount: 50, note: 'Chores reward', date: '2026-02-20' },
        { id: 't6', type: 'deposit', account: 'spending', amount: 45, note: 'Pocket money', date: '2026-03-01' },
        { id: 't7', type: 'withdraw', account: 'spending', amount: 15, note: 'School lunch', date: '2026-03-18' },
      ],
    },
  ],
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function bankReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.userId }

    case 'LOGOUT':
      return { ...state, currentUserId: null }

    case 'DEPOSIT': {
      const { userId, account, amount, note } = action
      return updateUser(state, userId, (user) => ({
        accounts: {
          ...user.accounts,
          [account]: {
            ...user.accounts[account],
            balance: round(user.accounts[account].balance + amount),
          },
        },
        transactions: [newTx({ type: 'deposit', account, amount, note }), ...user.transactions],
      }))
    }

    case 'WITHDRAW': {
      const { userId, account, amount, note } = action
      return updateUser(state, userId, (user) => ({
        accounts: {
          ...user.accounts,
          [account]: {
            ...user.accounts[account],
            balance: round(user.accounts[account].balance - amount),
          },
        },
        transactions: [newTx({ type: 'withdraw', account, amount, note }), ...user.transactions],
      }))
    }

    case 'TRANSFER': {
      const { userId, from, to, amount, note } = action
      return updateUser(state, userId, (user) => ({
        accounts: {
          ...user.accounts,
          [from]: {
            ...user.accounts[from],
            balance: round(user.accounts[from].balance - amount),
          },
          [to]: {
            ...user.accounts[to],
            balance: round(user.accounts[to].balance + amount),
          },
        },
        transactions: [newTx({ type: 'transfer', from, to, amount, note }), ...user.transactions],
      }))
    }

    case 'ADD_GOAL': {
      const { userId, goal } = action
      return updateUser(state, userId, (user) => ({
        goals: [...user.goals, goal],
      }))
    }

    case 'FUND_GOAL': {
      const { userId, goalId, amount } = action
      return updateUser(state, userId, (user) => {
        const goal = user.goals.find((g) => g.id === goalId)
        const newSaved = Math.min(round(goal.saved + amount), goal.target)
        const deducted = newSaved - goal.saved
        return {
          accounts: {
            ...user.accounts,
            savings: {
              ...user.accounts.savings,
              balance: round(user.accounts.savings.balance - deducted),
            },
          },
          goals: user.goals.map((g) =>
            g.id === goalId ? { ...g, saved: newSaved } : g
          ),
          transactions: [
            newTx({ type: 'goal', account: 'savings', amount: deducted, note: `Saved for: ${goal.name}` }),
            ...user.transactions,
          ],
        }
      })
    }

    case 'DELETE_GOAL': {
      const { userId, goalId } = action
      return updateUser(state, userId, (user) => ({
        goals: user.goals.filter((g) => g.id !== goalId),
      }))
    }

    case 'ADD_INTEREST': {
      const { userId } = action
      return updateUser(state, userId, (user) => {
        const rate = user.accounts.savings.interestRate
        const interest = round(user.accounts.savings.balance * rate)
        return {
          accounts: {
            ...user.accounts,
            savings: {
              ...user.accounts.savings,
              balance: round(user.accounts.savings.balance + interest),
            },
          },
          transactions: [
            newTx({ type: 'interest', account: 'savings', amount: interest, note: `Monthly interest (${(rate * 100).toFixed(0)}%)` }),
            ...user.transactions,
          ],
        }
      })
    }

    case 'PARENT_ADD_KID': {
      const kid = action.kid
      return { ...state, users: [...state.users, kid] }
    }

    case 'PARENT_DEPOSIT': {
      const { kidId, account, amount, note } = action
      return updateUser(state, kidId, (user) => ({
        accounts: {
          ...user.accounts,
          [account]: {
            ...user.accounts[account],
            balance: round(user.accounts[account].balance + amount),
          },
        },
        transactions: [
          newTx({ type: 'deposit', account, amount, note: note || 'Added by Parent' }),
          ...user.transactions,
        ],
      }))
    }

    default:
      return state
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function round(n) {
  return Math.round(n * 100) / 100
}

function updateUser(state, userId, updater) {
  return {
    ...state,
    users: state.users.map((u) =>
      u.id === userId ? { ...u, ...updater(u) } : u
    ),
  }
}

let txCounter = 1000
function newTx(fields) {
  return {
    id: `tx-${++txCounter}`,
    date: new Date().toISOString().split('T')[0],
    ...fields,
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const BankContext = createContext(null)

const STORAGE_KEY = 'kidbank_state'

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(
    bankReducer,
    null,
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : SEED_STATE
      } catch {
        return SEED_STATE
      }
    }
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null
  const kids = state.users.filter((u) => u.role === 'kid')

  return (
    <BankContext.Provider value={{ state, dispatch, currentUser, kids }}>
      {children}
    </BankContext.Provider>
  )
}

export function useBank() {
  return useContext(BankContext)
}
