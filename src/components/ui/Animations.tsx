import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const { ref, inView } = useInView(0.08)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  const { ref, inView } = useInView(0.05)
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay } }
      }}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
}

// Reusable section label (small blue eyebrow)
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-4 h-px bg-blue" />
      <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-blue/80">{children}</span>
    </div>
  )
}

// Reusable section heading
export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display font-bold text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.03em] text-text-primary ${className ?? ''}`}>
      {children}
    </h2>
  )
}
