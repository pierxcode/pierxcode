import { useState } from 'react'

const LESSONS = [
  {
    id: 'saving',
    emoji: '🐷',
    title: 'Why Save Money?',
    color: '#a78bfa',
    short: 'Saving lets you buy bigger things later!',
    content: [
      'Saving means keeping some money instead of spending it all.',
      'When you save regularly, even small amounts add up over time.',
      'If you save €2 every week, after a year you\'ll have €104!',
      'A savings account earns interest — the bank pays YOU for keeping money there.',
    ],
    quiz: {
      q: 'If you save €5 every week, how much will you have after 10 weeks?',
      options: ['€10', '€50', '€500'],
      answer: '€50',
    },
  },
  {
    id: 'interest',
    emoji: '✨',
    title: 'What is Interest?',
    color: '#f59e0b',
    short: 'Your money grows while you sleep!',
    content: [
      'Interest is extra money the bank gives you for saving.',
      'If you have €100 and the interest rate is 5%, you earn €5 extra.',
      'Compound interest means you earn interest on your interest too!',
      'The longer you save, the more interest you collect — it snowballs!',
    ],
    quiz: {
      q: 'You have €200 in savings with 5% interest. How much interest do you earn?',
      options: ['€5', '€10', '€20'],
      answer: '€10',
    },
  },
  {
    id: 'budget',
    emoji: '📊',
    title: 'Budgeting Basics',
    color: '#10b981',
    short: 'Plan where your money goes!',
    content: [
      'A budget is a plan for how to spend and save your money.',
      'First, list all the money you receive (pocket money, gifts).',
      'Then decide how much to SAVE and how much to SPEND.',
      'A good rule: save at least 20% of what you receive.',
    ],
    quiz: {
      q: 'You get €10 pocket money. If you save 20%, how much do you save?',
      options: ['€1', '€2', '€5'],
      answer: '€2',
    },
  },
  {
    id: 'needs-wants',
    emoji: '🛒',
    title: 'Needs vs Wants',
    color: '#3b82f6',
    short: 'Know the difference!',
    content: [
      'NEEDS are things you must have: food, shelter, clothes.',
      'WANTS are things you\'d like but can live without: games, candy, toys.',
      'Before spending, ask yourself: "Is this a need or a want?"',
      'Choosing needs over wants helps you save more money!',
    ],
    quiz: {
      q: 'Which of these is a NEED?',
      options: ['New video game', 'Lunch at school', 'Movie ticket'],
      answer: 'Lunch at school',
    },
  },
  {
    id: 'goals',
    emoji: '🎯',
    title: 'Setting Money Goals',
    color: '#ef4444',
    short: 'Work towards something you really want!',
    content: [
      'A money goal is something specific you are saving towards.',
      'Write down your goal and how much it costs.',
      'Divide the cost by how many weeks you want to save for.',
      'Put that amount aside every week — you\'ll get there!',
    ],
    quiz: {
      q: 'A game costs €30. You save €5 a week. How many weeks to reach your goal?',
      options: ['3 weeks', '6 weeks', '10 weeks'],
      answer: '6 weeks',
    },
  },
  {
    id: 'smart-spending',
    emoji: '🧠',
    title: 'Smart Spending',
    color: '#8b5cf6',
    short: 'Get more for your money!',
    content: [
      'Compare prices before you buy — the same item may cost less elsewhere.',
      'Wait 24 hours before big purchases — sometimes the urge goes away!',
      'Look for sales and discounts to make your money go further.',
      'Avoid impulse buying — stick to your shopping list.',
    ],
    quiz: {
      q: 'What is a good rule before buying something expensive?',
      options: ['Buy it immediately', 'Wait 24 hours and think', 'Ask a friend to buy it'],
      answer: 'Wait 24 hours and think',
    },
  },
]

export default function Learn() {
  const [open, setOpen]         = useState(null)
  const [answered, setAnswered] = useState({})
  const [chosen, setChosen]     = useState({})

  const openLesson = (id) => setOpen(open === id ? null : id)

  const answer = (lessonId, option) => {
    setChosen((p) => ({ ...p, [lessonId]: option }))
    const lesson = LESSONS.find((l) => l.id === lessonId)
    if (option === lesson.quiz.answer) {
      setAnswered((p) => ({ ...p, [lessonId]: true }))
    }
  }

  const score = Object.values(answered).filter(Boolean).length

  return (
    <div className="page">
      <h1 className="page-title">📚 Money School</h1>

      <div className="card score-card">
        <p className="score-label">Your Score</p>
        <p className="score-val">{score} / {LESSONS.length} 🏆</p>
        <div className="score-bar-bg">
          <div className="score-bar-fill" style={{ width: `${(score / LESSONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="lessons-list">
        {LESSONS.map((lesson) => {
          const isOpen = open === lesson.id
          const done   = !!answered[lesson.id]

          return (
            <div key={lesson.id} className={`card lesson-card ${done ? 'done' : ''}`}>
              <button className="lesson-header" onClick={() => openLesson(lesson.id)}>
                <span className="lesson-emoji" style={{ background: lesson.color + '22' }}>
                  {lesson.emoji}
                </span>
                <div className="lesson-meta">
                  <p className="lesson-title">{lesson.title}</p>
                  <p className="lesson-short">{lesson.short}</p>
                </div>
                {done && <span className="badge-done">✅</span>}
                <span className="chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="lesson-body">
                  <ul className="lesson-points">
                    {lesson.content.map((pt, i) => (
                      <li key={i} className="lesson-point">💡 {pt}</li>
                    ))}
                  </ul>

                  {/* Quiz */}
                  <div className="quiz-box" style={{ borderColor: lesson.color }}>
                    <p className="quiz-question">🤔 {lesson.quiz.q}</p>
                    <div className="quiz-options">
                      {lesson.quiz.options.map((opt) => {
                        const picked = chosen[lesson.id] === opt
                        const correct = opt === lesson.quiz.answer
                        const revealed = !!chosen[lesson.id]
                        let cls = 'quiz-option'
                        if (revealed) {
                          cls += correct ? ' correct' : picked ? ' wrong' : ' dim'
                        }
                        return (
                          <button
                            key={opt}
                            className={cls}
                            onClick={() => !revealed && answer(lesson.id, opt)}
                            disabled={revealed}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                    {chosen[lesson.id] && (
                      <p className={`quiz-result ${done ? 'correct-msg' : 'wrong-msg'}`}>
                        {done ? '🎉 Correct! Great job!' : `❌ Not quite. The answer is "${lesson.quiz.answer}"`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
