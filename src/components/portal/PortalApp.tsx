import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { PortalAuth } from './PortalAuth'
import { usePortalStore } from '../../store/portalStore'
import { PortalTopBar } from './PortalTopBar'
import { PortalSidebar } from './PortalSidebar'
import { GoalSheet } from './employee/GoalSheet'
import { QuarterlyCheckin } from './employee/QuarterlyCheckin'
import { ManagerTeamOverview } from './manager/TeamOverview'
import { ReviewSheets } from './manager/ReviewSheets'
import { ManagerCheckins } from './manager/ManagerCheckins'
import { CompletionDash } from './admin/CompletionDash'
import { CyclesAdmin, AuditTrailAdmin, HierarchyAdmin, ReportsAdmin, EscalationsAdmin, AnalyticsAdmin } from './admin/AdminViews'
import { ThrustAreaMatrixHeatmap, ActivityCalendarHeatmap, RadialScoreHeatmap } from './admin/HeatmapViews'

function SharedGoalsManager() {
  const { employees, manager, sharedGoalTemplates, pushSharedGoal } = usePortalStore()
  const directs = employees.filter(e => manager.directReportIds.includes(e.id))
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [pushed, setPushed] = useState(false)

  const handlePush = () => {
    if (!title || !target || !selected.length) return
    pushSharedGoal({ id: `sg${Date.now()}`, managerId: manager.id, title, description: 'Manager-pushed shared goal', thrustArea: 'Revenue Growth', measurement: 'numeric_higher', target: Number(target), assignedToIds: selected })
    setPushed(true); setTitle(''); setTarget(''); setSelected([])
    setTimeout(() => setPushed(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base relative">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle mb-6">MANAGER · SHARED GOALS</div>
        <h1 className="font-hero font-black text-[36px] leading-none tracking-tight text-gray-900 dark:text-text-primary mb-8">Push a Shared Goal</h1>
        <div className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Goal Title (read-only for recipients)</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Team Revenue Target Q2"
                className="w-full border border-gray-200 dark:border-white/10 rounded px-3 py-2.5 text-[13px] text-gray-900 dark:text-text-primary outline-none focus:border-blue-400 dark:border-blue-500/40" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-1">Target (read-only for recipients)</label>
              <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 3000000"
                className="w-full border border-gray-200 dark:border-white/10 rounded px-3 py-2.5 text-[13px] text-gray-900 dark:text-text-primary outline-none focus:border-blue-400 dark:border-blue-500/40" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle block mb-2">Assign to (recipients can only edit their weightage)</label>
              <div className="flex flex-wrap gap-2">
                {directs.map(e => (
                  <button key={e.id} onClick={() => setSelected(s => s.includes(e.id) ? s.filter(x=>x!==e.id) : [...s,e.id])}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${selected.includes(e.id) ? 'bg-blue-600 dark:bg-blue text-white border-blue-600' : 'bg-white dark:bg-bg-surface text-gray-500 dark:text-text-muted border-gray-200 dark:border-white/10 hover:border-blue-300 dark:border-blue-500/30'}`}>
                    <img src={e.avatarUrl} className="w-4 h-4 rounded-full" alt="" />{e.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={handlePush}
              className="bg-blue-600 dark:bg-blue text-white font-hero font-black text-[11px] tracking-widest uppercase px-8 py-3 rounded">
              Push Goal to Team
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {pushed && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg px-5 py-3 text-[12px] text-green-600 dark:text-green-400 font-medium">
              ✓ Shared goal pushed to selected team members. They can now set their weightage.
            </motion.div>
          )}
        </AnimatePresence>
        {sharedGoalTemplates.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-[13px] text-gray-900 dark:text-text-primary mb-3">Previously Pushed Goals</h3>
            <div className="space-y-2">
              {sharedGoalTemplates.map(sg => (
                <div key={sg.id} className="bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-lg px-5 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-[13px] text-gray-900 dark:text-text-primary">{sg.title}</div>
                    <div className="text-[10px] text-gray-400 dark:text-text-subtle">Target: {sg.target.toLocaleString()} · {sg.assignedToIds.length} recipients</div>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 bg-blue-600 dark:bg-blue-50 dark:bg-blue-600 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded">SHARED</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const PAGE_TRANSITIONS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 }
}

export function PortalApp() {
  const { role, isDark, initializeSession } = usePortalStore()
  const [activePage, setActivePage] = useState<string>('sheet') // Will update in useEffect
  const [reviewTarget, setReviewTarget] = useState<string | undefined>(undefined)
  const [session, setSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)

  // When role updates from db, ensure activePage is correct
  useEffect(() => {
    setActivePage(role === 'manager' ? 'overview' : role === 'admin' ? 'completion' : 'sheet')
  }, [role])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) initializeSession(session.user.id)
      setLoadingSession(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) initializeSession(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [initializeSession])

  const handleNav = (id: string, extra?: string) => {
    setActivePage(id)
    if (extra) setReviewTarget(extra)
  }

  // Reset page when role changes

  const renderPage = () => {
    // Employee
    if (role === 'employee') {
      if (activePage === 'checkin') return <QuarterlyCheckin />
      return <GoalSheet />
    }
    // Manager
    if (role === 'manager') {
      if (activePage === 'review') return <ReviewSheets focusEmployeeId={reviewTarget} />
      if (activePage === 'shared') return <SharedGoalsManager />
      if (activePage === 'checkins') return <ManagerCheckins />
      return <ManagerTeamOverview onNav={handleNav} />
    }
    // Admin
    if (activePage === 'cycles') return <CyclesAdmin />
    if (activePage === 'audit') return <AuditTrailAdmin />
    if (activePage === 'hierarchy') return <HierarchyAdmin />
    if (activePage === 'reports') return <ReportsAdmin />
    if (activePage === 'escalations') return <EscalationsAdmin />
    if (activePage === 'analytics') return <AnalyticsAdmin />
    if (activePage === 'heatmap-matrix') return <ThrustAreaMatrixHeatmap />
    if (activePage === 'heatmap-calendar') return <ActivityCalendarHeatmap />
    if (activePage === 'heatmap-radial') return <RadialScoreHeatmap />
    return <CompletionDash />
  }

  if (loadingSession) {
    return <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base flex items-center justify-center font-hero font-black tracking-widest text-sm text-gray-400">LOADING NEXUS...</div>
  }

  if (!session) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <PortalAuth />
      </div>
    )
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F2F0EB] dark:bg-bg-base text-gray-900 dark:text-text-primary relative" style={{ fontFamily: "'Inter', sans-serif" }}>
        {isDark && <div className="absolute inset-0 bg-dot-pattern opacity-[0.4] pointer-events-none" />}
        <PortalTopBar />
        <PortalSidebar active={activePage} onNav={id => { setActivePage(id); setReviewTarget(undefined) }} />
        <main className="ml-[200px] pt-14">
          <AnimatePresence mode="wait">
            <motion.div key={`${role}-${activePage}`} {...PAGE_TRANSITIONS}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
