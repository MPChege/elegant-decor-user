'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { triggerHaptic } from '@/lib/utils'

/**
 * StickyCTABar Component
 * Mobile-optimized sticky bottom bar with haptic feedback
 */
export function StickyCTABar() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 300)
    })
    return () => unsubscribe()
  }, [scrollY])

  const handleCTAClick = () => {
    triggerHaptic('medium')
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-luxury-lg p-4">
        <div className="container flex items-center justify-between gap-3">
          <Button
            variant="luxury"
            className="flex-1"
            asChild
            onClick={handleCTAClick}
          >
            <Link href="/consultation">
              <MessageCircle className="mr-2 h-4 w-4" />
              Book Consultation
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            asChild
            onClick={handleCTAClick}
          >
            <a href="tel:+254700000000">
              <Phone className="h-4 w-4" />
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            asChild
            onClick={handleCTAClick}
          >
            <a href="mailto:hello@eleganttiles.co.ke">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

