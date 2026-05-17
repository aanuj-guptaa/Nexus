import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-bg-base/70 backdrop-blur-xl"
    >
      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-14">

        {/* Logo + coordinates */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-blue flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="3.5" height="3.5" fill="white" />
                <rect x="5.5" y="1" width="3.5" height="3.5" fill="white" fillOpacity="0.45" />
                <rect x="1" y="5.5" width="3.5" height="3.5" fill="white" fillOpacity="0.45" />
                <rect x="5.5" y="5.5" width="3.5" height="3.5" fill="white" fillOpacity="0.2" />
              </svg>
            </div>
            <span className="font-hero font-black text-[14px] tracking-[0.08em] text-white uppercase">Nexus</span>
            <span className="text-[10px] text-text-subtle font-mono ml-0.5 mt-0.5">V1.0</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Features', 'Roles', 'Cycle', 'FAQ'].map(link => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              whileHover={{ color: '#FFFFFF' }}
              className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-muted transition-colors"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Login CTA */}
        <Link to="/portal">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="font-hero font-bold text-[11px] tracking-[0.1em] uppercase bg-blue text-white px-5 py-2 rounded-sm"
          >
            Login →
          </motion.button>
        </Link>
      </nav>

      {/* Coordinates sub-bar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-2 flex items-center gap-4">
        <span className="text-[9px] font-mono text-text-subtle tracking-widest">N · 47.0214° · OBJECTIVES</span>
        <span className="text-text-subtle/30">·</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
          <span className="text-[9px] font-mono text-text-subtle tracking-widest">INTERNAL GOAL OS / Q1 — Q4 CYCLE ACTIVE</span>
        </div>
      </div>
    </motion.header>
  )
}
