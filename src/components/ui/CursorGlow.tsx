import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlow() {
  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)

  // Slightly lazy spring so the glow trails the cursor naturally
  const x = useSpring(rawX, { stiffness: 50, damping: 16, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 50, damping: 16, mass: 0.8 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        x,
        y,
        // Balanced oval — wider than tall but not flat
        width: 720,
        height: 520,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'screen',
        background:
          'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.10) 38%, rgba(59,130,246,0.03) 62%, transparent 78%)',
        filter: 'blur(4px)',
      }}
    />
  )
}
