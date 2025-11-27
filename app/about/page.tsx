'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Users, Target, Heart, ArrowRight, MapPin, Phone, Mail } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ScrollAnimate } from '@/components/scroll-animate'
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

// Team data - reserved for future team section
// const team = [
//   {
//     name: 'Sarah Kamau',
//     role: 'Creative Director',
//     bio: '15+ years in luxury interior design',
//   },
//   {
//     name: 'David Ochieng',
//     role: 'Lead Designer',
//     bio: 'Award-winning architectural designer',
//   },
//   {
//     name: 'Amina Hassan',
//     role: 'Project Manager',
//     bio: 'Expert in seamless project execution',
//   },
//   {
//     name: 'James Mwangi',
//     role: 'Senior Consultant',
//     bio: 'Specialist in luxury residential design',
//   },
// ]

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
              Elegant Tiles & Décor Centre Ltd - Full-service interior design and construction company in Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimate direction="right">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  <strong>Elegant Tiles & Décor Centre Ltd</strong> is a full-service interior design and construction company based in Nairobi, delivering stylish, functional and timeless spaces. With decades of combined experience, we specialize in interior design, renovations, construction, landscaping and project supervision for residential and commercial properties.
                </p>
                <p className="text-lg leading-relaxed">
                  We began with a simple mission — to help clients visualize their dream spaces before building. Over the years, we expanded from supplying premium interior finishes to offering complete design, construction and turnkey project solutions.
                </p>
                <p className="text-lg leading-relaxed font-semibold text-foreground">
                  Today, ETD is known for excellence, integrity and detail-oriented craftsmanship.
                </p>
              </div>
            </ScrollAnimate>

            <ScrollAnimate direction="left">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-luxury-lg relative">
                <Image
                  src="/KITCHEN%20and%20DINING/pano_2%20-%20Photo.png"
                  alt="Behind the scenes of Elegant Tiles & Décor"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container px-6">
          <ScrollAnimate className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ScrollAnimate key={value.title} delay={index * 0.1} direction="up">
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
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <ScrollAnimate className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Leadership
            </h2>
          </ScrollAnimate>

          <div className="max-w-3xl mx-auto">
              <ScrollAnimate className="text-center">
              <div className="mb-6">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <h3 className="font-playfair text-3xl font-bold mb-2">
                  Dr. Vivian Shabaan
                </h3>
                <p className="text-xl text-primary font-semibold mb-4">
                  Director – Elegant Tiles & Décor Centre Ltd
                </p>
                <blockquote className="text-lg text-muted-foreground max-w-2xl mx-auto italic border-l-4 border-primary pl-6 my-6">
                  &ldquo;My passion is transforming homes through creative, resourceful and personalized projects. Stunning interior design is always possible with the right vision — even when you Do It Yourself!&rdquo;
                </blockquote>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <ScrollAnimate direction="right">
              <Card className="h-full border-luxury">
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-playfair text-3xl font-bold mb-4">Mission</h3>
                  <p className="text-muted-foreground">
                    To create elegant, functional and inspiring spaces through thoughtful design, superior customer experience and quality workmanship.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimate>
            <ScrollAnimate direction="left">
              <Card className="h-full border-luxury">
                <CardContent className="p-8">
                  <Award className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-playfair text-3xl font-bold mb-4">Vision</h3>
                  <p className="text-muted-foreground">
                    To be Kenya&apos;s most trusted brand for interior design, construction and premium home solutions.
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Our Locations
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-luxury hover:shadow-luxury-lg transition-all">
                <CardContent className="p-8">
                  <h3 className="font-playfair text-2xl font-bold mb-4">Nairobi</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Mageta road, Lavington, Nairobi Kenya</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="tel:+254710602110" className="text-muted-foreground hover:text-primary">+254 710 602110</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="mailto:info@elegantdecor.co.ke" className="text-muted-foreground hover:text-primary">info@elegantdecor.co.ke</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-luxury hover:shadow-luxury-lg transition-all">
                <CardContent className="p-8">
                  <h3 className="font-playfair text-2xl font-bold mb-4">Thika</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Giant complex, Thika road, Thika Kenya</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="tel:+254710602110" className="text-muted-foreground hover:text-primary">+254 710 602110</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <a href="mailto:info@elegantdecor.co.ke" className="text-muted-foreground hover:text-primary">info@elegantdecor.co.ke</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              Let&apos;s Create Something Beautiful
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

