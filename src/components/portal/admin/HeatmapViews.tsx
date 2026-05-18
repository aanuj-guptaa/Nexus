import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortalStore, computeScore } from '../../../store/portalStore'

// ─── UTILS & HELPERS ─────────────────────────────────────────────────────────

const THRUST_AREAS = ['Revenue Growth', 'Customer Experience', 'Operational Excellence', 'Product Innovation', 'Compliance & Risk']

function scoreColor(score: number, isDark: boolean): string {
  if (score === 0) return isDark ? '#1e2130' : '#f1f5f9'
  if (score >= 90) return '#10b981' // emerald-500
  if (score >= 75) return '#10b981' // emerald-500
  if (score >= 60) return '#3b82f6' // blue-500
  if (score >= 40) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
}

// Helper to calculate arc paths for Pie Chart
function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent)
  const y = Math.sin(2 * Math.PI * percent)
  return [x, y]
}

// Helpers for SVG Radial Rings
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function goalColor(score: number): string {
  if (score >= 90) return '#10b981' // emerald-500
  if (score >= 75) return '#10b981' // emerald-500
  if (score >= 60) return '#3b82f6' // blue-500
  if (score >= 40) return '#f59e0b' // amber-500
  if (score > 0) return '#ef4444' // red-500
  return '#e2e8f0'
}

// ─── 1. THRUST AREA MATRIX HEATMAP ──────────────────────────────────────────
export function ThrustAreaMatrixHeatmap() {
  const { employees, goalSheets, isDark } = usePortalStore()
  const [hoveredCell, setHoveredCell] = useState<{ emp: string; thrust: string } | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100)
    return () => clearTimeout(t)
  }, [])

  const matrix = employees.map(emp => {
    const sheet = goalSheets.find(s => s.employeeId === emp.id)
    const thrustScores: Record<string, number | null> = {}
    THRUST_AREAS.forEach(ta => {
      if (!sheet) { thrustScores[ta] = null; return }
      const goals = sheet.goals.filter(g => g.thrustArea === ta && g.actuals['q1']?.actual !== undefined)
      if (!goals.length) { thrustScores[ta] = null; return }
      const weighted = goals.reduce((sum, g) => {
        const s = computeScore(g.measurement, g.target, g.actuals['q1']!.actual!)
        return sum + (s * g.weightage) / 100
      }, 0)
      const totalW = goals.reduce((s, g) => s + g.weightage, 0)
      thrustScores[ta] = totalW ? Math.round((weighted / totalW) * 100) : null
    })
    return { emp, thrustScores }
  })

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
          ADMIN · ANALYTICS
        </div>
        <h1 className="font-black text-[38px] leading-tight tracking-tight mb-2">
          Thrust Area Matrix
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          A granular heatmap mapping strategic thrust area performance per employee.
        </p>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-8 flex-wrap bg-white dark:bg-[#18181b] p-4 rounded-xl border border-gray-200/50 dark:border-white/5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-2">Legend:</span>
          {[
            { label: 'No Data', color: isDark ? '#1e2130' : '#f1f5f9' },
            { label: '0–39% At Risk', color: '#ef4444' },
            { label: '40–59% Below Target', color: '#f59e0b' },
            { label: '60–74% On Track', color: '#3b82f6' },
            { label: '75–89% Solid', color: '#10b981' },
            { label: '90–100% Exceptional', color: '#10b981' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md shadow-inner" style={{ backgroundColor: l.color }} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {/* Header row */}
          <div className="grid border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#18181b]/50"
            style={{ gridTemplateColumns: `180px repeat(${THRUST_AREAS.length}, 1fr)` }}>
            <div className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 flex items-center">
              Employee
            </div>
            {THRUST_AREAS.map(ta => (
              <div key={ta} className="px-2 py-4 text-[10px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 text-center flex items-center justify-center leading-tight">
                {ta}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {matrix.map(({ emp, thrustScores }, ri) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: ri * 0.05 }}
              className="grid border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-[#18181b]/30 transition-colors"
              style={{ gridTemplateColumns: `180px repeat(${THRUST_AREAS.length}, 1fr)` }}
            >
              <div className="flex items-center gap-3 px-6 py-4">
                <img src={emp.avatarUrl} className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 shrink-0" alt="" />
                <div>
                  <div className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">{emp.name}</div>
                  <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{emp.department}</div>
                </div>
              </div>
              {THRUST_AREAS.map((ta, ci) => {
                const score = thrustScores[ta]
                const isHovered = hoveredCell?.emp === emp.id && hoveredCell?.thrust === ta
                return (
                  <div
                    key={ta}
                    className="flex items-center justify-center py-4 px-2 relative cursor-default"
                    onMouseEnter={() => setHoveredCell({ emp: emp.id, thrust: ta })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={revealed ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: ri * 0.05 + ci * 0.03, type: 'spring', stiffness: 220 }}
                      whileHover={{ scale: 1.15 }}
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-[12px] font-black transition-all shadow-sm"
                      style={{
                        backgroundColor: scoreColor(score ?? 0, isDark),
                        color: score !== null && score >= 40 ? '#ffffff' : isDark ? '#64748b' : '#94a3b8',
                        boxShadow: isHovered && score !== null ? `0 8px 24px ${scoreColor(score, isDark)}40` : 'none'
                      }}
                    >
                      <span>{score !== null ? `${score}%` : '—'}</span>
                    </motion.div>
                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && score !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 dark:border-black/5"
                        >
                          <span className="opacity-70 font-medium">{ta}:</span> {score}%
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 2. GOAL STATUS DISTRIBUTION (ANIMATED PIE & BAR CHARTS) ─────────────────
export function ActivityCalendarHeatmap() {
  const { goalSheets } = usePortalStore()
  const [activeSegment, setActiveSegment] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(true)
  }, [])

  // Aggregate goal statuses from all sheets
  const statusCounts = {
    completed: 0,
    on_track: 0,
    at_risk: 0,
    not_started: 0,
  }

  goalSheets.forEach(sheet => {
    sheet.goals.forEach(goal => {
      const q1Status = goal.actuals['q1']?.status || 'not_started'
      if (q1Status in statusCounts) {
        statusCounts[q1Status as keyof typeof statusCounts]++
      } else {
        statusCounts.not_started++
      }
    })
  })

  const totalGoals = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1

  const segments = [
    { label: 'Completed', count: statusCounts.completed, color: '#10b981', gradient: 'from-emerald-400 to-emerald-600' },
    { label: 'On Track', count: statusCounts.on_track, color: '#3b82f6', gradient: 'from-blue-400 to-blue-600' },
    { label: 'At Risk', count: statusCounts.at_risk, color: '#ef4444', gradient: 'from-red-400 to-red-600' },
    { label: 'Not Started', count: statusCounts.not_started, color: '#94a3b8', gradient: 'from-slate-400 to-slate-500' },
  ].filter(s => s.count > 0)

  // Pie Chart calculations
  let accumulatedPercent = 0
  const pieData = segments.map((seg, idx) => {
    const percent = seg.count / totalGoals
    const startAngle = accumulatedPercent * 360
    accumulatedPercent += percent
    const endAngle = accumulatedPercent * 360
    return {
      ...seg,
      percent,
      startAngle,
      endAngle,
      idx
    }
  })

  // Department average scores comparison
  const depts = ['Revenue', 'Product', 'Marketing']
  const deptAverages = depts.map(dept => {
    const sheets = goalSheets.filter(s => {
      // Find employee's department
      // Let's check employee info from store
      const emp = usePortalStore.getState().employees.find(e => e.id === s.employeeId)
      return emp?.department === dept
    })
    if (!sheets.length) return { dept, avg: 0 }
    let totalScore = 0
    sheets.forEach(s => {
      const goals = s.goals.filter(g => g.actuals['q1']?.actual !== undefined)
      if (!goals.length) return
      const weighted = goals.reduce((sum, g) => {
        const score = computeScore(g.measurement, g.target, g.actuals['q1']!.actual!)
        return sum + (score * g.weightage) / 100
      }, 0)
      const totalW = goals.reduce((sum, g) => sum + g.weightage, 0)
      totalScore += totalW ? (weighted / totalW) * 100 : 0
    })
    return { dept, avg: Math.round(totalScore / sheets.length) }
  })

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
          ADMIN · DASHBOARD
        </div>
        <h1 className="font-black text-[38px] leading-tight tracking-tight mb-2">
          Goal Analytics & Metrics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Interactive graphs showcasing org goal status distribution and department breakdown.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Donut/Pie Chart */}
          <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl flex flex-col">
            <h2 className="text-lg font-black tracking-tight mb-1">
              Goal Status Distribution
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Interactive visualization of Q1 2026 goal progress.
            </p>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10">
              {/* SVG Donut */}
              <div className="relative w-52 h-52 flex items-center justify-center">
                <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90 overflow-visible">
                  {pieData.map((slice, idx) => {
                    const [startX, startY] = getCoordinatesForPercent(slice.startAngle / 360)
                    const [endX, endY] = getCoordinatesForPercent(slice.endAngle / 360)
                    const largeArcFlag = slice.percent > 0.5 ? 1 : 0
                    const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
                    
                    const isHovered = activeSegment === idx
                    
                    return (
                      <motion.path
                        key={slice.label}
                        d={pathData}
                        fill={slice.color}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={revealed ? { 
                          scale: isHovered ? 1.08 : 1, 
                          opacity: 1 
                        } : {}}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 150, 
                          damping: 15,
                          delay: idx * 0.08 
                        }}
                        className="cursor-pointer origin-center transition-all duration-200 hover:brightness-110"
                        onMouseEnter={() => setActiveSegment(idx)}
                        onMouseLeave={() => setActiveSegment(null)}
                      />
                    )
                  })}
                  {/* Inner cut to make it a donut */}
                  <circle cx="0" cy="0" r="0.65" className="fill-white dark:fill-[#121214] transition-colors duration-300" />
                </svg>

                {/* Center text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <AnimatePresence mode="wait">
                    {activeSegment !== null ? (
                      <motion.div
                        key={activeSegment}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-center"
                      >
                        <span className="text-2xl font-black block leading-none" style={{ color: pieData[activeSegment].color }}>
                          {Math.round(pieData[activeSegment].percent * 100)}%
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1 block">
                          {pieData[activeSegment].label}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="total"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <span className="text-3xl font-black block leading-none text-gray-800 dark:text-white">
                          {totalGoals}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1 block">
                          Total Goals
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Legends list with anim feedback */}
              <div className="flex-1 space-y-3.5 w-full">
                {pieData.map((slice, idx) => {
                  const isHovered = activeSegment === idx
                  return (
                    <motion.div
                      key={slice.label}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isHovered 
                          ? 'bg-gray-50 dark:bg-[#18181b] border-gray-300 dark:border-white/10 shadow-sm scale-[1.02]' 
                          : 'border-transparent'
                      }`}
                      onMouseEnter={() => setActiveSegment(idx)}
                      onMouseLeave={() => setActiveSegment(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: slice.color }} />
                        <span className="text-sm font-bold">{slice.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-800 dark:text-gray-100">{slice.count}</span>
                        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 block">
                          {Math.round(slice.percent * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Department Performance Bar Chart */}
          <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight mb-1">
                Department Performance Averages
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                Comparative analysis of overall achievement levels.
              </p>
            </div>

            <div className="flex-1 flex items-end justify-around h-60 pt-6 px-4 relative">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-20">
                {[100, 75, 50, 25, 0].map(val => (
                  <div key={val} className="border-t border-dashed border-gray-400 dark:border-gray-500 w-full relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-gray-400">{val}%</span>
                  </div>
                ))}
              </div>

              {deptAverages.map((item, idx) => {
                const heightPercent = item.avg
                const barColor = item.dept === 'Revenue' ? '#3b82f6' : item.dept === 'Product' ? '#10b981' : '#f59e0b'

                return (
                  <div key={item.dept} className="flex flex-col items-center w-1/4 relative z-10 group">
                    {/* Glowing background */}
                    <div className="absolute bottom-0 w-12 rounded-t-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none filter blur-md"
                         style={{ height: `${heightPercent}%`, backgroundColor: barColor }} />

                    {/* Numeric value label */}
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={revealed ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="text-xs font-black mb-2 transition-transform duration-200 group-hover:scale-110"
                      style={{ color: barColor }}
                    >
                      {item.avg}%
                    </motion.span>

                    {/* Rising Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={revealed ? { height: `${heightPercent}%` } : {}}
                      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: idx * 0.1 }}
                      className="w-12 rounded-t-xl shadow-lg relative overflow-hidden transition-all duration-200 cursor-default"
                      style={{ backgroundColor: barColor }}
                    >
                      {/* Dynamic sheen animation inside bar */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                    </motion.div>

                    {/* Department name */}
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-wider">
                      {item.dept}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 3. GOAL PROGRESS LINE CHART & RADIAL SCORES ──────────────────────────────
export function RadialScoreHeatmap() {
  const { employees, goalSheets, isDark } = usePortalStore()
  const [hovered, setHovered] = useState<{ emp: string; goalTitle: string; score: number } | null>(null)
  const [activePoint, setActivePoint] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200)
    return () => clearTimeout(t)
  }, [])

  const empData = employees.map(emp => {
    const sheet = goalSheets.find(s => s.employeeId === emp.id)
    const goals = sheet?.goals.map(g => {
      const q1 = g.actuals['q1']
      const score = q1?.actual !== undefined ? computeScore(g.measurement, g.target, q1.actual) : 0
      return { title: g.title, score: Math.round(score), weightage: g.weightage }
    }) ?? []
    const totalScore = goals.length
      ? Math.round(goals.reduce((sum, g) => sum + (g.score * g.weightage) / 100, 0))
      : 0
    return { emp, goals, totalScore }
  })

  // Chart 3: Simulated Monthly progress milestones (Jan - Apr)
  const linePoints = [
    { label: 'Jan 01', score: 0 },
    { label: 'Jan 31', score: 32 },
    { label: 'Feb 28', score: 58 },
    { label: 'Mar 31', score: 71 },
    { label: 'Apr 15', score: 84 },
  ]

  // SVG coordinate constants
  const chartWidth = 500
  const chartHeight = 180
  const paddingX = 40
  const paddingY = 20

  const getCoordinates = (index: number, score: number) => {
    const x = paddingX + (index / (linePoints.length - 1)) * (chartWidth - paddingX * 2)
    const y = chartHeight - paddingY - (score / 100) * (chartHeight - paddingY * 2)
    return { x, y }
  }

  // Draw smooth path helper
  let pathD = ''
  linePoints.forEach((pt, idx) => {
    const { x, y } = getCoordinates(idx, pt.score)
    if (idx === 0) {
      pathD += `M ${x} ${y}`
    } else {
      const prev = getCoordinates(idx - 1, linePoints[idx - 1].score)
      const cpX1 = prev.x + (x - prev.x) / 2
      const cpY1 = prev.y
      const cpX2 = prev.x + (x - prev.x) / 2
      const cpY2 = y
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`
    }
  })

  // Area path coordinate overlay
  const lastPoint = getCoordinates(linePoints.length - 1, linePoints[linePoints.length - 1].score)
  const firstPoint = getCoordinates(0, linePoints[0].score)
  const areaD = `${pathD} L ${lastPoint.x} ${chartHeight - paddingY} L ${firstPoint.x} ${chartHeight - paddingY} Z`

  const CX = 70, CY = 70, OUTER_R = 60, INNER_R = 38

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
          ADMIN · SCORES & TRENDS
        </div>
        <h1 className="font-black text-[38px] leading-tight tracking-tight mb-2">
          Individual & Trend Analysis
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Detailed overview of individual score rings side-by-side with organization milestones trend.
        </p>

        {/* Top Section: Line Trend Graph */}
        <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black tracking-tight mb-1">
                Organization Goal Progression Trend
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Milestone completion rate progression over Q1 2026.
              </p>
            </div>
            {activePoint !== null && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 px-4 py-2 rounded-xl text-right"
              >
                <span className="text-[9px] font-bold uppercase tracking-widest text-purple-500 block">
                  {linePoints[activePoint].label} Milestone
                </span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400">
                  {linePoints[activePoint].score}% Complete
                </span>
              </motion.div>
            )}
          </div>

          {/* SVG line graph */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <motion.path
                d={areaD}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
              />

              {/* Grid Y Guidelines */}
              {[0, 25, 50, 75, 100].map(yVal => {
                const y = chartHeight - paddingY - (yVal / 100) * (chartHeight - paddingY * 2)
                return (
                  <line key={yVal} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y}
                        className="stroke-gray-100 dark:stroke-white/5" strokeWidth="1" strokeDasharray="3 3" />
                )
              })}

              {/* Glowing Line path */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={revealed ? { pathLength: 1 } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 4px 10px rgba(168, 85, 247, 0.3))' }}
              />

              {/* Chart Nodes / Dots */}
              {linePoints.map((pt, idx) => {
                const { x, y } = getCoordinates(idx, pt.score)
                const isActive = activePoint === idx
                return (
                  <g key={pt.label} className="cursor-pointer" 
                     onMouseEnter={() => setActivePoint(idx)}
                     onMouseLeave={() => setActivePoint(null)}>
                    <circle cx={x} cy={y} r={isActive ? 8 : 5} className="fill-white stroke-purple-600 dark:fill-gray-900" strokeWidth="3" />
                    {isActive && (
                      <circle cx={x} cy={y} r="14" className="stroke-purple-500/30 fill-none" strokeWidth="2" />
                    )}
                    <text x={x} y={chartHeight - 4} textAnchor="middle" className="text-[10px] font-bold fill-gray-400 dark:fill-gray-500 font-mono">
                      {pt.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Bottom Section: Radial Score Rings */}
        <h2 className="text-xl font-black tracking-tight mb-2">Goal Score Radial Rings</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Hover individual ring segments to identify target weightages and progress ratios.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {empData.map(({ emp, goals, totalScore }, ei) => {
            const totalWeight = goals.reduce((s, g) => s + g.weightage, 0) || 1
            let currentAngle = 0
            const GAP = 3

            return (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={revealed ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: ei * 0.08, type: 'spring', stiffness: 160 }}
                className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-5 shadow-lg flex flex-col items-center"
              >
                <svg width={140} height={140} className="overflow-visible mb-3">
                  {/* Background ring */}
                  <circle cx={CX} cy={CY} r={(OUTER_R + INNER_R) / 2} fill="none"
                    stroke={isDark ? '#1e2130' : '#f1f5f9'} strokeWidth={OUTER_R - INNER_R} />

                  {/* Goal segments */}
                  {goals.map((goal, gi) => {
                    const sweep = ((goal.weightage / totalWeight) * 360) - GAP
                    const startA = currentAngle
                    const endA = currentAngle + sweep
                    currentAngle += (goal.weightage / totalWeight) * 360
                    const path = describeArc(CX, CY, (OUTER_R + INNER_R) / 2, startA, endA)
                    const color = goalColor(goal.score)
                    const isH = hovered?.emp === emp.id && hovered?.goalTitle === goal.title

                    return (
                      <motion.path
                        key={gi}
                        d={path}
                        fill="none"
                        stroke={color}
                        strokeWidth={OUTER_R - INNER_R}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={revealed ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: ei * 0.05 + gi * 0.1 }}
                        style={{
                          filter: isH ? `drop-shadow(0 0 10px ${color})` : 'none',
                          cursor: 'default'
                        }}
                        onMouseEnter={() => setHovered({ emp: emp.id, goalTitle: goal.title, score: goal.score })}
                        onMouseLeave={() => setHovered(null)}
                      />
                    )
                  })}

                  {/* Center score */}
                  <text x={CX} y={CY - 5} textAnchor="middle" dominantBaseline="middle"
                    fill={totalScore >= 75 ? '#10b981' : totalScore >= 50 ? '#3b82f6' : '#ef4444'}
                    fontSize="17" fontWeight="900" fontFamily="inherit">
                    {totalScore}
                  </text>
                  <text x={CX} y={CY + 11} textAnchor="middle"
                    className="fill-gray-400 dark:fill-gray-500" fontSize="8" fontWeight="600" fontFamily="inherit">
                    SCORE
                  </text>
                </svg>

                <img src={emp.avatarUrl} className="w-8 h-8 rounded-full mb-2 border border-gray-200 dark:border-white/10" alt="" />
                <div className="text-sm font-bold text-gray-900 dark:text-white text-center leading-tight">
                  {emp.name}
                </div>
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 text-center mt-0.5">{emp.department}</div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hovered?.emp === emp.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="mt-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-xl text-center leading-tight shadow-xl"
                    >
                      {hovered.goalTitle.length > 20 ? hovered.goalTitle.slice(0, 20) + '…' : hovered.goalTitle}
                      <br /><span className="text-purple-500 font-black">{hovered.score}%</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Goal color legend */}
        <div className="flex items-center gap-4 mt-8 flex-wrap justify-center bg-white dark:bg-[#121214] p-4 rounded-xl border border-gray-200/50 dark:border-white/5">
          {[
            { label: 'No data', color: '#e2e8f0' },
            { label: '1–39% At Risk', color: '#ef4444' },
            { label: '40–59% Below Target', color: '#f59e0b' },
            { label: '60–74% On Track', color: '#3b82f6' },
            { label: '75–89% Solid Progress', color: '#10b981' },
            { label: '90–100% Exceptional', color: '#10b981' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
