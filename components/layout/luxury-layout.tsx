'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LuxuryLayoutProps {
  children: React.ReactNode
  className?: string
  ambient?: boolean
  parallax?: boolean
}

/**
 * LuxuryLayout Component
 * Simplified wrapper without flashing animations
 */
export function LuxuryLayout({
  children,
  className,
  ambient = true,
}: LuxuryLayoutProps) {
  return (
    <div className={cn('relative min-h-screen', className)}>
      {/* Ambient Background Effect - Static, no animation */}
      {ambient && (
        <div className="fixed inset-0 -z-10 ambient-background">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          {/* Static Glow Elements - No animation to prevent flashing */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[120px] opacity-50" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[100px] opacity-40" />
        </div>
      )}

      {/* Content - No animation wrapper, instant display */}
      {children}
    </div>
  )
}

