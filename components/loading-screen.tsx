'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 second loading animation

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <Image
                src="/etd_logo-removebg-preview.png"
                alt="Elegant Tiles & Décor Logo"
                width={150}
                height={150}
                className="mx-auto mb-4"
                priority
              />
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                Elegant Tiles & Décor
              </h1>
              <p className="text-muted-foreground text-sm">
                Where Elegance Meets Design
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
