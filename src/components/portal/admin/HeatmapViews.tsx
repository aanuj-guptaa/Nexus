import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePortalStore, computeScore } from '../../../store/portalStore'

// ─── 1. THRUST AREA MATRIX HEATMAP ──────────────────────────────────────────
// Cross-tab: employees vs thrust areas, colored by performance score

const THRUST_AREAS = ['Revenue Growth', 'Customer Experience', 'Operational Excellence', 'Product Innovation', 'Compliance & Risk']

function scoreColor(score: number, isDark: boolean): string {
  if (score === 0) return isDark ? '#1e2130' : '#f1f5f9'
  if (score >= 90) return '#16a34a'
  if (score >= 75) return '#22c55e'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

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
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-4">
          ADMIN · HEATMAP · MATRIX
        </div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-2">
          Thrust Area Performance Matrix
        </h1>
        <p className="text-[12px] text-gray-400 dark:text-text-subtle mb-8">
          Cross-tab of each employee's score per strategic thrust area (Q1 · 2026)
        </p>

        {/* Legend */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {[
            { label: 'No Data', color: isDark ? '#1e2130' : '#f1f5f9' },
            { label: '0–39%', color: '#ef4444' },
            { label: '40–59%', color: '#f59e0b' },
            { label: '60–74%', color: '#3b82f6' },
            { label: '75–89%', color: '#22c55e' },
            { label: '90–100%', color: '#16a34a' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] text-gray-500 dark:text-text-muted">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg">
          {/* Header row */}
          <div className="grid border-b border-gray-100 dark:border-white/5"
            style={{ gridTemplateColumns: `160px repeat(${THRUST_AREAS.length}, 1fr)` }}>
            <div className="px-4 py-3 text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">
              Employee
            </div>
            {THRUST_AREAS.map(ta => (
              <div key={ta} className="px-2 py-3 text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-text-subtle text-center leading-tight">
                {ta.replace(' & ', ' &\n')}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {matrix.map(({ emp, thrustScores }, ri) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, x: -16 }}
              animate={revealed ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: ri * 0.07 }}
              className="grid border-b border-gray-50 dark:border-white/5 last:border-0"
              style={{ gridTemplateColumns: `160px repeat(${THRUST_AREAS.length}, 1fr)` }}
            >
              <div className="flex items-center gap-2.5 px-4 py-3">
                <img src={emp.avatarUrl} className="w-6 h-6 rounded-full shrink-0" alt="" />
                <div>
                  <div className="text-[11px] font-semibold text-gray-900 dark:text-text-primary leading-none">{emp.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-gray-400 dark:text-text-subtle">{emp.department}</div>
                </div>
              </div>
              {THRUST_AREAS.map((ta, ci) => {
                const score = thrustScores[ta]
                const isHovered = hoveredCell?.emp === emp.id && hoveredCell?.thrust === ta
                return (
                  <div
                    key={ta}
                    className="flex items-center justify-center py-3 px-1 relative cursor-default"
                    onMouseEnter={() => setHoveredCell({ emp: emp.id, thrust: ta })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={revealed ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.35, delay: ri * 0.07 + ci * 0.04, type: 'spring', stiffness: 200 }}
                      whileHover={{ scale: 1.15 }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all"
                      style={{
                        backgroundColor: scoreColor(score ?? 0, isDark),
                        color: score !== null && score >= 40 ? 'white' : isDark ? '#475569' : '#94a3b8',
                        boxShadow: isHovered && score !== null ? `0 0 16px ${scoreColor(score, isDark)}80` : 'none'
                      }}
                    >
                      {score !== null ? `${score}` : '—'}
                    </motion.div>
                    {/* Tooltip */}
                    {isHovered && score !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none"
                      >
                        {ta}: {score}%
                      </motion.div>
                    )}
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

// ─── 2. ACTIVITY CALENDAR HEATMAP ────────────────────────────────────────────
// GitHub-style: each cell = a day in Q1 2026, colored by # of goal updates

function generateCalendarData() {
  const events: Record<string, number> = {}
  // Simulate activity from goal submission/audit data
  const seed = [
    { date: '2026-01-10', count: 4 }, { date: '2026-01-09', count: 3 },
    { date: '2026-01-11', count: 5 }, { date: '2026-01-12', count: 6 },
    { date: '2026-01-13', count: 2 }, { date: '2026-01-14', count: 3 },
    { date: '2026-01-20', count: 1 }, { date: '2026-01-22', count: 4 },
    { date: '2026-01-28', count: 2 }, { date: '2026-01-31', count: 5 },
    { date: '2026-02-03', count: 1 }, { date: '2026-02-10', count: 3 },
    { date: '2026-02-14', count: 2 }, { date: '2026-02-20', count: 4 },
    { date: '2026-02-25', count: 6 }, { date: '2026-03-01', count: 2 },
    { date: '2026-03-05', count: 3 }, { date: '2026-03-12', count: 5 },
    { date: '2026-03-15', count: 7 }, { date: '2026-03-20', count: 4 },
    { date: '2026-03-25', count: 3 }, { date: '2026-03-31', count: 8 },
    { date: '2026-04-01', count: 10 }, { date: '2026-04-02', count: 9 },
    { date: '2026-04-03', count: 12 }, { date: '2026-04-04', count: 8 },
    { date: '2026-04-05', count: 6 }, { date: '2026-04-08', count: 5 },
    { date: '2026-04-10', count: 4 }, { date: '2026-04-12', count: 7 },
    { date: '2026-04-15', count: 3 }, { date: '2026-04-18', count: 2 },
  ]
  seed.forEach(({ date, count }) => { events[date] = count })
  return events
}

function calCellColor(count: number, isDark: boolean): string {
  if (count === 0) return isDark ? '#1a1f2e' : '#f1f5f9'
  if (count <= 2) return isDark ? '#1e3a5f' : '#bfdbfe'
  if (count <= 4) return isDark ? '#1d4ed8' : '#3b82f6'
  if (count <= 7) return isDark ? '#2563eb' : '#1d4ed8'
  if (count <= 10) return isDark ? '#7c3aed' : '#7c3aed'
  return isDark ? '#a855f7' : '#6d28d9'
}

export function ActivityCalendarHeatmap() {
  const { isDark } = usePortalStore()
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150)
    return () => clearTimeout(t)
  }, [])

  const eventData = generateCalendarData()

  // Build weeks: Jan 1 2026 (Thursday) to Apr 30 2026
  const startDate = new Date('2026-01-01')
  const endDate = new Date('2026-04-30')
  const weeks: { date: string; count: number }[][] = []
  let currentWeek: { date: string; count: number }[] = []

  // Pad start to Sunday
  const startDay = startDate.getDay()
  for (let i = 0; i < startDay; i++) currentWeek.push({ date: '', count: 0 })

  const cur = new Date(startDate)
  while (cur <= endDate) {
    const dateStr = cur.toISOString().split('T')[0]
    currentWeek.push({ date: dateStr, count: eventData[dateStr] || 0 })
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = [] }
    cur.setDate(cur.getDate() + 1)
  }
  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push({ date: '', count: 0 })
    weeks.push(currentWeek)
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-4">
          ADMIN · HEATMAP · ACTIVITY
        </div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-2">
          Goal Activity Calendar
        </h1>
        <p className="text-[12px] text-gray-400 dark:text-text-subtle mb-8">
          Daily org-wide goal updates, submissions & check-ins — Q1/Q2 2026
        </p>

        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-lg">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 ml-10">
            {months.map(m => (
              <div key={m} className="flex-1 text-[10px] font-bold text-gray-400 dark:text-text-subtle tracking-wider">{m}</div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pt-0.5">
              {days.map((d, i) => (
                <div key={d} className="h-[14px] text-[8px] text-gray-400 dark:text-text-subtle leading-none flex items-center">
                  {i % 2 === 1 ? d : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1 flex-1 relative">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div key={di} className="relative">
                      {day.date ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={revealed ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.3, delay: (wi * 7 + di) * 0.003 }}
                          whileHover={{ scale: 1.4, zIndex: 10 }}
                          onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                          onMouseLeave={() => setHoveredDay(null)}
                          className="w-[14px] h-[14px] rounded-[3px] cursor-default relative transition-shadow"
                          style={{
                            backgroundColor: calCellColor(day.count, isDark),
                            boxShadow: hoveredDay?.date === day.date && day.count > 0
                              ? `0 0 10px ${calCellColor(day.count, isDark)}` : 'none'
                          }}
                        />
                      ) : (
                        <div className="w-[14px] h-[14px]" />
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Floating Tooltip */}
              {hoveredDay && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="fixed z-50 pointer-events-none bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl"
                  style={{ bottom: '60%', left: '50%', transform: 'translateX(-50%)' }}
                >
                  {hoveredDay.count > 0 ? `${hoveredDay.count} actions` : 'No activity'} · {hoveredDay.date}
                </motion.div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-6 justify-end">
            <span className="text-[10px] text-gray-400 dark:text-text-subtle">Less</span>
            {[0, 2, 5, 8, 11].map(n => (
              <div key={n} className="w-[14px] h-[14px] rounded-[3px]" style={{ backgroundColor: calCellColor(n, isDark) }} />
            ))}
            <span className="text-[10px] text-gray-400 dark:text-text-subtle">More</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Actions', value: Object.values(eventData).reduce((a, b) => a + b, 0), color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Peak Day', value: `${Math.max(...Object.values(eventData))} actions`, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Active Days', value: Object.values(eventData).filter(v => v > 0).length, color: 'text-green-600 dark:text-green-400' },
            { label: 'Avg / Active Day', value: `${Math.round(Object.values(eventData).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(eventData).filter(v => v > 0).length))}`, color: 'text-orange-500 dark:text-orange-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
              <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">{s.label}</div>
              <div className={`font-hero font-black text-[28px] leading-none ${s.color}`}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 3. EMPLOYEE SCORE RADIAL HEATMAP ────────────────────────────────────────
// Circular ring chart per employee, segments = goals, color = score

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
  if (score >= 90) return '#16a34a'
  if (score >= 75) return '#22c55e'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  if (score > 0) return '#ef4444'
  return '#e2e8f0'
}

export function RadialScoreHeatmap() {
  const { employees, goalSheets, isDark } = usePortalStore()
  const [hovered, setHovered] = useState<{ emp: string; goalTitle: string; score: number } | null>(null)
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

  const CX = 70, CY = 70, OUTER_R = 60, INNER_R = 38

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-4">
          ADMIN · HEATMAP · RADIAL
        </div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-2">
          Goal Score Radial View
        </h1>
        <p className="text-[12px] text-gray-400 dark:text-text-subtle mb-8">
          Each ring segment = one goal. Segment arc = weightage. Color = achievement score (Q1 · 2026)
        </p>

        <div className="grid grid-cols-5 gap-5">
          {empData.map(({ emp, goals, totalScore }, ei) => {
            const totalWeight = goals.reduce((s, g) => s + g.weightage, 0) || 1
            let currentAngle = 0
            const GAP = 3

            return (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={revealed ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: ei * 0.1, type: 'spring', stiffness: 150 }}
                className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-lg flex flex-col items-center"
              >
                <svg width={140} height={140} className="overflow-visible mb-2">
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
                        transition={{ duration: 0.8, delay: ei * 0.1 + gi * 0.12 }}
                        style={{
                          filter: isH ? `drop-shadow(0 0 8px ${color})` : 'none',
                          cursor: 'default'
                        }}
                        onMouseEnter={() => setHovered({ emp: emp.id, goalTitle: goal.title, score: goal.score })}
                        onMouseLeave={() => setHovered(null)}
                      />
                    )
                  })}

                  {/* Center score */}
                  <text x={CX} y={CY - 5} textAnchor="middle" dominantBaseline="middle"
                    fill={totalScore >= 75 ? '#16a34a' : totalScore >= 50 ? '#3b82f6' : '#ef4444'}
                    fontSize="16" fontWeight="900" fontFamily="inherit">
                    {totalScore}
                  </text>
                  <text x={CX} y={CY + 11} textAnchor="middle"
                    fill={isDark ? '#64748b' : '#94a3b8'} fontSize="8" fontWeight="600" fontFamily="inherit">
                    SCORE
                  </text>
                </svg>

                <img src={emp.avatarUrl} className="w-7 h-7 rounded-full mb-1.5" alt="" />
                <div className="text-[12px] font-bold text-gray-900 dark:text-text-primary text-center leading-tight">
                  {emp.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-gray-400 dark:text-text-subtle text-center">{emp.department}</div>

                {/* Tooltip */}
                {hovered?.emp === emp.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-bold px-2 py-1 rounded text-center leading-tight"
                  >
                    {hovered.goalTitle.length > 20 ? hovered.goalTitle.slice(0, 20) + '…' : hovered.goalTitle}
                    <br />{hovered.score}%
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Goal color legend */}
        <div className="flex items-center gap-4 mt-6 flex-wrap">
          {[
            { label: 'No data', color: '#e2e8f0' },
            { label: '1–39% At Risk', color: '#ef4444' },
            { label: '40–59% Below', color: '#f59e0b' },
            { label: '60–74% On Track', color: '#3b82f6' },
            { label: '75–89% Good', color: '#22c55e' },
            { label: '90–100% Excellent', color: '#16a34a' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] text-gray-500 dark:text-text-muted">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
