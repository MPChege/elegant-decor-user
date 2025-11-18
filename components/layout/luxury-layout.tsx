'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LuxuryLayoutProps {
  children: React.ReactNode
  className?: string
  ambient?: boolean
  parallax?: boolean
}

/**
 * LuxuryLayout Component
 * Wraps pages with ambient background, smooth transitions, and subtle lighting effects
 */
export function LuxuryLayout({
  children,
  className,
  ambient = true,
}: LuxuryLayoutProps) {
  return (
    <div className={cn('relative min-h-screen', className)}>
      {/* Ambient Background Effect */}
      {ambient && (
        <div className="fixed inset-0 -z-10 ambient-background">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          {/* Luxury Glow Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px]"
          />
        </div>
      )}

      {/* Content with Page Transition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>

      {/* Luxury Cursor Effect (Desktop only) */}
      <LuxuryCursor />
    </div>
  )
}

/**
 * Luxury Cursor Component
 * Custom cursor with glassmorphic effect
 */
function LuxuryCursor() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null
  }

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden lg:block"
      animate={{
        x: position.x - 20,
        y: position.y - 20,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-primary/50 bg-primary/5 backdrop-blur-sm" />
    </motion.div>
  )
}

