import { motion } from 'framer-motion'
import { FadeUp, StaggerContainer, staggerItem, SectionLabel, SectionHeading } from '../ui/Animations'

const roles = [
  {
    role: 'Employee',
    color: '#3B82F6',
    dimColor: 'rgba(59,130,246,0.06)',
    borderColor: 'rgba(59,130,246,0.15)',
    capabilities: [
      'Set personal goals aligned to team OKRs',
      'Submit goals for manager approval',
      'Log quarterly progress with evidence',
      'View shared team goals and contributions',
      'Track personal performance score',
      'Access historical goal archive',
    ]
  },
  {
    role: 'Manager',
    color: '#818CF8',
    dimColor: 'rgba(129,140,248,0.06)',
    borderColor: 'rgba(129,140,248,0.15)',
    capabilities: [
      'Review and approve team member goals',
      'Reject or request revisions with comments',
      'Create shared goals for the entire team',
      'Monitor real-time team progress dashboard',
      'Conduct and sign off quarterly check-ins',
      'View cross-functional dependencies',
    ]
  },
  {
    role: 'Admin',
    color: '#A78BFA',
    dimColor: 'rgba(167,139,250,0.06)',
    borderColor: 'rgba(167,139,250,0.15)',
    capabilities: [
      'Configure goal cycles and review periods',
      'Manage users, teams, and hierarchies',
      'View org-wide goal completion analytics',
      'Export reports for board or HR review',
      'Full audit trail access across all users',
      'Set company-level OKRs and priorities',
    ]
  }
]

export function Roles() {
  return (
    <section id="roles" className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <SectionLabel>Who it's for</SectionLabel>
              <SectionHeading>
                Same portal.{' '}
                <span className="text-gradient-blue">Different lens.</span>
              </SectionHeading>
            </div>
            <p className="text-[14px] text-text-muted max-w-[280px] md:text-right leading-relaxed">
              Nexus adapts its interface and permissions to show each person exactly what they need.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.12}>
          {roles.map(r => (
            <motion.div
              key={r.role}
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: r.borderColor }}
              className="relative p-7 rounded-xl border border-border cursor-default transition-all duration-200 overflow-hidden"
              style={{ background: r.dimColor }}
            >
              {/* Top accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-0 left-0 right-0 h-px origin-left"
                style={{ background: `linear-gradient(90deg, ${r.color}, transparent)` }}
              />

              <div className="mb-5">
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: r.color }}>
                  {r.role}
                </div>
                <h3 className="font-display font-bold text-[22px] tracking-[-0.02em] text-text-primary">
                  What you can do
                </h3>
              </div>

              <ul className="space-y-3">
                {r.capabilities.map((cap, i) => (
                  <motion.li
                    key={cap}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-2.5 text-[13px] text-text-muted"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5" style={{ color: r.color }}>
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {cap}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
