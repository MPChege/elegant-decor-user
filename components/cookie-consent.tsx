'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9998] p-4 md:p-6 pointer-events-none"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-xl pointer-events-auto">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Cookie Icon */}
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cookie className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-playfair text-xl md:text-2xl font-bold mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                    <a 
                      href="/privacy" 
                      className="text-primary hover:underline font-semibold"
                    >
                      Learn more
                    </a>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAccept}
                      variant="luxury"
                      size="lg"
                      className="bg-primary text-white font-bold tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept All Cookies
                    </Button>
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      size="lg"
                      className="border-2 hover:bg-muted"
                    >
                      Decline
                    </Button>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDecline}
                  className="flex-shrink-0 absolute top-4 right-4 md:relative md:top-0 md:right-0"
                  aria-label="Close cookie consent"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

