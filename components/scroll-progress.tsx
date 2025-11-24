'use client'

import * as React from 'react'

/**
 * Scroll Progress Bar
 * Simplified to prevent flashing
 */
export function ScrollProgress() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0
      setProgress(progress)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left transition-transform duration-100"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  )
}

