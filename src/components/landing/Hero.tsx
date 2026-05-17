import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Word-by-word stagger reveal from below
const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  show: (delay: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.75, delay }
  })
}

// Individual animated department bar in the dashboard
function DeptBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-mono tracking-[0.12em] uppercase text-text-muted w-24 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-blue"
        />
      </div>
      <span className="text-[9px] font-mono text-text-muted w-6 text-right">{pct}%</span>
    </div>
  )
}

export function Hero() {
  const navigate = useNavigate()
  // Heading lines config — each word gets its own clip container for the reveal
  const line1 = [{ text: 'Own', cls: 'text-white' }]
  const line2 = [{ text: 'every', cls: 'text-white' }, { text: 'goal.', cls: 'text-blue' }]
  const line3 = [{ text: 'Ship', cls: 'text-white/30' }, { text: 'the', cls: 'text-white/30' }, { text: 'year.', cls: 'text-white/30' }]

  const lines = [line1, line2, line3]
  let wordIndex = 0

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-bg-base"
      style={{ paddingTop: '80px' }}
    >
      {/* ── Starfield dots ── */}
      <StarField />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 max-w-[1400px] mx-auto w-full px-6 md:px-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 py-16">

        {/* Left: giant heading */}
        <div className="flex-1 min-w-0">
          {/* Heading */}
          <div className="mb-8">
            {lines.map((words, li) => {
              return (
                <div key={li} className="flex items-baseline flex-wrap leading-none" style={{ marginBottom: li === 1 ? '0.05em' : '0' }}>
                  {words.map(({ text, cls }) => {
                    const delay = 0.1 + wordIndex++ * 0.06
                    return (
                      <div key={text} className="overflow-hidden mr-[0.1em]">
                        <motion.span
                          className={`block font-hero font-black uppercase ${cls}`}
                          style={{ fontSize: li === 0 ? 'clamp(80px,14vw,160px)' : li === 1 ? 'clamp(60px,11vw,130px)' : 'clamp(50px,9vw,110px)', lineHeight: 0.88, letterSpacing: '-0.02em' }}
                          custom={delay}
                          initial="hidden"
                          animate="show"
                          variants={wordVariants}
                        >
                          {text}
                        </motion.span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[14px] md:text-[15px] text-text-muted leading-relaxed max-w-[400px] mb-10"
          >
            Nexus is the internal operating system for goals — where employees draft, managers approve, and teams track quarterly progress in real time. One source of truth from January to Annual review.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3"
          >
            <motion.button
              onClick={() => navigate('/portal')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="font-hero font-black text-[12px] tracking-[0.12em] uppercase bg-blue text-white px-8 py-3.5 rounded-sm flex items-center gap-3"
            >
              Login to Nexus
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
            <motion.button
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
              whileTap={{ scale: 0.97 }}
              className="font-hero font-black text-[12px] tracking-[0.12em] uppercase border border-white/10 text-text-muted px-8 py-3.5 rounded-sm transition-all"
            >
              See the System
            </motion.button>
          </motion.div>
        </div>

        {/* Right: Dashboard card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[320px] shrink-0"
        >
          <div className="border border-white/8 rounded-sm bg-bg-elevated/80 backdrop-blur-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-[9px] font-mono tracking-[0.14em] uppercase text-text-muted">Live · Cycle 2026</span>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-blue"
                />
                <span className="text-[9px] font-mono tracking-[0.14em] uppercase text-blue">Sync</span>
              </div>
            </div>

            <div className="p-4">
              {/* Score */}
              <p className="text-[9px] font-mono tracking-[0.14em] uppercase text-text-muted mb-2">Org Progress Score</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="font-hero font-black text-[52px] leading-none tracking-tight mb-5"
              >
                <CountUp to={87} className="text-blue" /><span className="text-white">%</span>
              </motion.div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { label: 'Goals', value: '1,284', color: 'text-white' },
                  { label: 'On Track', value: '912', color: 'text-blue' },
                  { label: 'Pending', value: '48', color: 'text-orange-400' },
                  { label: 'Approved', value: '1,201', color: 'text-white' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + i * 0.07 }}
                    className="bg-bg-base border border-white/5 rounded-sm p-3"
                  >
                    <div className="text-[9px] font-mono tracking-[0.1em] uppercase text-text-muted mb-1">{s.label}</div>
                    <div className={`font-hero font-black text-[22px] leading-none tracking-tight ${s.color}`}>{s.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Department bars */}
              <div className="space-y-3">
                <DeptBar label="Engineering" pct={92} delay={1.1} />
                <DeptBar label="Product" pct={78} delay={1.18} />
                <DeptBar label="Design" pct={84} delay={1.26} />
                <DeptBar label="GTM" pct={67} delay={1.34} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 flex items-center justify-between max-w-[1400px] mx-auto w-full px-6 md:px-10 pb-8"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-2 text-[9px] font-mono tracking-[0.15em] uppercase text-text-subtle"
        >
          [Scroll ↓]
        </motion.div>
        <div className="text-[9px] font-mono tracking-[0.1em] text-text-subtle">
          ⊕ Made with Nexus
        </div>
      </motion.div>
    </section>
  )
}

// Real count-up animation from 0 → target
function CountUp({ to, className }: { to: number; className?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1600 // ms
    const step = 16 // ~60fps
    const increment = to / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)

    // Start with a small delay so it begins after mount animation
    const timeout = setTimeout(() => { /* already started */ }, 900)

    return () => { clearInterval(timer); clearTimeout(timeout) }
  }, [to])

  return <span className={className}>{count}</span>
}

// Subtle starfield background
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.4 + 0.05,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
