import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortalStore, computeScore } from '../../../store/portalStore'
// import type { Goal } from '../../../types/portal'

export function ReviewSheets({ focusEmployeeId }: { focusEmployeeId?: string }) {
  const { employees, goalSheets, manager, approveSheet, sendForRework, updateGoalInSheet } = usePortalStore()
  const directs = employees.filter(e => manager.directReportIds.includes(e.id))
  const [selectedId, setSelectedId] = useState(focusEmployeeId ?? directs[0]?.id ?? '')
  const [reworkComment, setReworkComment] = useState('')
  const [showReworkInput, setShowReworkInput] = useState(false)
  const [sending, setSending] = useState(false)

  const emp = employees.find(e => e.id === selectedId)
  const sheet = goalSheets.find(s => s.employeeId === selectedId)
  const canAct = sheet?.status === 'submitted'

  const handleApprove = async () => {
    setSending(true)
    await new Promise(r => setTimeout(r, 600))
    approveSheet(sheet!.id)
    setSending(false)
  }

  const handleRework = async () => {
    if (!reworkComment.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 500))
    sendForRework(sheet!.id, reworkComment)
    setShowReworkInput(false)
    setReworkComment('')
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">MANAGER · REVIEW SHEETS</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-6">
          Review goal sheets.
        </h1>

        {/* Employee selector */}
        <div className="flex gap-2 flex-wrap mb-8">
          {directs.map(e => {
            const sh = goalSheets.find(s => s.employeeId === e.id)
            return (
              <motion.button key={e.id} whileTap={{ scale: 0.96 }}
                onClick={() => { setSelectedId(e.id); setShowReworkInput(false) }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium transition-all ${
                  selectedId === e.id ? 'bg-white text-black border-white' : 'bg-white dark:bg-bg-surface text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10 hover:border-gray-400 dark:border-white/20'
                }`}>
                <img src={e.avatarUrl} className="w-5 h-5 rounded-full" alt="" />
                {e.name.split(' ')[0]}
                <span className={`text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                  sh?.status === 'submitted' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  sh?.status === 'approved' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                  sh?.status === 'rework' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted'
                }`}>{sh?.status ?? 'draft'}</span>
              </motion.button>
            )
          })}
        </div>

        {emp && sheet && (
          <AnimatePresence mode="wait">
            <motion.div key={selectedId} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ duration: 0.25 }}>

              {/* Sheet header */}
              <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img src={emp.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <div className="font-bold text-[15px] text-gray-900 dark:text-text-primary">{emp.name}</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{emp.jobTitle}</div>
                  </div>
                  <div className={`ml-auto text-[9px] font-bold tracking-widest uppercase px-3 py-1 border rounded ${
                    sheet.status === 'approved' ? 'border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10' :
                    sheet.status === 'submitted' ? 'border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' :
                    sheet.status === 'rework' ? 'border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10' :
                    'border-gray-200 dark:border-white/10 text-gray-500 dark:text-text-muted bg-gray-50 dark:bg-bg-elevated'}`}>
                    {sheet.status.toUpperCase()}
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-3">
                  {sheet.goals.map(g => {
                    const q1 = g.actuals['q1']
                    const score = q1?.actual !== undefined ? Math.round(computeScore(g.measurement, g.target, q1.actual)) : null

                    return (
                      <div key={g.id} className="border border-gray-100 dark:border-white/5 rounded-lg p-4 hover:border-gray-200 dark:border-white/10 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{g.title}</div>
                            <div className="text-[10px] text-gray-400 dark:text-text-subtle mt-0.5">{g.thrustArea} · {g.measurement.replace(/_/g,' ')}</div>
                          </div>
                          {score !== null && (
                            <div className="font-hero font-black text-[18px] text-blue-600 dark:text-blue-500">{score}%</div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Target</label>
                            <input type="number" disabled={!canAct} value={g.target}
                              onChange={e => updateGoalInSheet(sheet.id, g.id, { target: Number(e.target.value) })}
                              className="w-full text-[12px] text-gray-900 dark:text-text-primary bg-white dark:bg-bg-elevated border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 disabled:bg-gray-50 dark:disabled:bg-bg-elevated/40 disabled:text-gray-400 dark:disabled:text-text-muted" />
                          </div>
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Weightage %</label>
                            <input type="number" disabled={!canAct} value={g.weightage}
                              onChange={e => updateGoalInSheet(sheet.id, g.id, { weightage: Number(e.target.value) })}
                              className="w-full text-[12px] text-gray-900 dark:text-text-primary bg-white dark:bg-bg-elevated border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 disabled:bg-gray-50 dark:disabled:bg-bg-elevated/40 disabled:text-gray-400 dark:disabled:text-text-muted" />
                          </div>
                          <div>
                            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Thrust Area</label>
                            <div className="text-[12px] text-gray-500 dark:text-text-muted py-1.5">{g.thrustArea}</div>
                          </div>
                        </div>

                        {score !== null && (
                          <div className="mt-3 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
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

              {/* Actions */}
              {canAct && !sending && (
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }} whileTap={{ scale: 0.96 }}
                    onClick={handleApprove}
                    className="bg-green-600 text-white font-hero font-black text-[11px] tracking-widest uppercase px-8 py-3 rounded">
                    Approve ✓
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setShowReworkInput(v => !v)}
                    className="bg-white dark:bg-bg-surface border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 font-hero font-black text-[11px] tracking-widest uppercase px-8 py-3 rounded">
                    Send for Rework
                  </motion.button>
                </div>
              )}

              {sending && (
                <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:0.8, repeat:Infinity }}
                  className="text-[12px] text-gray-500 dark:text-text-muted">Processing…</motion.div>
              )}

              <AnimatePresence>
                {showReworkInput && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                    className="mt-4 overflow-hidden">
                    <textarea value={reworkComment} onChange={e => setReworkComment(e.target.value)}
                      rows={3} placeholder="Explain what needs to change..."
                      className="w-full border border-gray-300 dark:border-white/15 rounded-lg px-4 py-3 text-[12px] text-gray-900 dark:text-text-primary outline-none focus:border-red-400 dark:border-red-500/40 resize-none" />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      onClick={handleRework}
                      className="mt-2 bg-red-600 text-white font-hero font-black text-[11px] tracking-widest uppercase px-6 py-2.5 rounded">
                      Send Rework Request
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {sheet.status === 'approved' && (
                <div className="text-[11px] text-gray-400 dark:text-text-subtle border border-gray-200 dark:border-white/10 rounded-lg py-4 px-5 bg-white dark:bg-bg-surface text-center">
                  ✓ This sheet has been approved and locked.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
