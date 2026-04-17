import { useState } from 'react'
import TopBar from './TopBar'

const LESSONS = [
  { id:'saving',  emoji:'🐷', title:'Why Save Money?',    color:'#BF5AF2', short:'Saving lets you buy bigger things later!',
    points:["Saving means keeping some money instead of spending it all.","Even saving €2 a week means €104 in a year!","A savings account earns interest — the bank pays YOU."],
    quiz:{ q:'If you save €5 every week, how much after 10 weeks?', opts:['€10','€50','€500'], answer:'€50' } },
  { id:'interest',emoji:'✨', title:'What is Interest?',  color:'#FF9F0A', short:'Your money grows while you sleep!',
    points:["Interest is extra money the bank pays you for saving.","€100 at 5% interest earns you €5 extra.","Compound interest means you earn interest on your interest too!"],
    quiz:{ q:'You have €200 at 5% interest. How much do you earn?', opts:['€5','€10','€20'], answer:'€10' } },
  { id:'budget',  emoji:'📊', title:'Budgeting Basics',   color:'#30D158', short:'Plan where your money goes!',
    points:["A budget is a plan for spending and saving.","List all your income first, then decide how to spend it.","A good rule: save at least 20% of everything you receive."],
    quiz:{ q:'You get €10 pocket money. Saving 20%, how much do you save?', opts:['€1','€2','€5'], answer:'€2' } },
  { id:'needs',   emoji:'🛒', title:'Needs vs Wants',     color:'#0A84FF', short:'Know the difference!',
    points:["NEEDS are essentials: food, shelter, clothes.","WANTS are nice-to-haves: games, sweets, toys.","Ask yourself before buying: need or want?"],
    quiz:{ q:'Which is a NEED?', opts:['New video game','Lunch at school','Movie ticket'], answer:'Lunch at school' } },
  { id:'goals',   emoji:'🎯', title:'Setting Money Goals', color:'#FF453A', short:'Work towards something you really want!',
    points:["A goal is something specific you are saving for.","Divide the cost by your weekly savings to find your timeline.","Put money aside every week — you will get there!"],
    quiz:{ q:'A game costs €30. You save €5/week. How many weeks?', opts:['3 weeks','6 weeks','10 weeks'], answer:'6 weeks' } },
  { id:'smart',   emoji:'🧠', title:'Smart Spending',     color:'#5AC8FA', short:'Get more for your money!',
    points:["Compare prices before you buy.","Wait 24 hours before big purchases — the urge may pass!","Look for sales and discounts to stretch your money."],
    quiz:{ q:'What's a good rule before buying something expensive?', opts:['Buy immediately','Wait 24 hours','Ask a friend'], answer:'Wait 24 hours' } },
]

export default function Learn() {
  const [open, setOpen]       = useState(null)
  const [chosen, setChosen]   = useState({})
  const [correct, setCorrect] = useState({})

  const answer = (id, opt, ans) => {
    if (chosen[id]) return
    setChosen(p => ({ ...p, [id]: opt }))
    if (opt === ans) setCorrect(p => ({ ...p, [id]: true }))
  }

  const score = Object.keys(correct).length

  return (
    <div className="ios-page">
      <TopBar title="Money School" />
      <div className="ios-content">

        {/* Score */}
        <div className="learn-score-card">
          <div className="learn-score-nums">
            <span className="learn-score-big">{score}</span>
            <span className="learn-score-sep">/</span>
            <span className="learn-score-tot">{LESSONS.length}</span>
          </div>
          <p className="learn-score-label">Lessons Complete</p>
          <div className="progress-track" style={{marginTop: 12}}>
            <div className="progress-fill" style={{ width: `${(score/LESSONS.length)*100}%` }} />
          </div>
        </div>

        {/* Lessons */}
        <div className="ios-section-label">Lessons</div>
        <div className="ios-group">
          {LESSONS.map((l, i) => {
            const isOpen  = open === l.id
            const isDone  = !!correct[l.id]
            const picked  = chosen[l.id]
            return (
              <div key={l.id}>
                <button className="ios-row lesson-row" onClick={() => setOpen(isOpen ? null : l.id)}>
                  <span className="lesson-bubble" style={{ background: l.color + '30' }}>{l.emoji}</span>
                  <div className="lesson-row-body">
                    <span className="lesson-row-title">{l.title}</span>
                    <span className="lesson-row-sub">{l.short}</span>
                  </div>
                  {isDone && <span className="lesson-check">✓</span>}
                  <span className="ios-chevron" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                </button>

                {isOpen && (
                  <div className="lesson-expand">
                    <ul className="lesson-bullets">
                      {l.points.map((p, j) => <li key={j} className="lesson-bullet">💡 {p}</li>)}
                    </ul>
                    <div className="quiz-card" style={{ borderColor: l.color + '60' }}>
                      <p className="quiz-q">🤔 {l.quiz.q}</p>
                      {l.quiz.opts.map(opt => {
                        const isAnswer = opt === l.quiz.answer
                        const isPicked = picked === opt
                        let cls = 'quiz-opt'
                        if (picked) cls += isAnswer ? ' opt-correct' : isPicked ? ' opt-wrong' : ' opt-dim'
                        return (
                          <button key={opt} className={cls} onClick={() => answer(l.id, opt, l.quiz.answer)} disabled={!!picked}>
                            {opt}
                          </button>
                        )
                      })}
                      {picked && (
                        <p className={isDone ? 'quiz-msg correct-msg' : 'quiz-msg wrong-msg'}>
                          {isDone ? '🎉 Correct!' : `Answer: "${l.quiz.answer}"`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {i < LESSONS.length - 1 && <div className="ios-sep ios-sep-inset" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
