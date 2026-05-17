import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { usePortalStore } from '../../../store/portalStore'

export function CompletionDash() {
  const { employees } = usePortalStore()
  const [deptStats, setDeptStats] = useState<any[]>([])
  const [managerStats, setManagerStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [deptsResponse, managersResponse] = await Promise.all([
          supabase.from('view_department_stats').select('*'),
          supabase.from('view_manager_effectiveness').select('*')
        ])

        if (deptsResponse.data) setDeptStats(deptsResponse.data)
        if (managersResponse.data) setManagerStats(managersResponse.data)
      } catch (err) {
        console.error('Error fetching analytics views:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Calculate aggregated stats from View data
  const totalEmployees = deptStats.reduce((acc, curr) => acc + Number(curr.total_employees), 0)
  const submitted = deptStats.reduce((acc, curr) => acc + Number(curr.sheets_submitted), 0)
  const approved = deptStats.reduce((acc, curr) => acc + Number(curr.sheets_approved), 0)
  const checkinDone = deptStats.reduce((acc, curr) => acc + Number(curr.checkins_done), 0)
  const checkinRate = totalEmployees ? Math.round((checkinDone / totalEmployees) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [1, 0.4, 1] }} 
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[12px] font-bold tracking-widest uppercase text-gray-400"
        >
          Calculating Org Analytics...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-4">
          COMPLETION DASHBOARD (POWERED BY POSTGRES VIEWS)
        </div>
        <h1 className="font-hero font-black text-[52px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">
          Q1 · 2026
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Employees', value: totalEmployees, color: 'text-gray-900 dark:text-text-primary' },
            { label: 'Sheets Submitted', value: submitted, color: 'text-blue-600 dark:text-blue-500' },
            { label: 'Sheets Approved', value: approved, color: 'text-green-600 dark:text-green-400' },
            { label: 'Check-in Rate', value: `${checkinRate}%`, color: 'text-orange-500 dark:text-orange-400' },
          ].map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-lg p-5 shadow-sm"
            >
              <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-2">
                {s.label}
              </div>
              <div className={`font-hero font-black text-[32px] leading-none ${s.color}`}>
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* By Department Breakdown */}
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
            <h2 className="font-hero font-black text-[18px] tracking-tight text-gray-900 dark:text-text-primary">
              Department Performance View
            </h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {deptStats.map(dept => {
              const approvedPct = dept.total_employees ? (dept.sheets_approved / dept.total_employees) * 100 : 0
              const checkinPct = dept.total_employees ? (dept.checkins_done / dept.total_employees) * 100 : 0

              return (
                <div key={dept.department} className="px-6 py-5">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div>
                      <div className="font-bold text-[14px] text-gray-900 dark:text-text-primary">{dept.department}</div>
                      <div className="text-[10px] text-gray-400 dark:text-text-subtle">Headcount: {dept.total_employees}</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">
                        Sheets Approved · {dept.sheets_approved}/{dept.total_employees}
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${approvedPct}%` }} 
                          transition={{ duration: 0.8 }}
                          className="h-full bg-green-500 rounded-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-1">
                        Check-ins Done · {dept.checkins_done}/{dept.total_employees}
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${checkinPct}%` }} 
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-blue-600 dark:bg-blue rounded-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Manager Effectiveness Leaderboard */}
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
            <h2 className="font-hero font-black text-[18px] tracking-tight text-gray-900 dark:text-text-primary">
              Manager Effectiveness (Q1 Check-ins)
            </h2>
            <span className="text-[8px] font-bold tracking-widest uppercase text-gray-400">Leaderboard</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {managerStats.length === 0 ? (
              <div className="p-8 text-center text-[12px] text-gray-400">No manager records discovered yet.</div>
            ) : (
              managerStats.map((mgr, i) => {
                const completionPct = mgr.total_direct_reports ? Math.round((mgr.team_checkins_completed / mgr.total_direct_reports) * 100) : 0
                return (
                  <motion.div 
                    key={mgr.manager_id}
                    initial={{ opacity: 0, x: -8 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-6 px-6 py-4"
                  >
                    <div className="text-[12px] font-bold text-gray-400 w-4">#{i + 1}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{mgr.manager_name}</div>
                      <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">
                        Direct Reports: {mgr.total_direct_reports}
                      </div>
                    </div>
                    <div className="w-1/3">
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 dark:text-text-muted mb-1">
                        <span>Team Rate</span>
                        <span>{completionPct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${completionPct}%` }} 
                          transition={{ duration: 0.6 }}
                          className="h-full bg-orange-500 rounded-full" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Individual Status List */}
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
            <h2 className="font-hero font-black text-[18px] tracking-tight text-gray-900 dark:text-text-primary">
              Individual Roster Completion
            </h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {employees.map((emp, i) => {
              return (
                <motion.div 
                  key={emp.id} 
                  initial={{ opacity: 0, x: -8 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <img src={emp.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                  <div className="flex-1">
                    <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{emp.name}</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">
                      {emp.department} · {emp.jobTitle}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
