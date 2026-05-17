import { motion } from 'framer-motion'
import { FadeUp, StaggerContainer, staggerItem, SectionLabel, SectionHeading } from '../ui/Animations'

const features = [
  {
    title: 'Smart Goal Validation',
    desc: 'AI-assisted prompts ensure every goal is specific, measurable, and aligned before submission.',
    tag: 'Intelligent',
    visual: (
      <div className="mt-5 space-y-2.5">
        {[['Specific', 78], ['Measurable', 92], ['Time-bound', 85]].map(([l, p], i) => (
          <div key={l as string} className="flex items-center gap-2.5">
            <span className="text-[10px] text-text-muted w-20 shrink-0">{l as string}</span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${p}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full bg-blue rounded-full"
              />
            </div>
            <span className="text-[10px] text-blue font-semibold w-8 text-right">{p}%</span>
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Approval Workflow',
    desc: 'Structured manager review with comment threads, states, and a full audit trail.',
    tag: 'Structured',
    visual: (
      <div className="mt-5 flex items-center gap-2">
        {[
          { label: 'Draft', color: '#374151' },
          { label: 'In Review', color: '#FBBF24', glow: true },
          { label: 'Approved', color: '#3B82F6' },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 350 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color, boxShadow: s.glow ? `0 0 8px ${s.color}` : undefined }}
              />
              <span className="text-[9px] text-text-muted">{s.label}</span>
            </motion.div>
            {i < 2 && <div className="w-5 h-px bg-border mb-2" />}
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Quarterly Check-ins',
    desc: 'Mandatory progress captures per quarter. Evidence-based, timestamped, auditable.',
    tag: 'Automated',
    visual: (
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {['Goal Set', 'Q1', 'Q2', 'Q3'].map((q, i) => (
          <div
            key={q}
            className={`py-1.5 px-1 rounded text-center text-[9px] font-semibold border tracking-wide ${
              i <= 1
                ? 'border-blue/40 bg-blue/10 text-blue'
                : 'border-border text-text-muted bg-bg-elevated'
            }`}
          >
            {q}
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Real-time Scoring',
    desc: 'Weighted scores roll up to team dashboards — managers get a live pulse on performance.',
    tag: 'Live',
    visual: (
      <div className="mt-5 flex items-end gap-1 h-9">
        {[40, 55, 48, 70, 65, 82, 87].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
            className="flex-1 rounded-sm"
            style={{ background: i === 6 ? '#3B82F6' : `rgba(59,130,246,${0.2 + i * 0.05})` }}
          />
        ))}
      </div>
    )
  },
  {
    title: 'Shared Team Goals',
    desc: 'Assign a goal across multiple contributors. Track individual progress within shared objectives.',
    tag: 'Collaborative',
    visual: (
      <div className="mt-5 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[21, 22, 23, 24].map(u => (
            <div key={u} className="w-6 h-6 rounded-full border-2 border-bg-card overflow-hidden">
              <img src={`https://i.pravatar.cc/24?u=${u}`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-bg-card bg-bg-elevated text-[8px] text-text-muted font-semibold flex items-center justify-center">
            +3
          </div>
        </div>
        <span className="text-[11px] text-text-muted">7 contributors</span>
      </div>
    )
  },
  {
    title: 'Audit Trail',
    desc: 'Every change, comment, approval, and edit is timestamped. Full accountability, always.',
    tag: 'Compliant',
    visual: (
      <div className="mt-5 space-y-2">
        {[
          ['Goal created', 'Jan 3'],
          ['Submitted', 'Jan 5'],
          ['Approved', 'Jan 7'],
        ].map(([e, d]) => (
          <div key={e} className="flex items-center gap-2 text-[10px] text-text-muted">
            <div className="w-1 h-1 rounded-full bg-border-hover shrink-0" />
            <span className="flex-1">{e}</span>
            <span className="text-text-subtle">{d}</span>
          </div>
        ))}
      </div>
    )
  },
]

export function Features() {
  return (
    <section id="features" className="py-28 px-6 md:px-16 bg-bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <SectionLabel>Platform Features</SectionLabel>
              <SectionHeading>
                Built for the way{' '}
                <span className="text-gradient-blue">real teams</span>{' '}
                operate.
              </SectionHeading>
            </div>
            <p className="text-[14px] text-text-muted max-w-[280px] md:text-right leading-relaxed">
              Every feature was designed around how managers, employees, and admins actually work.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.07}>
          {features.map(f => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.2)' }}
              className="p-6 bg-bg-card rounded-xl border border-border transition-all duration-200 cursor-default group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-[13px] tracking-[-0.01em] text-text-primary">{f.title}</h3>
                <span className="ml-2 shrink-0 text-[8px] font-bold tracking-widest uppercase text-blue/60 bg-blue/8 px-2 py-0.5 rounded-full border border-blue/15">
                  {f.tag}
                </span>
              </div>
              <p className="text-[12px] text-text-muted leading-relaxed">{f.desc}</p>
              {f.visual}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
