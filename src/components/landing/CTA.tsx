import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FadeUp, SectionHeading } from '../ui/Animations'

export function CTA() {
  return (
    <section className="py-28 px-6 md:px-16 bg-bg-surface border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.5] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue/[0.06] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-4 h-px bg-blue" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-blue/80">Ready to start</span>
            <div className="w-4 h-px bg-blue" />
          </div>

          <SectionHeading className="text-[48px] md:text-[64px] !leading-[0.95] mb-6">
            Step into{' '}
            <span className="text-gradient-blue">the cycle.</span>
          </SectionHeading>

          <p className="text-[16px] text-text-muted max-w-[400px] mx-auto leading-relaxed mb-12">
            Stop tracking goals in spreadsheets. Start a real performance cycle that works for your whole organisation — in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/portal">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 48px rgba(59,130,246,0.5)' }}
                whileTap={{ scale: 0.96 }}
                className="font-display font-bold text-[15px] tracking-[-0.02em] bg-blue text-white px-9 py-3.5 rounded-md flex items-center gap-2"
              >
                Login to Nexus
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ borderColor: 'rgba(59,130,246,0.4)', color: '#F0F0FF' }}
              className="font-display font-semibold text-[14px] tracking-[-0.01em] text-text-muted border border-border px-7 py-3.5 rounded-md transition-all"
            >
              Request a demo
            </motion.button>
          </div>

          <p className="mt-8 text-[11px] text-text-subtle tracking-wide">
            No credit card · SSO ready · Works with your existing org structure
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
