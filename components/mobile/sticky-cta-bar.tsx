'use client'

import * as React from 'react'
import Link from 'next/link'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { triggerHaptic } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * StickyCTABar Component
 * Mobile-optimized sticky bottom bar with haptic feedback
 * Supports safe area insets for notched devices
 */
export function StickyCTABar() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = () => {
    triggerHaptic('medium')
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 safe-bottom",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-luxury-lg p-3 sm:p-4">
        <div className="container flex items-center justify-between gap-2 sm:gap-3">
          <Button
            variant="luxury"
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base touch-target"
            asChild
            onClick={handleCTAClick}
          >
            <Link href="/consultation">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Book </span>Consultation
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 sm:h-12 sm:w-12 touch-target"
            asChild
            onClick={handleCTAClick}
          >
            <a href="tel:+254710602110" aria-label="Call us">
              <Phone className="h-5 w-5" />
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 sm:h-12 sm:w-12 touch-target"
            asChild
            onClick={handleCTAClick}
          >
            <a href="mailto:info@elegantdecor.co.ke" aria-label="Email us">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

