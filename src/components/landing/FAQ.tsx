import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, SectionLabel, SectionHeading } from '../ui/Animations'

const faqs = [
  { q: 'Can employees see other employees\' goals?', a: 'By default, goals are visible within your team. Managers can mark specific goals as private. Shared/team goals are always visible to all contributors.' },
  { q: 'What happens if a manager rejects a goal?', a: 'The employee receives a notification with the manager\'s comments. They can revise and resubmit within the submission window, or escalate to HR if there\'s a dispute.' },
  { q: 'How are progress scores calculated?', a: 'Each goal has a target value and a current value. The score is calculated as a weighted percentage of completion across all goals for the period.' },
  { q: 'Can goals be changed after approval?', a: 'Minor updates can be made at any check-in with manager sign-off. Major changes require a formal revision flow. All edits are timestamped in the audit trail.' },
  { q: 'Is data exportable for payroll or HR systems?', a: 'Yes. Admins can export goal summaries, completion scores, and annual reports as CSV or PDF, compatible with most HRMS platforms.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <FadeUp>
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>
            Questions,{' '}
            <span className="text-gradient-blue">answered</span>{' '}
            real.
          </SectionHeading>
          <p className="text-[14px] text-text-muted leading-relaxed mt-4 mb-8 max-w-[280px]">
            Still have questions? Reach out to your admin or our support team.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, borderColor: 'rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="font-display font-semibold text-[13px] text-blue border border-blue/25 px-5 py-2.5 rounded-md hover:bg-blue/5 transition-all tracking-[-0.01em]"
          >
            Contact Support →
          </motion.button>
        </FadeUp>

        {/* Accordion */}
        <FadeUp delay={0.15}>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <motion.button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 focus:outline-none"
                  whileHover="hovered"
                >
                  <motion.span
                    variants={{
                      hovered: { color: '#60A5FA' }
                    }}
                    transition={{ duration: 0.18 }}
                    className="font-display font-medium text-[14px] tracking-[-0.01em] text-text-primary"
                  >
                    {faq.q}
                  </motion.span>
                  <motion.div
                    animate={{ rotate: open === i ? 45 : 0 }}
                    variants={{
                      hovered: { borderColor: 'rgba(59,130,246,0.5)', color: '#60A5FA' }
                    }}
                    transition={{ duration: 0.18 }}
                    className="shrink-0 w-5 h-5 rounded-full border border-border flex items-center justify-center text-text-muted"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </motion.button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[13px] text-text-muted leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
