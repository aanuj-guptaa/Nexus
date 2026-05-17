export type Role = 'employee' | 'manager' | 'admin'
export type GoalStatus = 'not_started' | 'on_track' | 'completed' | 'at_risk'
export type SheetStatus = 'draft' | 'submitted' | 'approved' | 'rework'
export type MeasurementType = 'numeric_higher' | 'numeric_lower' | 'percent_higher' | 'zero_based'
export type Quarter = 'q1' | 'q2' | 'q3' | 'annual'

export interface QuarterlyEntry { actual?: number; status: GoalStatus; comment: string; managerComment: string }
export interface Goal { id: string; title: string; description: string; thrustArea: string; measurement: MeasurementType; target: number; weightage: number; isShared: boolean; sharedFromManagerId?: string; actuals: Partial<Record<Quarter, QuarterlyEntry>> }
export interface GoalSheet { id: string; employeeId: string; cycle: string; status: SheetStatus; goals: Goal[]; submittedAt?: string; approvedAt?: string; lockedAt?: string; reworkComment?: string }
export interface Employee { id: string; name: string; jobTitle: string; department: string; avatarUrl: string; managerId: string }
export interface ManagerUser { id: string; name: string; jobTitle: string; avatarUrl: string; directReportIds: string[] }
export interface AdminUser { id: string; name: string; jobTitle: string; avatarUrl: string }
export interface CycleWindow { id: string; label: string; openDate: string; closeDate: string; isOpen: boolean }
export interface AuditEntry { id: string; timestamp: string; actorName: string; action: string; details: string; employeeName?: string; field?: string; oldValue?: string; newValue?: string }
export interface SharedGoalTemplate { id: string; managerId: string; title: string; description: string; thrustArea: string; measurement: MeasurementType; target: number; assignedToIds: string[] }
