'use client'

import * as React from 'react'
import Link from 'next/link'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    icon: Palette,
    title: 'Interior Design',
    description:
      'Bespoke interior design solutions that reflect your personality and lifestyle.',
    features: [
      'Concept development',
      'Space planning',
      '3D visualization',
      'Material selection',
    ],
  },
  {
    icon: Sparkles,
    title: 'Luxury Tiles',
    description:
      'Premium tiles sourced from the finest manufacturers around the world.',
    features: [
      'Italian marble',
      'Ceramic & porcelain',
      'Natural stone',
      'Custom patterns',
    ],
  },
  {
    icon: Ruler,
    title: 'Project Management',
    description:
      'End-to-end project execution with meticulous attention to detail.',
    features: [
      'Timeline planning',
      'Budget management',
      'Quality control',
      'Site supervision',
    ],
  },
  {
    icon: Package,
    title: 'Custom Fabrication',
    description: 'Tailored solutions for unique design requirements.',
    features: [
      'Custom sizing',
      'Special finishes',
      'Unique patterns',
      'Bespoke designs',
    ],
  },
  {
    icon: Users,
    title: 'Design Consultation',
    description: 'Expert advice to help you make informed design decisions.',
    features: [
      'Style guidance',
      'Material advice',
      'Color schemes',
      'Budget planning',
    ],
  },
  {
    icon: Shield,
    title: 'Installation & Warranty',
    description: 'Professional installation with comprehensive warranty coverage.',
    features: [
      'Expert installers',
      'Quality assurance',
      'Lifetime warranty',
      'After-sales support',
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
      <section className="py-20 md:py-32">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our <span className="text-luxury-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Comprehensive design solutions that transform spaces into timeless
              works of art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
                    <ul className="space-y-2">
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A seamless journey from concept to completion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Clock className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Let's Start Your Project
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
          </motion.div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

