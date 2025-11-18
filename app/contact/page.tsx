'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const heroBackground = '/PRAYER%20ROOM/prayer%20room_1%20-%20Photo.png'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+254 700 000 000', '+254 711 000 000'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['hello@eleganttiles.co.ke', 'info@eleganttiles.co.ke'],
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['123 Design Street', 'Karen, Nairobi, Kenya'],
  },
  {
    icon: Clock,
    title: 'Hours',
    details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
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

      // Hide success message after 5 seconds
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
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Serene consultation lounge"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-background/95" />
        <div className="container px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Get In <span className="text-luxury-gradient">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85">
              Let&apos;s discuss how we can transform your space into something
              extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-luxury-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail) => (
                      <p
                        key={detail}
                        className="text-sm text-muted-foreground"
                      >
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-3xl font-bold mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 700 000 000"
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
                  />
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
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map/Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-3xl font-bold mb-6">
                Visit Our Showroom
              </h2>
              <div className="aspect-square rounded-2xl bg-muted overflow-hidden mb-6">
                {/* Placeholder for map */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">
                    Experience our luxury showroom
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Visit our showroom to explore our extensive collection of
                    premium tiles and materials. Our design consultants are
                    available to help you find the perfect solution for your
                    project.
                  </p>
                  <Button variant="outline" className="w-full">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

