'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Palette,
  Sparkles,
  Ruler,
  Package,
  Users,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const heroBackground = '/KITCHEN%20and%20DINING/KITCHEN_10%20-%20Photo.png'

const services = [
  {
    icon: Palette,
    title: 'Interior Design & 3D Rendering',
    description:
      'We create beautiful, functional and timeless interior designs for homes, offices, hotels, showrooms and commercial spaces.',
    features: [
      'Living rooms & lounges',
      'Kitchens & Bathrooms',
      'Bedrooms & Wardrobes',
      'Office interiors & Showrooms',
      '3D visualization & Mood boards',
    ],
    tagline: 'Design your dream space with confidence.',
  },
  {
    icon: Package,
    title: 'Construction & Building Solutions',
    description:
      'Reliable construction services for residential and commercial projects in Kenya. From foundations to finishes, we deliver quality construction rooted in integrity.',
    features: [
      'New builds & Extensions',
      'Structural works',
      'Interior & Exterior finishing',
      'Site management',
    ],
  },
  {
    icon: Sparkles,
    title: 'Renovations & Home Makeovers',
    description:
      'Transform your home or office with elegant renovation solutions using premium materials such as hardwood floors, designer tiles, lighting upgrades and custom cabinetry.',
    features: [
      'Complete home transformations',
      'Premium materials',
      'Custom cabinetry',
      'Lighting upgrades',
    ],
    tagline: 'Defining Spaces, Flawlessly.',
  },
  {
    icon: Palette,
    title: 'Landscaping & Garden Design',
    description: 'We design, plant and maintain stunning landscapes that elevate outdoor living spaces. Our landscaping integrates lush lawns, vibrant flowers and strategic plant placement.',
    features: [
      'Garden design & planning',
      'Plant selection & placement',
      'Garden maintenance',
      'Outdoor living spaces',
    ],
    tagline: 'We Don\'t Just Plant. We Plan, Execute & Maintain.',
  },
  {
    icon: Users,
    title: 'Project Supervision',
    description: 'Professional end-to-end project supervision for seamless execution. Our supervisors coordinate every stage ensuring quality, safety and timely delivery.',
    features: [
      'End-to-end coordination',
      'Quality assurance',
      'Timeline management',
      'Problem anticipation',
    ],
  },
  {
    icon: Ruler,
    title: 'Architectural Drawings & Consultancy',
    description: 'Expert architectural design services including building plans, floor layouts, technical drawings and submission-ready plans.',
    features: [
      'Building plans',
      'Floor layouts',
      'Technical drawings',
      'Submission-ready plans',
    ],
  },
  {
    icon: Package,
    title: 'Imported Furniture (On Order)',
    description: 'We supply premium-quality imported furniture including office furniture, lounge sets, dining sets, outdoor furniture and office partitions.',
    features: [
      'Office furniture',
      'Lounge & Dining sets',
      'Outdoor furniture',
      'Office partitions',
    ],
    tagline: 'Modern, durable and available on confirmed order.',
  },
  {
    icon: Sparkles,
    title: 'Home Décor & Accessories',
    description: 'We curate elegant décor pieces that add warmth, personality and style. From textiles to accessories, we complete your space with the perfect finishing touches.',
    features: [
      'Curated décor pieces',
      'Textiles & accessories',
      'Finishing touches',
      'Style consultation',
    ],
  },
  {
    icon: Shield,
    title: 'Property Management & Rentals',
    description: 'We help property owners maintain, market and manage their rentals with professionalism and transparency.',
    features: [
      'Property maintenance',
      'Marketing & leasing',
      'Tenant management',
      'Transparent reporting',
    ],
  },
]

const process = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We listen to your vision and understand your requirements.',
  },
  {
    step: '02',
    title: 'Design',
    description: 'Our team creates detailed designs and 3D visualizations.',
  },
  {
    step: '03',
    title: 'Selection',
    description: 'Choose from our curated selection of premium materials.',
  },
  {
    step: '04',
    title: 'Execution',
    description: 'We bring your vision to life with expert craftsmanship.',
  },
]

export default function ServicesPage() {
  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Luxury kitchen installation"
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
              Our <span className="text-luxury-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85">
              Explore our full range of professional services including interior design, architectural drawings, construction, renovations, landscaping and imported furniture solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollAnimate key={service.title} delay={index * 0.1} direction="up">
                <Card className="h-full hover:shadow-luxury-lg transition-all duration-300 border-luxury">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-playfair text-2xl">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {service.tagline && (
                      <p className="text-sm font-semibold text-primary italic mt-4">
                        {service.tagline}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container px-6">
          <ScrollAnimate className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A seamless journey from concept to completion
            </p>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <ScrollAnimate key={item.step} delay={index * 0.1} direction="up" className="relative">
                <div className="text-6xl font-playfair font-bold text-primary/10 mb-4">
                  {item.step}
                </div>
                <h3 className="font-playfair text-2xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <ScrollAnimate className="max-w-3xl mx-auto text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Let&apos;s Start Your Project
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a consultation with our design team to discuss your vision.
            </p>
            <Button 
              variant="luxury" 
              size="xl"
              className="bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
              asChild
            >
              <Link href="/consultation">
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </ScrollAnimate>
        </div>
      </section>
    </LuxuryLayout>
  )
}

