import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations'

const phases = [
  { id: 'goal-setting', label: 'Goal Setting', period: 'Jan', color: '#3B82F6', desc: 'Employees submit goals. Managers review and approve. Company OKRs cascade down.' },
  { id: 'q1', label: 'Q1 Check-in', period: 'Apr', color: '#60A5FA', desc: 'First formal progress capture. Log achievements, attach evidence, adjust if needed.' },
  { id: 'q2', label: 'Q2 Check-in', period: 'Jul', color: '#818CF8', desc: 'Mid-year milestone. Flag at-risk goals and trigger corrective conversations early.' },
  { id: 'q3', label: 'Q3 Check-in', period: 'Oct', color: '#A78BFA', desc: 'Late-year review. Final chance to course-correct before annual scoring begins.' },
  { id: 'annual', label: 'Annual Review', period: 'Dec', color: '#C4B5FD', desc: 'Final scores calculated. Year-end summary generated. Archive and plan next cycle.' },
]

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Scroll progress tied to the section element
  // starts when section top hits 80% of viewport, ends when bottom hits 20%
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.25'],
  })

  // Smooth spring on top of the raw scroll so it eases instead of snapping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  })

  // Map 0→1 scroll progress to 0%→100% line width
  const lineWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  // Each node lights up as the line reaches it (at 0%, 25%, 50%, 75%, 100%)
  const nodeThresholds = [0, 0.25, 0.5, 0.75, 1]

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="py-28 px-6 md:px-16 bg-bg-surface border-y border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <FadeUp className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <SectionLabel>Annual Cycle</SectionLabel>
              <SectionHeading>
                One year,{' '}
                <span className="text-gradient-blue">five moments</span>{' '}
                that matter.
              </SectionHeading>
            </div>
            <p className="text-[14px] text-text-muted max-w-[280px] md:text-right leading-relaxed">
              Five clear checkpoints. No ambiguity. No goals falling through the cracks.
            </p>
          </div>
        </FadeUp>

        {/* ── Desktop timeline ── */}
        <div ref={trackRef} className="hidden md:block relative pt-8 pb-4">

          {/* Grey base track */}
          <div className="absolute left-[56px] right-[56px] top-[56px] h-px bg-white/5" />

          {/* Scroll-driven fill line */}
          <div className="absolute left-[56px] right-[56px] top-[56px] h-px overflow-visible">
            <motion.div
              className="h-full origin-left"
              style={{
                width: lineWidth,
                background: 'linear-gradient(90deg, #3B82F6 0%, #818CF8 60%, #C4B5FD 100%)',
                boxShadow: '0 0 8px rgba(59,130,246,0.6)',
              }}
            />
          </div>

          {/* Nodes + labels */}
          <div className="grid grid-cols-5 gap-2">
            {phases.map((p, i) => {
              const threshold = nodeThresholds[i]

              // Node glows when scroll passes its threshold
              const nodeOpacity = useTransform(
                smoothProgress,
                [Math.max(0, threshold - 0.05), threshold],
                [0.3, 1]
              )
              const nodeScale = useTransform(
                smoothProgress,
                [Math.max(0, threshold - 0.08), threshold],
                [0.8, 1]
              )
              const nodeGlow = useTransform(
                smoothProgress,
                [Math.max(0, threshold - 0.05), threshold],
                [`0 0 0px ${p.color}00`, `0 0 14px ${p.color}90`]
              )

              return (
                <div key={p.id} className="flex flex-col items-center text-center">
                  {/* Node */}
                  <motion.div
                    className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-6 cursor-pointer"
                    style={{
                      opacity: nodeOpacity,
                      scale: nodeScale,
                      border: `1px solid ${p.color}30`,
                      background: `radial-gradient(circle, ${p.color}15 0%, transparent 70%)`,
                    }}
                    whileHover={{ scale: 1.3 }}
                  >
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: nodeGlow,
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5"
                    style={{ opacity: nodeOpacity, color: p.color }}
                  >
                    {p.period}
                  </motion.div>
                  <motion.h3
                    style={{ opacity: nodeOpacity }}
                    className="font-display font-semibold text-[13px] tracking-[-0.01em] text-text-primary mb-2"
                  >
                    {p.label}
                  </motion.h3>
                  <motion.p
                    style={{ opacity: nodeOpacity }}
                    className="text-[11px] text-text-muted leading-relaxed px-1"
                  >
                    {p.desc}
                  </motion.p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Mobile vertical timeline ── */}
        <div className="md:hidden relative">
          {/* Base track */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
          {/* Scroll-driven fill */}
          <div className="absolute left-4 top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              className="w-full origin-top"
              style={{
                height: lineWidth, // reuse same progress for height on mobile
                background: 'linear-gradient(180deg, #3B82F6 0%, #C4B5FD 100%)',
              }}
            />
          </div>

          {phases.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex gap-5 pb-8 last:pb-0 pl-2"
            >
              <div
                className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 relative z-10"
                style={{ borderColor: `${p.color}40`, background: `${p.color}10` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: p.color }}>{p.period}</span>
                <h3 className="font-display font-semibold text-[14px] tracking-tight text-text-primary mt-0.5 mb-1">{p.label}</h3>
                <p className="text-[12px] text-text-muted leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
