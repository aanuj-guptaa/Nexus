import { motion } from 'framer-motion'
import { usePortalStore, computeScore } from '../../../store/portalStore'
import type { Quarter, GoalStatus } from '../../../types/portal'

const QUARTERS: { id: Quarter; label: string }[] = [
  { id: 'q1', label: 'Q1 · Apr' },
  { id: 'q2', label: 'Q2 · Jul' },
  { id: 'q3', label: 'Q3 · Oct' },
  { id: 'annual', label: 'Annual · Jan' },
]
const STATUSES: GoalStatus[] = ['not_started', 'on_track', 'completed', 'at_risk']
const STATUS_LABELS: Record<GoalStatus, string> = { not_started:'Not Started', on_track:'On Track', completed:'Completed', at_risk:'At Risk' }
const WINDOWS_OPEN: Record<Quarter, boolean> = { q1: true, q2: false, q3: false, annual: false }

export function QuarterlyCheckin() {
  const { goalSheets, employees, activeUserId, updateCheckin } = usePortalStore()
  const sheet = goalSheets.find(s => s.employeeId === activeUserId)
  const employee = employees.find(e => e.id === activeUserId)
  if (!sheet || !employee) return null

  const locked = sheet.status !== 'approved'

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">CYCLE 2026 · QUARTERLY CHECK-IN</div>
        <h1 className="font-hero font-black text-[40px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-2">Track your progress.</h1>
        <h2 className="font-hero font-black text-[40px] leading-none tracking-tight text-blue-600 dark:text-blue-500 mb-6">Quarter by quarter.</h2>

        {locked && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-5 py-3 mb-6 text-[11px] text-amber-600 dark:text-amber-400">
            ⚠ Your goal sheet must be approved before you can log quarterly check-ins.
          </div>
        )}

        {QUARTERS.map(({ id: qid, label }) => {
          const isOpen = WINDOWS_OPEN[qid]
          return (
            <motion.div key={qid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl mb-5 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="font-hero font-black text-[18px] tracking-tight text-gray-900 dark:text-text-primary">{label}</div>
                <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border ${isOpen ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-text-subtle border-gray-200 dark:border-white/10'}`}>
                  {isOpen ? 'WINDOW OPEN' : 'CLOSED'}
                </span>
              </div>

              {!isOpen && (
                <div className="px-6 py-4 text-[11px] text-gray-400 dark:text-text-subtle italic">
                  This window is not yet open. Check-ins will be available when the window opens.
                </div>
              )}

              {isOpen && (
                <div className="divide-y divide-gray-50">
                  {sheet.goals.map(g => {
                    const entry = g.actuals[qid]
                    const actual = entry?.actual ?? ''
                    const score = g.target && entry?.actual !== undefined
                      ? Math.round(computeScore(g.measurement, g.target, entry.actual!))
                      : null

                    return (
                      <div key={g.id} className="px-6 py-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{g.title}</div>
                            <div className="text-[10px] text-gray-400 dark:text-text-subtle mt-0.5">{g.thrustArea} · Target: {g.target.toLocaleString()}</div>
                          </div>
                          {score !== null && (
                            <div className="text-right">
                              <div className="font-hero font-black text-[20px] text-blue-600 dark:text-blue-500 leading-none">{score}%</div>
                              <div className="text-[9px] text-gray-400 dark:text-text-subtle">score</div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Actual</label>
                            <input type="number" disabled={locked || !isOpen}
                              value={actual}
                              onChange={e => updateCheckin(sheet.id, g.id, qid, { actual: Number(e.target.value) })}
                              placeholder={`Target: ${g.target}`}
                              className="w-full text-[12px] border border-gray-200 dark:border-white/10 rounded px-3 py-2 outline-none focus:border-blue-400 dark:border-blue-500/40 disabled:bg-gray-50 dark:bg-bg-elevated" />
                          </div>
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Status</label>
                            <select disabled={locked || !isOpen}
                              value={entry?.status ?? 'not_started'}
                              onChange={e => updateCheckin(sheet.id, g.id, qid, { status: e.target.value as GoalStatus })}
                              className="w-full text-[12px] border border-gray-200 dark:border-white/10 rounded px-3 py-2 outline-none focus:border-blue-400 dark:border-blue-500/40 disabled:bg-gray-50 dark:bg-bg-elevated">
                              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Comment</label>
                            <input disabled={locked || !isOpen}
                              value={entry?.comment ?? ''}
                              onChange={e => updateCheckin(sheet.id, g.id, qid, { comment: e.target.value })}
                              placeholder="Add a note..."
                              className="w-full text-[12px] border border-gray-200 dark:border-white/10 rounded px-3 py-2 outline-none focus:border-blue-400 dark:border-blue-500/40 disabled:bg-gray-50 dark:bg-bg-elevated" />
                          </div>
                        </div>

                        {score !== null && (
                          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
                              className="h-full rounded-full"
                              style={{ background: score >= 90 ? '#16a34a' : score >= 60 ? '#2563eb' : '#ea580c' }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
