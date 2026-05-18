import { motion } from 'framer-motion'
import { usePortalStore } from '../../store/portalStore'

interface NavItem { id: string; icon: string; label: string }

const EMPLOYEE_NAV: NavItem[] = [
  { id: 'sheet', icon: '▣', label: 'My Goal Sheet' },
  { id: 'checkin', icon: '◈', label: 'Quarterly Check-in' },
]
const MANAGER_NAV: NavItem[] = [
  { id: 'overview', icon: '◉', label: 'Team Overview' },
  { id: 'review', icon: '≡', label: 'Review Sheets' },
  { id: 'shared', icon: '⊕', label: 'Shared Goals' },
  { id: 'checkins', icon: '☰', label: 'Quarterly Check-ins' },
]
const ADMIN_NAV: NavItem[] = [
  { id: 'completion', icon: '▤', label: 'Completion' },
  { id: 'cycles', icon: '◎', label: 'Cycles' },
  { id: 'hierarchy', icon: '◫', label: 'Hierarchy' },
  { id: 'audit', icon: '◈', label: 'Audit Trail' },
  { id: 'escalations', icon: '⚠', label: 'Escalations' },
  { id: 'reports', icon: '◰', label: 'Reports' },
  { id: 'analytics', icon: '▲', label: 'Analytics' },
  { id: 'heatmap-matrix', icon: '⊞', label: 'Matrix Heatmap' },
  { id: 'heatmap-calendar', icon: '◪', label: 'Activity Calendar' },
  { id: 'heatmap-radial', icon: '◍', label: 'Radial Scores' },
]

interface SidebarProps { active: string; onNav: (id: string) => void }

export function PortalSidebar({ active, onNav }: SidebarProps) {
  const { role } = usePortalStore()
  const nav = role === 'manager' ? MANAGER_NAV : role === 'admin' ? ADMIN_NAV : EMPLOYEE_NAV
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[200px] bg-white dark:bg-bg-surface border-r border-gray-100 dark:border-white/5 flex flex-col z-40">
      <div className="px-4 pt-5 pb-3">
        <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-text-subtle">{roleLabel}</span>
      </div>
      <nav className="flex-1 px-2">
        {nav.map(item => (
          <motion.button
            key={item.id}
            onClick={() => onNav(item.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left mb-0.5 transition-all ${
              active === item.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'text-gray-500 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-bg-elevated hover:text-gray-900 dark:hover:text-text-primary'
            }`}
          >
            <span className="text-[12px] opacity-70">{item.icon}</span>
            <span className="text-[12px] font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5">
        <div className="text-[9px] text-gray-400 dark:text-text-subtle tracking-widest uppercase">NEXUS / 2026 CYCLE</div>
      </div>
    </aside>
  )
}
