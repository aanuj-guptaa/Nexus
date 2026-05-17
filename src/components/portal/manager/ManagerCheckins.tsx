import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortalStore, computeScore } from '../../../store/portalStore'
import type { Quarter } from '../../../types/portal'

const QUARTERS: { id: Quarter; label: string }[] = [
  { id: 'q1', label: 'Q1 · Apr' },
  { id: 'q2', label: 'Q2 · Jul' },
  { id: 'q3', label: 'Q3 · Oct' },
  { id: 'annual', label: 'Annual · Jan' },
]

export function ManagerCheckins() {
  const { employees, goalSheets, manager, updateCheckin } = usePortalStore()
  const directs = employees.filter(e => manager.directReportIds.includes(e.id))
  const [selectedId, setSelectedId] = useState(directs[0]?.id ?? '')
  const [selectedQ, setSelectedQ] = useState<Quarter>('q1')

  const emp = employees.find(e => e.id === selectedId)
  const sheet = goalSheets.find(s => s.employeeId === selectedId)

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">MANAGER · QUARTERLY CHECK-INS</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-6">
          Planned vs. Actual.
        </h1>

        {/* Completion status */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {directs.map(e => {
            const sh = goalSheets.find(s => s.employeeId === e.id)
            const done = sh?.goals.some(g => g.actuals['q1']?.actual !== undefined)
            return (
              <div key={e.id} className={`flex items-center gap-2 p-3 rounded-lg border text-[10px] ${done ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'bg-white dark:bg-bg-surface border-gray-200 dark:border-white/10'}`}>
                <img src={e.avatarUrl} className="w-5 h-5 rounded-full" alt="" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-text-primary">{e.name.split(' ')[0]}</div>
                  <div className={`text-[8px] font-bold ${done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-text-subtle'}`}>{done ? '✓ Done' : 'Pending'}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Employee + Quarter selector */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex gap-1">
            {directs.map(e => (
              <button key={e.id} onClick={() => setSelectedId(e.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-medium border transition-all ${selectedId === e.id ? 'bg-white text-black border-white' : 'bg-white dark:bg-bg-surface text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10 hover:border-gray-400 dark:border-white/20'}`}>
                {e.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-gray-300 self-center" />
          <div className="flex gap-1">
            {QUARTERS.map(q => (
              <button key={q.id} onClick={() => setSelectedQ(q.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-medium border transition-all ${selectedQ === q.id ? 'bg-blue-600 dark:bg-blue text-white border-blue-600' : 'bg-white dark:bg-bg-surface text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10 hover:border-gray-400 dark:border-white/20'}`}>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {emp && sheet && (
          <AnimatePresence mode="wait">
            <motion.div key={`${selectedId}-${selectedQ}`} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ duration: 0.2 }}>
              <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/5">
                  <img src={emp.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                  <div>
                    <div className="font-bold text-[13px] text-gray-900 dark:text-text-primary">{emp.name}</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{emp.jobTitle}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500">{QUARTERS.find(q=>q.id===selectedQ)?.label}</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {sheet.goals.map(g => {
                    const entry = g.actuals[selectedQ]
                    const score = entry?.actual !== undefined ? Math.round(computeScore(g.measurement, g.target, entry.actual)) : null

                    return (
                      <div key={g.id} className="px-6 py-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{g.title}</div>
                            <div className="text-[10px] text-gray-400 dark:text-text-subtle">{g.thrustArea} · Weightage: {g.weightage}%</div>
                          </div>
                          {score !== null && (
                            <div className="font-hero font-black text-[20px] text-blue-600 dark:text-blue-500 leading-none">{score}%</div>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div className="bg-gray-50 dark:bg-bg-elevated rounded-lg p-3">
                            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">Planned Target</div>
                            <div className="font-bold text-[14px] text-gray-900 dark:text-text-primary">{g.target.toLocaleString()}</div>
                          </div>
                          <div className={`rounded-lg p-3 ${entry?.actual !== undefined ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-gray-50 dark:bg-bg-elevated'}`}>
                            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">Actual</div>
                            <div className="font-bold text-[14px] text-blue-600 dark:text-blue-400">{entry?.actual?.toLocaleString() ?? '—'}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-bg-elevated rounded-lg p-3">
                            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">Employee Comment</div>
                            <div className="text-[11px] text-gray-500 dark:text-text-muted italic">{entry?.comment || 'No comment'}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-bg-elevated rounded-lg p-3">
                            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">Manager Comment</div>
                            <input
                              value={entry?.managerComment ?? ''}
                              onChange={e => updateCheckin(sheet.id, g.id, selectedQ, { managerComment: e.target.value })}
                              placeholder="Add your comment..."
                              className="w-full text-[11px] text-gray-900 dark:text-text-primary bg-transparent outline-none placeholder-gray-300 dark:placeholder-white/20" />
                          </div>
                        </div>

                        {score !== null && (
                          <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${score}%` }} transition={{ duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ background: score >= 80 ? '#16a34a' : score >= 50 ? '#2563eb' : '#ea580c' }} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
