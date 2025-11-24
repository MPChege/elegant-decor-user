'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Truck,
  Shield,
  Headphones,
  BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Work', href: '/work' },
    { name: 'Services', href: '/services' },
    { name: 'Our Approach', href: '/approach' },
  ],
  resources: [
    { name: 'Journal', href: '/journal' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const features = [
  { icon: Truck, title: 'Timely Delivery', description: 'Projects & products' },
  { icon: Shield, title: 'Safe Payment', description: '100% secure' },
  { icon: Headphones, title: '24/7 Support', description: 'Dedicated help' },
  { icon: BadgeCheck, title: 'Value for Money', description: 'Affordable & elegant' },
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]

export function Footer() {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const { toast } = useToast()

  React.useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      toast({
        title: 'Success!',
        description: data.message || 'Subscribed successfully',
      })

      setEmail('')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Features Strip */}
      <div className="border-b border-border">
        <div className="container px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div>
              <Link href="/" className="inline-block mb-4">
                <div className="relative h-20 md:h-24 w-auto">
                  <Image
                    src="/etd logo.jpeg"
                    alt="Elegant Tiles & Décor Centre"
                    width={280}
                    height={100}
                    className={cn(
                      "h-20 md:h-24 w-auto object-contain transition-all duration-300",
                      theme === 'light' 
                        ? 'opacity-100 relative' 
                        : 'opacity-0 absolute inset-0 pointer-events-none'
                    )}
                    priority
                  />
                  <Image
                    src="/etd_logo-removebg-preview.png"
                    alt="Elegant Tiles & Décor Centre"
                    width={280}
                    height={100}
                    className={cn(
                      "h-20 md:h-24 w-auto object-contain transition-all duration-300",
                      theme === 'dark' 
                        ? 'opacity-100 relative' 
                        : 'opacity-0 absolute inset-0 pointer-events-none'
                    )}
                    priority
                  />
                </div>
              </Link>
              <p className="text-muted-foreground mb-6 text-sm">
                We specialize in full range of home & Office interiors, Imported fully fitted Kitchens, Bathroom Vanity sets, and much more.
              </p>
              
              {/* Call Us CTA */}
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-1">Got Question? Call us 24/7!</p>
                <a href="tel:+254710602110" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">+254 710 602110</span>
                </a>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Nairobi</div>
                    <div className="text-muted-foreground text-xs">Mageta road, Lavington, Kenya</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Thika</div>
                    <div className="text-muted-foreground text-xs">Giant complex, Thika road, Kenya</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:info@elegantdecor.co.ke" className="hover:text-primary text-xs">info@elegantdecor.co.ke</a>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get design inspiration and exclusive updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="luxury"
                size="sm"
                className="w-full bg-primary text-white font-bold tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Elegant Tiles & Décor Centre Ltd. All
            rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}


