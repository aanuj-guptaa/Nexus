import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { usePortalStore } from '../../../store/portalStore'

export function CyclesAdmin() {
  const { cycleWindows, toggleWindow } = usePortalStore()
  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · CYCLE MANAGEMENT</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">Goal Cycle Windows</h1>
        <div className="space-y-3">
          {cycleWindows.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center gap-5">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${w.isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.5)]' : 'bg-gray-300'}`} />
              <div className="flex-1">
                <div className="font-bold text-[14px] text-gray-900 dark:text-text-primary">{w.label}</div>
                <div className="text-[10px] text-gray-400 dark:text-text-subtle mt-0.5">{w.openDate} → {w.closeDate}</div>
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 border rounded ${w.isOpen ? 'border-green-400 dark:border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'border-gray-300 dark:border-white/15 text-gray-500 dark:text-text-muted bg-gray-50 dark:bg-bg-elevated'}`}>
                {w.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                onClick={() => toggleWindow(w.id)}
                className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded border transition-all ${w.isOpen ? 'border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-500/10' : 'border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-500 hover:bg-blue-600 dark:bg-blue-50 dark:bg-blue-600 dark:bg-blue-500/10'}`}>
                {w.isOpen ? 'Close Window' : 'Open Window'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AuditTrailAdmin() {
  const { auditLog, goalSheets, employees, unlockSheet } = usePortalStore()
  const approvedSheets = goalSheets.filter(s => s.status === 'approved')

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · AUDIT TRAIL</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-4">Audit Log</h1>

        {/* Unlock sheets */}
        {approvedSheets.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 mb-6">
            <div className="text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-3">Unlock Approved Sheets</div>
            <div className="flex flex-wrap gap-2">
              {approvedSheets.map(sh => {
                const emp = employees.find(e => e.id === sh.employeeId)
                return (
                  <motion.button key={sh.id} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={() => unlockSheet(sh.id)}
                    className="text-[11px] font-semibold border border-amber-400 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded bg-white dark:bg-bg-surface hover:bg-amber-100 dark:bg-amber-500/20 transition-all">
                    Unlock {emp?.name ?? sh.id} ↺
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-50">
            {auditLog.map((entry, i) => (
              <motion.div key={entry.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 dark:bg-bg-elevated transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-semibold text-[12px] text-gray-900 dark:text-text-primary">{entry.action}</span>
                    {entry.employeeName && <span className="text-[10px] text-blue-600 dark:text-blue-500 font-medium">re: {entry.employeeName}</span>}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-text-muted">{entry.details}</div>
                  {entry.field && (
                    <div className="text-[10px] text-gray-400 dark:text-text-subtle mt-1 font-mono">
                      {entry.field}: {entry.oldValue} → {entry.newValue}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-semibold text-gray-900 dark:text-text-primary">{entry.actorName}</div>
                  <div className="text-[9px] text-gray-400 dark:text-text-subtle">{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function HierarchyAdmin() {
  const { employees, manager } = usePortalStore()
  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · HIERARCHY</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">Org Structure</h1>
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gray-50 dark:bg-bg-elevated">
            <img src={manager.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
            <div>
              <div className="font-bold text-[13px] text-gray-900 dark:text-text-primary">{manager.name}</div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{manager.jobTitle} · Manager</div>
            </div>
          </div>
          {employees.map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
              className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:bg-bg-elevated">
              <div className="w-4 h-px bg-gray-300 ml-4" />
              <img src={emp.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{emp.name}</div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{emp.jobTitle}</div>
              </div>
              <span className="text-[10px] text-gray-500 dark:text-text-muted bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">{emp.department}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReportsAdmin() {
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('view_achievement_report').select('*').then(({ data }) => {
      if (data) setReportData(data)
      setLoading(false)
    })
  }, [])

  const csvContent = [
    ['Employee','Department','Goal','Thrust Area','Planned Target','Actual Achievement','Score','Weightage','Status'].join(','),
    ...reportData.map(r => {
      const score = r.actual_achievement !== null ? Math.round((r.actual_achievement / r.planned_target) * 100) : 0
      return [
        r.employee_name,
        r.department,
        `"${r.goal_title}"`,
        r.thrust_area,
        r.planned_target,
        r.actual_achievement ?? '',
        score + '%',
        r.weightage + '%',
        r.goal_status
      ].join(',')
    })
  ].join('\n')

  const download = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'nexus_achievement_report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · REPORTS</div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary">Achievement Report</h1>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={download}
            disabled={loading}
            className="bg-white text-black font-hero font-black text-[11px] tracking-widest uppercase px-6 py-3 rounded flex items-center gap-2 disabled:opacity-50">
            {loading ? 'Loading...' : '↓ Export CSV'}
          </motion.button>
        </div>
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-bg-elevated border-b border-gray-200 dark:border-white/10">
              <tr>
                {['Employee','Dept','Goal','Planned Target','Actual Q1','Score','W%','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">Loading achievement data...</td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">No achievements recorded yet.</td>
                </tr>
              ) : (
                reportData.map((r, gi) => {
                  const score = r.actual_achievement !== null ? Math.round((r.actual_achievement / r.planned_target) * 100) : null
                  // Grouping display helper: only show employee name on first goal of that employee
                  const showEmpName = gi === 0 || reportData[gi - 1].employee_name !== r.employee_name
                  return (
                    <motion.tr key={`${r.employee_name}-${r.goal_title}`} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: gi*0.01 }}
                      className="hover:bg-gray-50 dark:bg-bg-elevated transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-text-primary">{showEmpName ? r.employee_name : ''}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-text-muted">{showEmpName ? r.department : ''}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-text-primary">{r.goal_title}</td>
                      <td className="px-4 py-3 font-mono text-gray-900 dark:text-text-primary">{r.planned_target.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400">{r.actual_achievement !== null ? r.actual_achievement.toLocaleString() : '—'}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: score && score >= 80 ? '#16a34a' : score && score >= 50 ? '#2563eb' : '#ea580c' }}>{score !== null ? `${score}%` : '—'}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-text-muted">{r.weightage}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                          r.goal_status === 'completed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                          r.goal_status === 'on_track' ? 'bg-blue-600 dark:bg-blue-50 dark:bg-blue-600 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                          r.goal_status === 'at_risk' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                          'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10'}`}>
                          {r.goal_status.replace(/_/g,' ')}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function EscalationsAdmin() {
  const { goalSheets, employees } = usePortalStore()
  const atRisk = goalSheets.flatMap(sh => sh.goals.filter(g => g.actuals['q1']?.status === 'at_risk').map(g => ({
    goal: g, emp: employees.find(e => e.id === sh.employeeId)
  }))).filter(x => x.emp)

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · ESCALATIONS</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">At-Risk Goals</h1>
        {atRisk.length === 0 ? (
          <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-8 text-center text-gray-400 dark:text-text-subtle font-medium">
            ✓ No at-risk goals at this time
          </div>
        ) : (
          <div className="space-y-3">
            {atRisk.map(({ goal, emp }, i) => (
              <motion.div key={goal.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                className="bg-white dark:bg-bg-surface border border-red-200 dark:border-red-500/20 rounded-xl p-5 shadow-sm flex items-start gap-4">
                <span className="text-orange-500 dark:text-orange-400 text-lg mt-0.5">▲</span>
                <div className="flex-1">
                  <div className="font-bold text-[14px] text-gray-900 dark:text-text-primary">{goal.title}</div>
                  <div className="text-[10px] text-gray-500 dark:text-text-muted mt-0.5">{emp?.name} · {emp?.department}</div>
                  <div className="text-[11px] text-gray-500 dark:text-text-muted mt-1 italic">{goal.actuals['q1']?.comment || 'No comment provided'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-bold text-red-600 dark:text-red-400">AT RISK</div>
                  <div className="text-[9px] text-gray-400 dark:text-text-subtle">Target: {goal.target.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AnalyticsAdmin() {
  const { employees, goalSheets } = usePortalStore()
  const depts = [...new Set(employees.map(e => e.department))]

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">ADMIN · ANALYTICS</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">Org Performance Heatmap</h1>

        <div className="grid grid-cols-3 gap-5 mb-8">
          {depts.map((dept, i) => {
            const emps = employees.filter(e => e.department === dept)
            const scores = emps.map(emp => {
              const sh = goalSheets.find(s => s.employeeId === emp.id)
              if (!sh) return 0
              const goals = sh.goals.filter(g => g.actuals['q1']?.actual !== undefined)
              if (!goals.length) return 0
              return Math.round(goals.reduce((sum, g) => {
                const q1 = g.actuals['q1']!
                const raw = g.measurement === 'numeric_lower' ? (g.target / q1.actual!) * 100 : (q1.actual! / g.target) * 100
                return sum + (Math.min(100, raw) * g.weightage) / 100
              }, 0))
            })
            const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
            const color = avg >= 80 ? '#16a34a' : avg >= 60 ? '#2563eb' : '#ea580c'

            return (
              <motion.div key={dept} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.1 }}
                className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-2">{dept}</div>
                <div className="font-hero font-black text-[40px] leading-none mb-4" style={{ color }}>{avg}%</div>
                <div className="space-y-2">
                  {emps.map((emp, j) => {
                    const sh = goalSheets.find(s => s.employeeId === emp.id)
                    const score = sh ? Math.round(sh.goals.filter(g=>g.actuals['q1']?.actual!==undefined).reduce((sum,g) => {
                      const q1=g.actuals['q1']!; const raw=g.measurement==='numeric_lower'?(g.target/q1.actual!)*100:(q1.actual!/g.target)*100
                      return sum+(Math.min(100,raw)*g.weightage)/100
                    },0)) : 0
                    return (
                      <div key={emp.id} className="flex items-center gap-2">
                        <img src={emp.avatarUrl} className="w-5 h-5 rounded-full" alt="" />
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width:`${score}%` }} transition={{ duration:0.8, delay:j*0.1 }}
                            className="h-full rounded-full" style={{ backgroundColor: color }} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-text-muted w-8 text-right">{score}%</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
