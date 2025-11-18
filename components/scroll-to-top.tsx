'use client'

import * as React from 'react'
import { motion, useScroll } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Scroll to Top Button
 * Appears when user scrolls down
 */
export function ScrollToTop() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 400)
    })
    return () => unsubscribe()
  }, [scrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 right-6 z-40 lg:bottom-8 lg:right-8"
    >
      <Button
        variant="luxury"
        size="icon"
        className="h-12 w-12 rounded-full shadow-luxury-lg"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </motion.div>
  )
}

