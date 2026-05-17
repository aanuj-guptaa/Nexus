import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortalStore, computeScore, computeSheetScore } from '../../../store/portalStore'
import type { Goal, MeasurementType } from '../../../types/portal'

const THRUST_AREAS = ['Revenue Growth', 'Customer Experience', 'Operational Excellence', 'Compliance & Risk', 'People & Culture', 'Product Innovation']
const MEASUREMENTS: { value: MeasurementType; label: string }[] = [
  { value: 'numeric_higher', label: 'Numeric (Higher is better)' },
  { value: 'numeric_lower', label: 'Numeric (Lower is better)' },
  { value: 'percent_higher', label: '% (Higher is better)' },
  { value: 'zero_based', label: 'Zero-based' },
]

const STATUS_STYLES: Record<string, string> = {
  not_started: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10',
  on_track: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20',
  completed: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  at_risk: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
}
const STATUS_LABELS: Record<string, string> = {
  not_started: 'NOT STARTED', on_track: 'ON TRACK', completed: 'COMPLETED', at_risk: 'AT RISK',
}

function GoalCard({ goal, locked, onUpdate, onRemove }: {
  goal: Goal; locked: boolean
  onUpdate: (id: string, u: Partial<Goal>) => void
  onRemove: (id: string) => void
}) {
  const q1 = goal.actuals['q1']
  const actual = q1?.actual ?? 0
  const score = goal.target ? computeScore(goal.measurement, goal.target, actual) : 0
  const pct = Math.min(100, score)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden mb-3 shadow-sm"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-white/5">
        <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">Goal</span>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border rounded ${STATUS_STYLES[q1?.status ?? 'not_started']}`}>
            {STATUS_LABELS[q1?.status ?? 'not_started']}
          </span>
          {!locked && (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(goal.id)}
              className="text-gray-300 dark:text-white/30 hover:text-red-600 dark:text-red-400 text-[14px] leading-none ml-1 transition-colors">×</motion.button>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Title */}
        <input
          disabled={locked}
          value={goal.title}
          onChange={e => onUpdate(goal.id, { title: e.target.value })}
          placeholder="Goal title..."
          className="w-full font-bold text-[16px] text-gray-900 dark:text-text-primary bg-transparent border-none outline-none mb-2 placeholder-gray-300 dark:placeholder-white/20 disabled:cursor-default"
        />
        {/* Description */}
        <textarea
          disabled={locked}
          value={goal.description}
          onChange={e => onUpdate(goal.id, { description: e.target.value })}
          placeholder="Describe what success looks like..."
          rows={2}
          className="w-full text-[12px] text-gray-500 dark:text-text-muted bg-gray-50 dark:bg-bg-elevated border border-gray-200 dark:border-white/10 rounded px-3 py-2 resize-none outline-none focus:border-blue-300 dark:border-blue-500/30 transition-colors disabled:cursor-default mb-4"
        />

        {/* Fields row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Thrust Area</label>
            <select disabled={locked} value={goal.thrustArea} onChange={e => onUpdate(goal.id, { thrustArea: e.target.value })}
              className="w-full text-[11px] border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 bg-white dark:bg-bg-surface outline-none focus:border-blue-300 dark:border-blue-500/30 disabled:bg-gray-50 dark:bg-bg-elevated disabled:cursor-default">
              {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Measurement</label>
            <select disabled={locked} value={goal.measurement} onChange={e => onUpdate(goal.id, { measurement: e.target.value as MeasurementType })}
              className="w-full text-[11px] border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 bg-white dark:bg-bg-surface outline-none focus:border-blue-300 dark:border-blue-500/30 disabled:bg-gray-50 dark:bg-bg-elevated disabled:cursor-default">
              {MEASUREMENTS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Target</label>
            <input type="number" disabled={locked} value={goal.target || ''}
              onChange={e => onUpdate(goal.id, { target: Number(e.target.value) })}
              className="w-full text-[11px] text-gray-900 dark:text-text-primary bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 outline-none focus:border-blue-300 dark:border-blue-500/30 disabled:bg-gray-50 dark:disabled:bg-bg-elevated disabled:cursor-default" />
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Weightage %</label>
            <input type="number" disabled={locked} value={goal.weightage}
              onChange={e => onUpdate(goal.id, { weightage: Number(e.target.value) })}
              min={10} max={100}
              className="w-full text-[11px] text-gray-900 dark:text-text-primary bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded px-2 py-1.5 outline-none focus:border-blue-300 dark:border-blue-500/30 disabled:bg-gray-50 dark:disabled:bg-bg-elevated disabled:cursor-default" />
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Progress Score</label>
            <div className="text-[13px] font-bold text-gray-900 dark:text-text-primary py-1.5">{Math.round(score)}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: pct >= 90 ? '#16a34a' : pct >= 60 ? '#2563eb' : '#ea580c' }}
            />
          </div>
          <span className="text-[9px] text-gray-400 dark:text-text-subtle w-16">
            {goal.target ? `Target: ${goal.target.toLocaleString()}` : ''}
          </span>
          <span className="text-[9px] text-gray-400 dark:text-text-subtle w-16 text-right">
            {actual ? `Actual: ${actual.toLocaleString()}` : '—'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function GoalSheet() {
  const { goalSheets, activeUserId, updateGoalInSheet, addGoalToSheet, removeGoalFromSheet, submitSheet } = usePortalStore()
  const [showReworkNote, setShowReworkNote] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const sheet = goalSheets.find(s => s.employeeId === activeUserId)
  if (!sheet) return null

  const locked = sheet.status === 'approved'
  const totalW = sheet.goals.reduce((s, g) => s + g.weightage, 0)
  const projectedScore = computeSheetScore(sheet, 'q1')
  const wError = totalW !== 100
  const canSubmit = !wError && sheet.goals.length > 0 && sheet.status !== 'approved' && sheet.status !== 'submitted'

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    submitSheet(sheet.id)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Breadcrumb */}
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">
          CYCLE 2026 · MY GOAL SHEET
        </div>

        {/* Hero heading */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-hero font-black text-[42px] leading-[0.95] tracking-tight text-gray-900 dark:text-text-primary">
              Build the year.
            </h1>
            <h1 className="font-hero font-black text-[42px] leading-[0.95] tracking-tight text-blue-600 dark:text-blue-500">
              Own the outcome.
            </h1>
            <p className="text-[12px] text-gray-500 dark:text-text-muted mt-3 max-w-[380px]">
              Set up to 8 goals with weightages adding up to 100%. Submit before the window closes.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded border ${
              sheet.status === 'approved' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' :
              sheet.status === 'submitted' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
              sheet.status === 'rework' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
              'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10'
            }`}>
              {sheet.status.toUpperCase()}
            </span>
            {sheet.status !== 'approved' && (
              <button className="text-[10px] text-blue-600 dark:text-blue-500 underline">Sheet locked</button>
            )}
          </div>
        </div>

        {/* Rework notice */}
        <AnimatePresence>
          {sheet.status === 'rework' && showReworkNote && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-5 py-4 mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-red-500 mb-1">Sent for Rework</div>
                <p className="text-[12px] text-red-600 dark:text-red-400">{sheet.reworkComment}</p>
              </div>
              <button onClick={() => setShowReworkNote(false)} className="text-red-300 hover:text-red-500 text-lg">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Weightage', value: `${totalW}%`, color: totalW === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-500', bar: totalW },
            { label: 'Goals Added', value: `${sheet.goals.length}/8`, color: 'text-gray-900 dark:text-text-primary', bar: (sheet.goals.length / 8) * 100 },
            { label: 'Projected Score', value: `${projectedScore}%`, color: 'text-blue-600 dark:text-blue-500', bar: projectedScore },
            { label: 'Window', value: 'OPEN', color: 'text-green-600 dark:text-green-400', sub: 'Jan 1 – Jan 31' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
              <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">{s.label}</div>
              <div className={`font-hero font-black text-[26px] leading-none ${s.color}`}>{s.value}</div>
              {s.sub && <div className="text-[9px] text-gray-400 dark:text-text-subtle mt-1">{s.sub}</div>}
              {s.bar !== undefined && (
                <div className="mt-2 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${Math.min(100, s.bar)}%` }} transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-current" style={{ color: s.color.includes('green') ? '#16a34a' : s.color.includes('blue') ? '#2563eb' : s.color.includes('red') ? '#dc2626' : '#111' }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Weightage warning */}
        <AnimatePresence>
          {wError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded px-4 py-2 mb-4 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <span>⚠</span>
              <span>Total weightage is <strong>{totalW}%</strong> — must equal exactly 100% before submitting.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal cards */}
        <AnimatePresence mode="popLayout">
          {sheet.goals.map(g => (
            <GoalCard key={g.id} goal={g} locked={locked}
              onUpdate={(id, u) => updateGoalInSheet(sheet.id, id, u)}
              onRemove={id => removeGoalFromSheet(sheet.id, id)} />
          ))}
        </AnimatePresence>

        {/* Add goal + Submit */}
        {!locked && (
          <div className="flex items-center gap-4 mt-4">
            {sheet.goals.length < 8 && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => addGoalToSheet(sheet.id)}
                className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-text-muted border border-dashed border-gray-300 dark:border-white/15 rounded-lg px-5 py-3 hover:border-blue-400 dark:border-blue-500/40 hover:text-blue-600 dark:text-blue-500 transition-all">
                + Add Goal
              </motion.button>
            )}
            <motion.button
              whileHover={canSubmit ? { scale: 1.02, boxShadow: '0 4px 20px rgba(37,99,235,0.3)' } : {}}
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`ml-auto px-8 py-3 rounded font-hero font-black text-[11px] tracking-widest uppercase transition-all ${canSubmit ? 'bg-blue-600 dark:bg-blue text-white hover:bg-blue-600 dark:bg-blue-dim' : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-text-subtle cursor-not-allowed'}`}>
              {submitting ? (
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>Submitting…</motion.span>
              ) : sheet.status === 'submitted' ? 'Submitted ✓' : 'Submit Sheet'}
            </motion.button>
          </div>
        )}

        {locked && (
          <div className="mt-4 text-center text-[11px] text-gray-400 dark:text-text-subtle border border-gray-200 dark:border-white/10 rounded-lg py-4 bg-white dark:bg-bg-surface">
            🔒 This goal sheet is locked after manager approval. Contact Admin to request changes.
          </div>
        )}
      </div>
    </div>
  )
}
