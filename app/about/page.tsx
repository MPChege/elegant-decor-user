'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Users, Target, Heart, ArrowRight } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const heroBackground = '/BEDROOMS/Bedroom%2002_3%20-%20Photo.png'

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for perfection in every detail of our work.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Design is our passion, and it shows in every project.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with clients to bring their vision to life.',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We embrace new ideas and cutting-edge design trends.',
  },
]

const timeline = [
  {
    year: '2008',
    title: 'Foundation',
    description: 'Elegant Tiles & Décor was founded with a vision to transform spaces.',
  },
  {
    year: '2012',
    title: 'Expansion',
    description: 'Opened our flagship showroom and expanded our team.',
  },
  {
    year: '2018',
    title: 'Awards',
    description: 'Received our first industry recognition for design excellence.',
  },
  {
    year: '2024',
    title: 'Innovation',
    description: 'Launched AI-powered design tools and virtual consultations.',
  },
]

const team = [
  {
    name: 'Sarah Kamau',
    role: 'Creative Director',
    bio: '15+ years in luxury interior design',
  },
  {
    name: 'David Ochieng',
    role: 'Lead Designer',
    bio: 'Award-winning architectural designer',
  },
  {
    name: 'Amina Hassan',
    role: 'Project Manager',
    bio: 'Expert in seamless project execution',
  },
  {
    name: 'James Mwangi',
    role: 'Senior Consultant',
    bio: 'Specialist in luxury residential design',
  },
]

export default function AboutPage() {
  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Elegant interior vignette"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/45 to-background/95" />
        <div className="container px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              About <span className="text-luxury-gradient">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85">
              Transforming spaces into timeless works of art for over 15 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2008, Elegant Tiles & Décor Centre began with a
                  simple mission: to bring world-class design and premium
                  materials to East Africa.
                </p>
                <p>
                  What started as a small tile showroom has grown into a
                  full-service interior design firm, recognized for our
                  commitment to excellence and innovation.
                </p>
                <p>
                  Today, we've completed over 500 projects, earned numerous
                  industry awards, and built lasting relationships with clients
                  who trust us to transform their spaces into extraordinary
                  environments.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-luxury-lg relative">
                <Image
                  src="/KITCHEN%20and%20DINING/pano_2%20-%20Photo.png"
                  alt="Behind the scenes of Elegant Tiles & Décor"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-luxury-lg transition-all duration-300 border-luxury">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Journey
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-8 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="font-playfair text-3xl font-bold text-primary">
                    {item.year}
                  </div>
                </div>
                <div className="flex-shrink-0 w-px bg-border relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-luxury-glow" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-playfair text-2xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Let's Create Something Beautiful
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to transform your space? Get in touch with our team.
            </p>
            <Button 
              variant="luxury" 
              size="xl"
              className="bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
              asChild
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

