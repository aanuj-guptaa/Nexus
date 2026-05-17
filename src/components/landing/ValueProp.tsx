import { motion } from 'framer-motion'
import { FadeUp, StaggerContainer, staggerItem, SectionLabel, SectionHeading } from '../ui/Animations'
import { useCountUp } from '../../hooks/useInView'

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, count } = useCountUp(value)
  return (
    <motion.div ref={ref} whileHover={{ y: -2 }} className="border-l border-border pl-5">
      <div className="font-display font-bold text-[32px] tracking-[-0.03em] text-text-primary leading-none">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[12px] text-text-muted mt-1.5">{label}</div>
    </motion.div>
  )
}

const featureCards = [
  {
    icon: '⌘',
    title: 'Business Alignment',
    desc: 'Every goal cascades from company OKRs. No one works in a vacuum.'
  },
  {
    icon: '◈',
    title: 'Progress Transparency',
    desc: 'Quarterly check-ins and real-time scoring eliminate ambiguity.'
  },
  {
    icon: '◎',
    title: 'Structured Approvals',
    desc: 'Formal approval workflows replace scattered spreadsheets and email.'
  },
  {
    icon: '⊞',
    title: 'Organisation Clarity',
    desc: 'Admins see every goal across every team. Spot risks before they land.'
  }
]

export function ValueProp() {
  return (
    <section className="py-28 px-6 md:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <FadeUp>
            <SectionLabel>Why Nexus</SectionLabel>
            <SectionHeading className="mb-5">
              From scattered spreadsheets to a{' '}
              <span className="text-gradient-blue">single source</span>{' '}
              of truth.
            </SectionHeading>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-[400px]">
              Goal-setting shouldn't be an annual ceremony buried in email. Nexus makes it a living part of how your team works every day.
            </p>

            {/* Stats row */}
            <div className="flex gap-10 mt-12 pt-8 border-t border-border">
              <StatCard value={94} suffix="%" label="goal completion rate" />
              <StatCard value={3200} suffix="+" label="goals tracked" />
              <StatCard value={40} suffix="%" label="less review time" />
            </div>
          </FadeUp>

          {/* Right: Cards */}
          <StaggerContainer className="grid grid-cols-2 gap-3" staggerDelay={0.1}>
            {featureCards.map(f => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.25)' }}
                className="p-5 bg-bg-card rounded-xl border border-border cursor-default transition-colors"
              >
                <div className="text-[20px] text-blue mb-3 font-light">{f.icon}</div>
                <h3 className="font-display font-semibold text-[13px] tracking-[-0.01em] text-text-primary mb-2">{f.title}</h3>
                <p className="text-[12px] text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
