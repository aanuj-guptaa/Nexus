import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Role, Goal, GoalSheet, Employee, ManagerUser, AdminUser, CycleWindow, AuditEntry, SharedGoalTemplate, GoalStatus, MeasurementType, Quarter, QuarterlyEntry } from '../types/portal'

// ─── Score helper ────────────────────────────────────────────────────────────
export function computeScore(measurement: MeasurementType, target: number, actual: number): number {
  if (actual === undefined || actual === null) return 0
  switch (measurement) {
    case 'numeric_higher': case 'percent_higher': return Math.min(100, (actual / target) * 100)
    case 'numeric_lower': return actual === 0 ? 100 : Math.min(100, (target / actual) * 100)
    case 'zero_based': return actual === 0 ? 100 : 0
    default: return 0
  }
}

export function computeSheetScore(sheet: GoalSheet, quarter: Quarter = 'q1'): number {
  let total = 0
  for (const g of sheet.goals) {
    const entry = g.actuals[quarter]
    const actual = entry?.actual ?? 0
    const score = computeScore(g.measurement, g.target, actual)
    total += (score * g.weightage) / 100
  }
  return Math.round(total)
}

// ─── Dummy data ──────────────────────────────────────────────────────────────
const EMPLOYEES: Employee[] = [
  { id: 'ada', name: 'Ada Mensah', jobTitle: 'Senior Account Executive', department: 'Revenue', avatarUrl: 'https://i.pravatar.cc/40?u=ada', managerId: 'marco' },
  { id: 'koji', name: 'Koji Nakamura', jobTitle: 'Customer Success Lead', department: 'Revenue', avatarUrl: 'https://i.pravatar.cc/40?u=koji', managerId: 'marco' },
  { id: 'priya', name: 'Priya Anand', jobTitle: 'Product Designer', department: 'Product', avatarUrl: 'https://i.pravatar.cc/40?u=priya', managerId: 'marco' },
  { id: 'luis', name: 'Luis Ortega', jobTitle: 'Data Engineer', department: 'Product', avatarUrl: 'https://i.pravatar.cc/40?u=luis', managerId: 'marco' },
  { id: 'noor', name: 'Noor Rahman', jobTitle: 'Marketing Manager', department: 'Marketing', avatarUrl: 'https://i.pravatar.cc/40?u=noor', managerId: 'marco' },
]

const MANAGER: ManagerUser = { id: 'marco', name: 'Marco Visser', jobTitle: 'Director, Commercial', avatarUrl: 'https://i.pravatar.cc/40?u=marco', directReportIds: ['ada','koji','priya','luis','noor'] }
const ADMIN: AdminUser = { id: 'elena', name: 'Elena Kovač', jobTitle: 'Head of People Ops', avatarUrl: 'https://i.pravatar.cc/40?u=elena' }

function q1(actual: number, status: GoalStatus, comment = ''): QuarterlyEntry { return { actual, status, comment, managerComment: '' } }

const ADA_GOALS: Goal[] = [
  { id:'g1', title:'Net New ARR', description:'Close new logo revenue from top-tier accounts', thrustArea:'Revenue Growth', measurement:'numeric_higher', target:1200000, weightage:35, isShared:false, actuals:{ q1: q1(900000,'on_track','Closed 3 enterprise deals this quarter') } },
  { id:'g2', title:'Pipeline Coverage', description:'Maintain 5x pipeline to quota ratio', thrustArea:'Revenue Growth', measurement:'numeric_higher', target:5, weightage:15, isShared:false, actuals:{ q1: q1(4,'on_track','') } },
  { id:'g3', title:'Customer NPS', description:'Improve net promoter score across the account base', thrustArea:'Customer Experience', measurement:'percent_higher', target:75, weightage:20, isShared:false, actuals:{ q1: q1(68,'on_track','') } },
  { id:'g4', title:'Zero Compliance Breaches', description:'Maintain zero data handling incidents', thrustArea:'Compliance & Risk', measurement:'zero_based', target:0, weightage:15, isShared:false, actuals:{ q1: q1(0,'completed','') } },
  { id:'g5', title:'Sales Cycle Time', description:'Reduce average sales cycle days', thrustArea:'Operational Excellence', measurement:'numeric_lower', target:70, weightage:15, isShared:false, actuals:{ q1: q1(83,'not_started','') } },
]

const KOJI_GOALS: Goal[] = [
  { id:'k1', title:'Customer Retention Rate', description:'Maintain high retention across all accounts', thrustArea:'Customer Experience', measurement:'percent_higher', target:95, weightage:40, isShared:false, actuals:{ q1: q1(86,'on_track','') } },
  { id:'k2', title:'Ticket Resolution Time', description:'Resolve 90% of tickets within 24 hours', thrustArea:'Operational Excellence', measurement:'numeric_lower', target:24, weightage:35, isShared:false, actuals:{ q1: q1(50,'at_risk','Staffing shortage impacted SLA') } },
  { id:'k3', title:'CSAT Score', description:'Achieve 4.5+ CSAT across all interactions', thrustArea:'Customer Experience', measurement:'percent_higher', target:4.5, weightage:25, isShared:false, actuals:{ q1: q1(3.5,'on_track','') } },
]

const PRIYA_GOALS: Goal[] = [
  { id:'p1', title:'Design System Coverage', description:'Increase component library coverage to 80%', thrustArea:'Product Innovation', measurement:'percent_higher', target:80, weightage:50, isShared:false, actuals:{ q1: q1(42,'at_risk','Delayed due to platform migration') } },
  { id:'p2', title:'User Research Sessions', description:'Conduct 20 user research sessions per quarter', thrustArea:'Customer Experience', measurement:'numeric_higher', target:20, weightage:30, isShared:false, actuals:{ q1: q1(8,'not_started','') } },
  { id:'p3', title:'Design Velocity', description:'Reduce design-to-dev handoff cycle to 3 days', thrustArea:'Operational Excellence', measurement:'numeric_lower', target:3, weightage:20, isShared:false, actuals:{ q1: q1(7,'at_risk','') } },
]

const LUIS_GOALS: Goal[] = [
  { id:'l1', title:'Pipeline Uptime', description:'Maintain 99.9% data pipeline uptime', thrustArea:'Operational Excellence', measurement:'percent_higher', target:99.9, weightage:60, isShared:false, actuals:{ q1: q1(94,'at_risk','Two incidents in February') } },
  { id:'l2', title:'Data Quality Score', description:'Achieve >95% data quality across all pipelines', thrustArea:'Product Innovation', measurement:'percent_higher', target:95, weightage:40, isShared:false, actuals:{ q1: q1(72,'not_started','') } },
]

const NOOR_GOALS: Goal[] = [
  { id:'n1', title:'Qualified Leads Generated', description:'Generate 500 MQLs per quarter', thrustArea:'Revenue Growth', measurement:'numeric_higher', target:500, weightage:35, isShared:false, actuals:{ q1: q1(410,'on_track','') } },
  { id:'n2', title:'Campaign ROI', description:'Achieve 3x return on marketing spend', thrustArea:'Revenue Growth', measurement:'numeric_higher', target:3, weightage:25, isShared:false, actuals:{ q1: q1(2.5,'on_track','') } },
  { id:'n3', title:'Brand Awareness Score', description:'Increase aided brand awareness by 15 pts', thrustArea:'Customer Experience', measurement:'numeric_higher', target:15, weightage:20, isShared:false, actuals:{ q1: q1(11,'on_track','') } },
  { id:'n4', title:'Content Production', description:'Publish 40 pieces of content per quarter', thrustArea:'Operational Excellence', measurement:'numeric_higher', target:40, weightage:20, isShared:false, actuals:{ q1: q1(36,'on_track','') } },
]

const GOAL_SHEETS: GoalSheet[] = [
  { id:'sheet-ada', employeeId:'ada', cycle:'2026', status:'approved', goals:ADA_GOALS, submittedAt:'2026-01-10T09:00:00Z', approvedAt:'2026-01-12T14:00:00Z', lockedAt:'2026-01-12T14:00:00Z' },
  { id:'sheet-koji', employeeId:'koji', cycle:'2026', status:'submitted', goals:KOJI_GOALS, submittedAt:'2026-01-14T11:00:00Z' },
  { id:'sheet-priya', employeeId:'priya', cycle:'2026', status:'rework', goals:PRIYA_GOALS, submittedAt:'2026-01-11T10:00:00Z', reworkComment:'Please add a measurable target for Design Velocity and align weightages to reflect strategic priorities.' },
  { id:'sheet-luis', employeeId:'luis', cycle:'2026', status:'draft', goals:LUIS_GOALS },
  { id:'sheet-noor', employeeId:'noor', cycle:'2026', status:'approved', goals:NOOR_GOALS, submittedAt:'2026-01-09T08:00:00Z', approvedAt:'2026-01-11T16:00:00Z', lockedAt:'2026-01-11T16:00:00Z' },
]

const SHARED_GOAL_TEMPLATES: SharedGoalTemplate[] = [
  { id:'sg1', managerId:'marco', title:'Team Revenue Target Q1', description:'Contribute to team Q1 ARR goal of $3M', thrustArea:'Revenue Growth', measurement:'numeric_higher', target:3000000, assignedToIds:['ada','koji'] },
]

const CYCLE_WINDOWS: CycleWindow[] = [
  { id:'goal_setting', label:'Goal Setting', openDate:'2026-01-01', closeDate:'2026-01-31', isOpen:false },
  { id:'q1', label:'Q1 Check-in', openDate:'2026-04-01', closeDate:'2026-04-15', isOpen:true },
  { id:'q2', label:'Q2 Check-in', openDate:'2026-07-01', closeDate:'2026-07-15', isOpen:false },
  { id:'q3', label:'Q3 Check-in', openDate:'2026-10-01', closeDate:'2026-10-15', isOpen:false },
  { id:'annual', label:'Annual Review', openDate:'2027-01-01', closeDate:'2027-01-31', isOpen:false },
]

const AUDIT_LOG: AuditEntry[] = [
  { id:'a1', timestamp:'2026-01-12T14:02:00Z', actorName:'Marco Visser', action:'Sheet Approved', details:'Approved goal sheet', employeeName:'Ada Mensah' },
  { id:'a2', timestamp:'2026-01-12T14:05:00Z', actorName:'Elena Kovač', action:'Sheet Unlocked', details:'Admin unlock after post-approval edit request', employeeName:'Ada Mensah', field:'status', oldValue:'locked', newValue:'unlocked' },
  { id:'a3', timestamp:'2026-01-11T16:00:00Z', actorName:'Marco Visser', action:'Sheet Approved', details:'Approved goal sheet', employeeName:'Noor Rahman' },
  { id:'a4', timestamp:'2026-01-13T10:30:00Z', actorName:'Marco Visser', action:'Sent for Rework', details:'Requested changes to goal structure', employeeName:'Priya Anand' },
  { id:'a5', timestamp:'2026-04-03T09:15:00Z', actorName:'Elena Kovač', action:'Window Opened', details:'Q1 check-in window opened for all employees' },
]

export interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

// ─── Store ───────────────────────────────────────────────────────────────────
interface PortalState {
  role: Role
  activeUserId: string
  currentUserProfile: any | null
  employees: Employee[]
  manager: ManagerUser
  admin: AdminUser
  goalSheets: GoalSheet[]
  sharedGoalTemplates: SharedGoalTemplate[]
  cycleWindows: CycleWindow[]
  auditLog: AuditEntry[]
  setRole: (r: Role) => void
  updateGoalInSheet: (sheetId: string, goalId: string, updates: Partial<Goal>) => void
  addGoalToSheet: (sheetId: string) => void
  removeGoalFromSheet: (sheetId: string, goalId: string) => void
  submitSheet: (sheetId: string) => void
  approveSheet: (sheetId: string) => void
  sendForRework: (sheetId: string, comment: string) => void
  updateCheckin: (sheetId: string, goalId: string, quarter: Quarter, entry: Partial<QuarterlyEntry>) => void
  toggleWindow: (windowId: string) => void
  unlockSheet: (sheetId: string) => void
  pushSharedGoal: (template: SharedGoalTemplate) => void
  notifications: Notification[]
  markNotificationRead: (id: string) => Promise<void>
  isDark: boolean
  toggleDark: () => void
  initializeSession: (userId: string) => Promise<void>
  switchJourneyDemo: (targetRole: Role) => Promise<void>
}

let _nextId = 100

export const usePortalStore = create<PortalState>((set, get) => ({
  role: 'employee',
  activeUserId: 'ada',
  currentUserProfile: null,
  employees: EMPLOYEES,
  manager: MANAGER,
  admin: ADMIN,
  goalSheets: GOAL_SHEETS,
  sharedGoalTemplates: SHARED_GOAL_TEMPLATES,
  cycleWindows: CYCLE_WINDOWS,
  auditLog: AUDIT_LOG,
  notifications: [],
  isDark: false,

  setRole: (r) => set({ role: r }),
  toggleDark: () => set(s => ({ isDark: !s.isDark })),

  switchJourneyDemo: async (targetRole) => {
    const { data: profiles } = await supabase.from('profiles').select('*').eq('role', targetRole).limit(1)
    if (profiles && profiles.length > 0) {
      await get().initializeSession(profiles[0].id)
    } else {
      // Fallback if no db profile exists yet for this role
      set({ role: targetRole })
    }
  },

  initializeSession: async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    
    if (profile) {
      set({ role: profile.role, activeUserId: userId, currentUserProfile: profile })
      
      let fetchIds = [userId]
      
      if (profile.role === 'admin') {
        const { data: allProfiles } = await supabase.from('profiles').select('*')
        if (allProfiles) {
          fetchIds = allProfiles.map((p: any) => p.id)
          set({ 
            employees: allProfiles.map((t: any) => ({
              id: t.id, name: t.name, jobTitle: t.job_title, department: t.department, avatarUrl: t.avatar_url, managerId: t.manager_id
            }))
          })
        }
      } else if (profile.role === 'manager') {
        const { data: team } = await supabase.from('profiles').select('*').eq('manager_id', userId)
        if (team && team.length > 0) {
          fetchIds = [userId, ...team.map((t: any) => t.id)]
          set({ 
            employees: team.map((t: any) => ({
              id: t.id, name: t.name, jobTitle: t.job_title, department: t.department, avatarUrl: t.avatar_url, managerId: t.manager_id
            }))
          })
        }
      }
      
      // Fetch goal sheets for user AND their team
      let { data: sheets } = await supabase
        .from('goal_sheets')
        .select(`
          id, employee_id, cycle_year, status, rework_comment, created_at, updated_at,
          goals (
            id, title, description, thrust_area, measurement, target, weightage, is_shared,
            goal_actuals ( quarter, actual, status, employee_comment, manager_comment )
          )
        `)
        .in('employee_id', fetchIds)

      // Auto-create a sheet for 2026 for the logged-in user if they don't have one
      const userSheetExists = sheets?.some(s => s.employee_id === userId && s.cycle_year === 2026)
      if (!userSheetExists) {
        const { data: newSheet } = await supabase
          .from('goal_sheets')
          .insert({ employee_id: userId, cycle_year: 2026 })
          .select()
          .single()
        
        if (newSheet) {
          sheets = [...(sheets || []), { ...newSheet, goals: [] }]
        }
      }

      // Fetch Notifications
      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (notifs) {
        set({
          notifications: notifs.map(n => ({ id: n.id, title: n.title, message: n.message, isRead: n.is_read, createdAt: n.created_at }))
        })
      }

      // Setup Realtime Listener for Notifications
      supabase.channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => {
            const n = payload.new
            set(s => ({
              notifications: [{ id: n.id, title: n.title, message: n.message, isRead: n.is_read, createdAt: n.created_at }, ...s.notifications]
            }))
          }
        )
        .subscribe()

      if (sheets) {
        // Transform snake_case DB to camelCase Frontend state
        const formattedSheets: GoalSheet[] = sheets.map((sh: any) => ({
          id: sh.id,
          employeeId: sh.employee_id,
          cycle: sh.cycle_year.toString(),
          status: sh.status,
          reworkComment: sh.rework_comment,
          goals: (sh.goals || []).map((g: any) => {
            const actualsMap: any = {}
            if (g.goal_actuals) {
              g.goal_actuals.forEach((a: any) => {
                actualsMap[a.quarter] = {
                  actual: a.actual,
                  status: a.status,
                  comment: a.employee_comment || '',
                  managerComment: a.manager_comment || ''
                }
              })
            }
            return {
              id: g.id,
              title: g.title,
              description: g.description || '',
              thrustArea: g.thrust_area,
              measurement: g.measurement,
              target: g.target,
              weightage: g.weightage,
              isShared: g.is_shared,
              actuals: actualsMap
            }
          })
        }))
        
        set(() => ({
          // We override the dummy sheets for this user only, or just replace all for now
          // If we want manager view to work, we need to fetch team's sheets too. 
          // For now, let's just replace the entire array with the logged in user's sheets for safety.
          goalSheets: formattedSheets
        }))
      }
    } else {
      set({ role: 'employee', activeUserId: userId })
    }
  },

  markNotificationRead: async (id) => {
    // Optimistic UI
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }))
    // DB
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  },

  updateGoalInSheet: async (sheetId, goalId, updates) => {
    // 1. Optimistic UI update (Instant so text box doesn't lag/drop chars)
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : {
        ...sh, goals: sh.goals.map(g => g.id !== goalId ? g : { ...g, ...updates })
      })
    }))

    // 2. Background DB sync
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.thrustArea !== undefined) dbUpdates.thrust_area = updates.thrustArea
    if (updates.measurement !== undefined) dbUpdates.measurement = updates.measurement
    if (updates.target !== undefined) dbUpdates.target = updates.target
    if (updates.weightage !== undefined) dbUpdates.weightage = updates.weightage

    await supabase.from('goals').update(dbUpdates).eq('id', goalId)
  },

  addGoalToSheet: async (sheetId) => {
    const { data: newGoal } = await supabase.from('goals').insert({
      sheet_id: sheetId,
      title: '',
      description: '',
      thrust_area: 'Revenue Growth',
      measurement: 'numeric_higher',
      target: 0,
      weightage: 10
    }).select().single()

    if (newGoal) {
      set(s => ({
        goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : {
          ...sh, goals: [...sh.goals, {
            id: newGoal.id, title: newGoal.title, description: newGoal.description || '', thrustArea: newGoal.thrust_area,
            measurement: newGoal.measurement, target: newGoal.target, weightage: newGoal.weightage, isShared: newGoal.is_shared, actuals: {}
          }]
        })
      }))
    }
  },

  removeGoalFromSheet: async (sheetId, goalId) => {
    await supabase.from('goals').delete().eq('id', goalId)
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : {
        ...sh, goals: sh.goals.filter(g => g.id !== goalId)
      })
    }))
  },

  submitSheet: async (sheetId) => {
    await supabase.from('goal_sheets').update({ status: 'submitted' }).eq('id', sheetId)
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : {
        ...sh, status: 'submitted', submittedAt: new Date().toISOString()
      })
    }))
  },

  approveSheet: async (sheetId) => {
    const now = new Date().toISOString()
    const { error } = await supabase.from('goal_sheets').update({ status: 'approved', updated_at: now }).eq('id', sheetId)
    if (error) console.error("Error approving sheet:", error)
    
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : { ...sh, status: 'approved', approvedAt: now, lockedAt: now }),
      auditLog: [{ id: `a${_nextId++}`, timestamp: now, actorName: s.currentUserProfile?.name || 'Manager', action: 'Sheet Approved', details: 'Goal sheet approved and locked' }, ...s.auditLog]
    }))
  },

  sendForRework: async (sheetId, comment) => {
    await supabase.from('goal_sheets').update({ status: 'rework', rework_comment: comment }).eq('id', sheetId)
    
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : { ...sh, status: 'rework', reworkComment: comment })
    }))
  },

  updateCheckin: async (sheetId, goalId, quarter, entry) => {
    // 1. Optimistic UI update
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : {
        ...sh, goals: sh.goals.map(g => g.id !== goalId ? g : {
          ...g, actuals: { ...g.actuals, [quarter]: { ...(g.actuals[quarter] ?? { status: 'not_started', comment: '', managerComment: '' }), ...entry } }
        })
      })
    }))

    // 2. DB Upsert
    const dbEntry: any = { goal_id: goalId, quarter: quarter }
    if (entry.actual !== undefined) dbEntry.actual = entry.actual
    if (entry.status !== undefined) dbEntry.status = entry.status
    if (entry.comment !== undefined) dbEntry.employee_comment = entry.comment
    if (entry.managerComment !== undefined) dbEntry.manager_comment = entry.managerComment

    await supabase.from('goal_actuals').upsert(dbEntry, { onConflict: 'goal_id,quarter' })
  },

  toggleWindow: (windowId) => set(s => ({
    cycleWindows: s.cycleWindows.map(w => w.id !== windowId ? w : { ...w, isOpen: !w.isOpen }),
    auditLog: [{ id: `a${_nextId++}`, timestamp: new Date().toISOString(), actorName: 'Elena Kovač', action: 'Window Toggled', details: `${windowId} window toggled` }, ...s.auditLog]
  })),

  unlockSheet: async (sheetId) => {
    // Set back to draft
    await supabase.from('goal_sheets').update({ status: 'draft' }).eq('id', sheetId)
    // The Postgres Trigger we just created will automatically log this action in audit_logs!
    
    set(s => ({
      goalSheets: s.goalSheets.map(sh => sh.id !== sheetId ? sh : { ...sh, status: 'draft', lockedAt: undefined })
    }))
  },

  pushSharedGoal: async (template) => {
    // 1. Insert template to DB
    const { data: dbTemplate } = await supabase.from('shared_goal_templates').insert({
      manager_id: template.managerId,
      title: template.title,
      description: template.description,
      thrust_area: template.thrustArea,
      measurement: template.measurement,
      target: template.target,
      assigned_to_ids: template.assignedToIds
    }).select().single()

    if (!dbTemplate) return

    // 2. We need to insert a real goal into each assignee's current cycle sheet
    // To do this efficiently, we must know their sheet IDs. 
    // Luckily, the manager has fetched the sheets of their direct reports!
    const state = get()
    const sheetsToUpdate = state.goalSheets.filter(sh => template.assignedToIds.includes(sh.employeeId))

    const newGoalsData = sheetsToUpdate.map(sh => ({
      sheet_id: sh.id,
      title: template.title,
      description: template.description,
      thrust_area: template.thrustArea,
      measurement: template.measurement,
      target: template.target,
      weightage: 10,
      is_shared: true,
      shared_from_manager_id: template.managerId
    }))

    if (newGoalsData.length > 0) {
      const { data: insertedGoals } = await supabase.from('goals').insert(newGoalsData).select()

      // 3. Update Zustand
      if (insertedGoals) {
        set(s => ({
          sharedGoalTemplates: [...s.sharedGoalTemplates, { ...template, id: dbTemplate.id }],
          goalSheets: s.goalSheets.map(sh => {
            const addedGoal = insertedGoals.find((g: any) => g.sheet_id === sh.id)
            if (!addedGoal) return sh
            
            const newGoal: Goal = { 
              id: addedGoal.id, title: addedGoal.title, description: addedGoal.description || '', 
              thrustArea: addedGoal.thrust_area, measurement: addedGoal.measurement, 
              target: addedGoal.target, weightage: addedGoal.weightage, 
              isShared: addedGoal.is_shared, sharedFromManagerId: addedGoal.shared_from_manager_id, 
              actuals: {} 
            }
            return { ...sh, goals: [...sh.goals, newGoal] }
          })
        }))
      }
    }
  },
}))
