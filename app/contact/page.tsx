'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Truck, 
  Shield, 
  Headphones, 
  BadgeCheck,
  ArrowRight
} from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const heroBackground = '/PRAYER%20ROOM/prayer%20room_1%20-%20Photo.png'

const locations = [
  {
    city: 'Nairobi',
    address: 'Mageta road, Lavington, Nairobi Kenya',
    phone: '+254 710 602110',
    email: 'info@elegantdecor.co.ke',
    mapUrl: 'https://maps.google.com/?q=Lavington+Nairobi+Kenya',
    gradient: 'from-primary/20 to-accent/10',
  },
  {
    city: 'Thika',
    address: 'Giant complex, Thika road, Thika Kenya',
    phone: '+254 710 602110',
    email: 'info@elegantdecor.co.ke',
    mapUrl: 'https://maps.google.com/?q=Thika+Kenya',
    gradient: 'from-accent/20 to-primary/10',
  },
]

const features = [
  {
    icon: Truck,
    title: 'Timely Delivery',
    description: 'Projects & products delivered on schedule',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Safe Payment',
    description: '100% secure payment',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Headphones,
    title: '24/7 Help Center',
    description: 'Dedicated 24/7 support',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: BadgeCheck,
    title: 'Value for Money',
    description: 'Affordable & elegant',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Us 24/7',
    details: '+254 710 602110',
    action: 'tel:+254710602110',
    cta: 'Call Now',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@elegantdecor.co.ke',
    action: 'mailto:info@elegantdecor.co.ke',
    cta: 'Send Email',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: 'Mon - Sat: 8AM - 6PM',
    action: null,
    cta: null,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'general',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Serene consultation lounge"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-background/95" />
        <div className="container px-4 sm:px-6 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="luxury" className="mb-4 sm:mb-6 text-xs sm:text-sm">
              Got Question? We&apos;re Here 24/7
            </Badge>
            <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              Get In <span className="text-luxury-gradient">Touch</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/85 mb-6 sm:mb-8 px-2">
              Let&apos;s discuss how we can transform your space into something
              extraordinary.
            </p>
            <a 
              href="tel:+254710602110" 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-white/20 transition-all touch-target"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-sm sm:text-base">+254 710 602110</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-6 sm:py-8 bg-card border-y border-border">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-2 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${feature.bg} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm truncate">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {contactInfo.map((info) => (
              <Card key={info.title} className="text-center hover:shadow-luxury-lg transition-all duration-300 border-luxury group">
                  <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{info.title}</h3>
                  <p className="text-muted-foreground mb-4">{info.details}</p>
                  {info.action && info.cta && (
                    <a href={info.action}>
                      <Button variant="outline" size="sm" className="w-full">
                        {info.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-luxury-gradient">Locations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our showrooms in Nairobi and Thika to explore our extensive collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {locations.map((location) => (
              <Card key={location.city} className="overflow-hidden border-luxury hover:shadow-luxury-lg transition-all group">
                <div className={`h-2 bg-gradient-to-r ${location.gradient}`} />
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-bold mb-1">{location.city}</h3>
                      <p className="text-muted-foreground text-sm">Showroom Location</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{location.address}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-sm hover:text-primary transition-colors">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href={`mailto:${location.email}`} className="text-sm hover:text-primary transition-colors">
                        {location.email}
                      </a>
                    </div>
                  </div>

                  <a href={location.mapUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                  </a>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & About Store */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="font-playfair text-3xl font-bold mb-2">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-6">
                Have a question or need assistance? We&apos;ll respond within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitSuccess && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5" />
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                      className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                      className="h-12"
                  />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 700 000 000"
                      className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Project Inquiry"
                      className="h-12"
                  />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full h-14 bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-[1.02] border-2 border-primary text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* About Store */}
            <div>
              <Card className="h-full border-luxury overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardContent className="p-8">
                  <h2 className="font-playfair text-3xl font-bold mb-4">
                    About The <span className="text-luxury-gradient">Store</span>
              </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    We specialize in full range of home & Office interiors, Imported fully fitted Kitchens, 
                    Bathroom Vanity sets, and much more. Our expert team is dedicated to transforming your 
                    spaces with elegant, high-quality solutions.
                  </p>

                  {/* Call CTA */}
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-8">
                    <p className="text-sm text-muted-foreground mb-2">Got Question? Call us 24/7!</p>
                    <a href="tel:+254710602110" className="flex items-center gap-3 group">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-playfair text-2xl font-bold text-primary block">
                          +254 710 602110
                        </span>
                        <span className="text-xs text-muted-foreground">Available 24/7</span>
                      </div>
                    </a>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Visit Us At
                    </h4>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Nairobi Showroom</p>
                        <p className="text-sm text-muted-foreground">Mageta road, Lavington, Nairobi, Kenya</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Thika Showroom</p>
                        <p className="text-sm text-muted-foreground">Giant complex, Thika road, Thika, Kenya</p>
                      </div>
                    </div>
                  </div>

                  {/* Learn More */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <Link href="/about">
                  <Button variant="outline" className="w-full">
                        Learn More About Us
                        <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </LuxuryLayout>
  )
}
