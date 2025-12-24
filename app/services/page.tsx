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
  Clock,
  ArrowRight,
  Building2,
  Home,
  Wrench,
  Leaf,
  Key,
} from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const heroBackground = '/KITCHEN%20and%20DINING/KITCHEN_10%20-%20Photo.png'

const services = [
  {
    icon: Building2,
    title: 'Building Design Consultancy',
    description:
      'Expert building design consultancy services to help you plan and design your dream space. We provide comprehensive design solutions from concept to completion.',
    features: [
      'Building design concepts',
      'Space planning',
      'Design consultation',
      'Project feasibility studies',
    ],
  },
  {
    icon: Ruler,
    title: 'Architectural Drawings',
    description:
      'Professional architectural drawings and technical documentation for your construction projects. We create detailed plans that meet all regulatory requirements.',
    features: [
      'Building plans',
      'Floor layouts',
      'Technical drawings',
      'Submission-ready plans',
    ],
  },
  {
    icon: Leaf,
    title: 'Landscape Architecture',
    description:
      'Comprehensive landscape architecture services to transform your outdoor spaces. We design beautiful, functional landscapes that complement your property.',
    features: [
      'Landscape design',
      'Site planning',
      'Hardscape design',
      'Sustainable solutions',
    ],
  },
  {
    icon: Palette,
    title: 'Interior Designs',
    description:
      'Beautiful, functional and timeless interior designs for homes, offices, hotels, showrooms and commercial spaces. We create spaces that reflect your style and needs.',
    features: [
      'Living rooms & lounges',
      'Kitchens & Bathrooms',
      'Bedrooms & Wardrobes',
      'Office interiors & Showrooms',
    ],
    tagline: 'Design your dream space with confidence.',
  },
  {
    icon: Sparkles,
    title: '3D Rendering',
    description:
      'Photorealistic 3D visualizations that bring your design concepts to life. See your space before construction begins with our advanced rendering technology.',
    features: [
      '3D visualizations',
      'Virtual walkthroughs',
      'Mood boards',
      'Design presentations',
    ],
  },
  {
    icon: Package,
    title: 'Construction',
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
    icon: Home,
    title: 'Renovations',
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
    icon: Wrench,
    title: 'Home Maintenance and Repairs',
    description:
      'Comprehensive home maintenance and repair services to keep your property in perfect condition. We handle everything from minor fixes to major repairs.',
    features: [
      'Routine maintenance',
      'Emergency repairs',
      'Plumbing & electrical',
      'General repairs',
    ],
  },
  {
    icon: Leaf,
    title: 'Landscaping',
    description:
      'We design, plant and maintain stunning landscapes that enhance outdoor living spaces. Our landscaping integrates lush lawns, vibrant flowers and strategic plant placement.',
    features: [
      'Garden design & planning',
      'Plant selection & placement',
      'Garden maintenance',
      'Outdoor living spaces',
    ],
    tagline: 'We Don\'t Just Plant. We Plan, Execute & Maintain.',
  },
  {
    icon: Key,
    title: 'Rental Sales and Property Management',
    description:
      'Complete property management services including rental sales, tenant management, property maintenance, and transparent reporting for property owners.',
    features: [
      'Rental sales',
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
    description: 'Choose from our created selection of premium materials.',
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
              Schedule a consultation with our designers to discuss your vision.
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

