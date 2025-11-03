'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/search/global-search'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Our Work', href: '/work' },
  { name: 'Products', href: '/products' },
  { name: 'Journal', href: '/journal' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const { scrollY } = useScroll()
  
  // Header background opacity based on scroll
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10])

  React.useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else if (systemPrefersDark) {
      // If no saved preference, use system preference
      setTheme('dark')
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      // Default to light
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <>
      <motion.header
        style={{
          backdropFilter: useTransform(
            headerBlur,
            (value) => `blur(${Math.max(value, 10)}px)`
          ),
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 glass-liquid"
      >
        <nav className="container flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-playfair text-2xl font-bold text-luxury-gradient"
            >
              Elegant Tiles
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary relative py-2',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Global Search */}
            <GlobalSearch />
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden sm:flex"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* CTA Button */}
            <Button variant="luxury" size="sm" className="hidden md:flex" asChild>
              <Link href="/contact">Get Started</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          x: mobileMenuOpen ? 0 : '100%',
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-[73px] right-0 bottom-0 z-40 w-full max-w-sm bg-background border-l border-border shadow-luxury-lg lg:hidden"
      >
        <nav className="flex flex-col space-y-4 p-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary py-2',
                pathname === item.href ? 'text-primary' : 'text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border space-y-3">
            {/* Theme Toggle for Mobile */}
            <Button
              variant="outline"
              size="lg"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-full flex items-center justify-center gap-2"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5" />
                  Switch to Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  Switch to Light Mode
                </>
              )}
            </Button>
            <Button variant="luxury" size="lg" className="w-full" asChild>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}

