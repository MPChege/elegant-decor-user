'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Palette,
  Ruler,
  Hammer,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    icon: Lightbulb,
    title: 'Discovery & Consultation',
    description:
      'We begin by understanding your vision, lifestyle, and design preferences through in-depth consultations.',
    details: [
      'Initial consultation meeting',
      'Site visit and measurements',
      'Lifestyle and needs assessment',
      'Budget discussion',
    ],
  },
  {
    icon: Palette,
    title: 'Concept Development',
    description:
      'Our designers create detailed concepts and mood boards that bring your vision to life.',
    details: [
      'Design concept presentation',
      'Material and color selection',
      '3D visualizations',
      'Mood board creation',
    ],
  },
  {
    icon: Ruler,
    title: 'Planning & Refinement',
    description:
      'We refine every detail, from measurements to material specifications, ensuring perfection.',
    details: [
      'Detailed floor plans',
      'Technical specifications',
      'Timeline planning',
      'Budget finalization',
    ],
  },
  {
    icon: Hammer,
    title: 'Expert Execution',
    description:
      'Our skilled craftsmen bring the design to life with meticulous attention to detail.',
    details: [
      'Professional installation',
      'Quality control checks',
      'Regular progress updates',
      'Site management',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Completion & Support',
    description:
      'We ensure your complete satisfaction and provide ongoing support for your investment.',
    details: [
      'Final walkthrough',
      'Quality assurance',
      'Maintenance guidance',
      'Lifetime warranty support',
    ],
  },
]

const principles = [
  {
    title: 'Client-Centric',
    description: 'Your vision guides every decision we make.',
  },
  {
    title: 'Quality First',
    description: 'We never compromise on materials or craftsmanship.',
  },
  {
    title: 'Timeless Design',
    description: 'We create spaces that remain elegant for years.',
  },
  {
    title: 'Transparent Process',
    description: 'Clear communication at every stage of the project.',
  },
]

export default function ApproachPage() {
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
              Our <span className="text-luxury-gradient">Approach</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A proven methodology that transforms visions into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-muted/30">
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
              Five carefully crafted stages that ensure exceptional results
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-luxury hover:shadow-luxury-lg transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-1 bg-primary/5 flex items-center justify-center p-8">
                      <div className="text-6xl font-playfair font-bold text-primary/20">
                        0{index + 1}
                      </div>
                    </div>
                    <CardContent className="lg:col-span-11 p-8 lg:p-12">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            {step.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {step.details.map((detail) => (
                              <div
                                key={detail}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-sm">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Principles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The core values that drive everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-luxury-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
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
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Experience Our Approach
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let&apos;s start your journey to exceptional design.
            </p>
            <Button variant="luxury" size="xl" asChild>
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

