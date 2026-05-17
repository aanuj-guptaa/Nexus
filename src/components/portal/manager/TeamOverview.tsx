import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortalStore, computeSheetScore } from '../../../store/portalStore'
import type { SheetStatus } from '../../../types/portal'

const STATUS_STYLE: Record<SheetStatus, string> = {
  draft: 'border-gray-300 dark:border-white/15 text-gray-500 dark:text-text-muted bg-gray-50 dark:bg-bg-elevated',
  submitted: 'border-blue-400 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-600 dark:bg-blue-50 dark:bg-blue-600 dark:bg-blue-500/10',
  approved: 'border-green-400 dark:border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10',
  rework: 'border-red-400 dark:border-red-500/40 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
}

export function ManagerTeamOverview({ onNav }: { onNav: (id: string, extra?: string) => void }) {
  const { employees, goalSheets } = usePortalStore()
  const directs = employees // In Phase 3B, employees array ONLY contains the active user's actual direct reports

  const sheetsToReview = goalSheets.filter(s => s.status === 'submitted' && directs.some(d => d.id === s.employeeId)).length
  const approved = goalSheets.filter(s => s.status === 'approved' && directs.some(d => d.id === s.employeeId)).length
  const scores = directs.map(e => {
    const sh = goalSheets.find(s => s.employeeId === e.id)
    return sh ? computeSheetScore(sh, 'q1') : 0
  })
  const avgScore = scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : 0

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">MANAGER CONSOLE</div>
        <h1 className="font-hero font-black text-[42px] leading-[0.92] tracking-tight text-gray-900 dark:text-text-primary">Your team,</h1>
        <h1 className="font-hero font-black text-[42px] leading-[0.92] tracking-tight text-blue-600 dark:text-blue-500 mb-8">at a glance.</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Direct Reports', value: directs.length, color: 'text-gray-900 dark:text-text-primary' },
            { label: 'Sheets to Review', value: sheetsToReview, color: 'text-orange-500 dark:text-orange-400' },
            { label: 'Approved Sheets', value: approved, color: 'text-green-600 dark:text-green-400' },
            { label: 'Team Avg. Score', value: `${avgScore}%`, color: 'text-gray-900 dark:text-text-primary' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-lg p-5 shadow-sm">
              <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-2">
                {s.label === 'Direct Reports' && '◉ '}
                {s.label === 'Sheets to Review' && '◷ '}
                {s.label === 'Approved Sheets' && '✓ '}
                {s.label}
              </div>
              <div className={`font-hero font-black text-[32px] leading-none ${s.color}`}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Direct Reports table */}
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
            <h2 className="font-hero font-black text-[18px] tracking-tight text-gray-900 dark:text-text-primary">Direct Reports</h2>
            <span className="text-[9px] font-bold tracking-widest text-gray-400 dark:text-text-subtle">Q1 · 2026</span>
          </div>
          <div className="divide-y divide-gray-50">
            {directs.map((emp, i) => {
              const sheet = goalSheets.find(s => s.employeeId === emp.id)
              const score = sheet ? computeSheetScore(sheet, 'q1') : 0
              const hasCheckin = sheet?.goals.some(g => g.actuals['q1']?.actual !== undefined)

              return (
                <motion.div key={emp.id}
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:bg-bg-elevated transition-colors">
                  <img src={emp.avatarUrl} className="w-9 h-9 rounded-full" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{emp.name}</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mt-0.5">{emp.jobTitle}</div>
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border rounded w-24 text-center ${STATUS_STYLE[sheet?.status ?? 'draft']}`}>
                    {(sheet?.status ?? 'DRAFT').toUpperCase()}
                  </span>
                  <span className={`text-[11px] w-32 ${hasCheckin ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-text-subtle'}`}>
                    {hasCheckin ? '✓ Check-in done' : 'Check-in pending'}
                  </span>
                  <div className="w-36 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
                      className="h-full bg-blue-600 dark:bg-blue rounded-full" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => onNav('review', emp.id)}
                    className="text-[10px] font-bold tracking-widest uppercase border border-gray-300 dark:border-white/15 rounded px-3 py-1.5 text-gray-500 dark:text-text-muted hover:border-blue-400 dark:border-blue-500/40 hover:text-blue-600 dark:text-blue-500 transition-all">
                    OPEN ›
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
