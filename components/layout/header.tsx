'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/search/global-search'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/work' },
  { name: 'Products', href: '/products' },
  { name: 'Journal', href: '/journal' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const headerBackgrounds: Record<string, string> = {
  '/': '/BEDROOMS/MASTER%20BED_2%20-%20Photo.png',
  '/services': '/KITCHEN%20and%20DINING/KITCHEN_6%20-%20Photo.png',
  '/work': '/OUTDOOR/updated_4%20-%20Photo.png',
  '/products': '/FOYERS/FOYER%20REV_3%20-%20Photo.png',
  '/journal': '/LEHIGH/RECEPTION%20FINAL_9%20-%20Photo.png',
  '/about': '/OFFICE/office%20and%20bbq_2%20-%20Photo.png',
  '/contact': '/PRAYER%20ROOM/prayer%20room_3%20-%20Photo.png',
}

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const currentBackground = headerBackgrounds[pathname] ?? headerBackgrounds['/']

  React.useEffect(() => {
    // Initialize theme from localStorage, defaulting to light mode
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initialTheme = savedTheme ?? 'light'

    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')

    if (!savedTheme) {
      localStorage.setItem('theme', initialTheme)
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-lg overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-background/40 backdrop-blur-xl" />
        <nav className="container flex items-center justify-between py-2 md:py-3 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-12 md:h-14 w-auto">
              {/* Light Mode Logo (white background) - visible on light backgrounds */}
              <Image
                src="/etd logo.jpeg"
                alt="Elegant Tiles & Décor Centre"
                width={240}
                height={80}
                className={cn(
                  "h-12 md:h-14 w-auto object-contain transition-all duration-300",
                  theme === 'light' 
                    ? 'opacity-100 relative' 
                    : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
                priority
              />
              {/* Dark Mode Logo (transparent background) - visible on dark backgrounds */}
              <Image
                src="/etd_logo-removebg-preview.png"
                alt="Elegant Tiles & Décor Centre"
                width={240}
                height={80}
                className={cn(
                  "h-12 md:h-14 w-auto object-contain transition-all duration-300",
                  theme === 'dark' 
                    ? 'opacity-100 relative' 
                    : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-xs md:text-sm font-medium transition-colors hover:text-primary relative py-1.5',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
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
            <Button 
              variant="luxury" 
              size="sm" 
              className="hidden md:flex bg-primary text-white font-bold tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary"
              asChild
            >
              <Link href="/consultation">Get Started</Link>
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
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-[57px] md:top-[61px] right-0 bottom-0 z-40 w-full max-w-sm bg-background border-l border-border shadow-luxury-lg lg:hidden transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
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
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}

