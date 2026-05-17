import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { usePortalStore } from '../../store/portalStore'
import { useState } from 'react'

export function PortalTopBar() {
  const { isDark, toggleDark, currentUserProfile, notifications, markNotificationRead, switchJourneyDemo } = usePortalStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = notifications.filter(n => !n.isRead).length
  
  const user = currentUserProfile ? {
    name: currentUserProfile.name,
    jobTitle: currentUserProfile.job_title || 'Employee',
    avatarUrl: currentUserProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserProfile.name)}&background=random`
  } : { name: '', jobTitle: '', avatarUrl: '' }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white dark:bg-[#0A0A0A] flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-gray-900 dark:bg-bg-surface rounded flex items-center justify-center shrink-0">
          <span className="font-black text-white dark:text-black text-[11px]">N</span>
        </div>
        <div>
          <div className="font-black text-gray-900 dark:text-white text-[13px] tracking-widest uppercase leading-none">Nexus</div>
          <div className="text-[8px] tracking-widest uppercase text-gray-500 dark:text-white/30 leading-none mt-0.5">Goal Setting & Tracking</div>
        </div>
      </div>



      {/* User and Actions */}
      <div className="flex items-center gap-5">
        
        {/* Notifications */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0A0A0A]"></span>
            )}
          </motion.button>
          
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-bg-surface border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <h3 className="text-[12px] font-bold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-[12px] text-gray-400 dark:text-text-subtle">You're all caught up!</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} 
                           className={`p-4 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-bg-elevated transition-colors cursor-pointer ${n.isRead ? 'opacity-60' : ''}`}
                           onClick={() => !n.isRead && markNotificationRead(n.id)}>
                        <div className="flex items-start gap-3">
                          {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                          <div>
                            <div className="text-[12px] font-bold text-gray-900 dark:text-white mb-0.5">{n.title}</div>
                            <div className="text-[11px] text-gray-500 dark:text-text-muted leading-relaxed">{n.message}</div>
                            <div className="text-[9px] text-gray-400 dark:text-text-subtle mt-2 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Evaluator Demo Journey Switcher */}
        <select
          onChange={(e) => switchJourneyDemo(e.target.value as any)}
          value={currentUserProfile?.role || 'employee'}
          className="text-[9px] font-bold tracking-widest uppercase bg-gray-50 dark:bg-bg-elevated border border-gray-200 dark:border-white/10 text-gray-600 dark:text-text-primary px-2.5 py-1.5 rounded outline-none cursor-pointer focus:border-blue-500 hover:border-gray-400 transition-all font-mono"
          title="Evaluator Quick Switch Role"
        >
          <option value="employee">👤 Employee Journey</option>
          <option value="manager">💼 Manager Journey</option>
          <option value="admin">👑 Admin Journey</option>
        </select>

        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-red-500 transition-colors"
        >
          Sign Out
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDark}
          className="text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white text-lg transition-colors"
          title="Toggle Night Mode"
        >
          {isDark ? '☀️' : '🌙'}
        </motion.button>
        <div className="flex items-center gap-2.5">
        <div className="text-right">
          <div className="text-[11px] font-semibold text-gray-900 dark:text-white leading-none">{user.name}</div>
          <div className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-white/30 mt-0.5">{user.jobTitle}</div>
        </div>
        <img src={user.avatarUrl} className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/10" alt="" />
        </div>
      </div>
    </header>
  )
}
