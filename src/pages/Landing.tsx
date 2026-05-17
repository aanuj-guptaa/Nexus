import { motion } from 'framer-motion'
import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { ValueProp } from '../components/landing/ValueProp'
import { Features } from '../components/landing/Features'
import { Roles } from '../components/landing/Roles'
import { Timeline } from '../components/landing/Timeline'
import { FAQ } from '../components/landing/FAQ'
import { CTA } from '../components/landing/CTA'
import { Footer } from '../components/landing/Footer'
import { CursorGlow } from '../components/ui/CursorGlow'

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-bg-base text-text-primary overflow-x-hidden"
    >
      {/* Global cursor glow — fixed overlay, works across all sections */}
      <CursorGlow />

      <Navbar />
      <Hero />
      <ValueProp />
      <Features />
      <Roles />
      <Timeline />
      <FAQ />
      <CTA />
      <Footer />
    </motion.div>
  )
}
