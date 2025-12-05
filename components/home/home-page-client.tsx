'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductsCarousel } from '@/components/products/products-carousel'
import { ProjectsCarousel } from '@/components/projects/projects-carousel'
import { ScrollAnimate } from '@/components/scroll-animate'
import type { PublicProject } from '@/lib/public-api'

const heroTitles = [
  { main: 'Transform Your Space', accent: 'With Elegant Design' },
  { main: 'We Design & Build', accent: 'Homes & Offices' },
  { main: 'From Concept to Reality', accent: 'We Bring Your Vision to Life' },
]

const services = [
  {
    title: 'Building Design Consultancy',
    description: 'Expert building design consultancy services to help you plan and design your dream space',
    icon: '🏛️',
  },
  {
    title: 'Architectural Drawings',
    description: 'Professional architectural drawings and technical documentation for your construction projects',
    icon: '📐',
  },
  {
    title: 'Landscape Architecture',
    description: 'Comprehensive landscape architecture services to transform your outdoor spaces',
    icon: '🌳',
  },
  {
    title: 'Interior Designs',
    description: 'Beautiful, functional and timeless interior designs for homes, offices, hotels and commercial spaces',
    icon: '✨',
  },
  {
    title: '3D Rendering',
    description: 'Photorealistic 3D visualizations that bring your design concepts to life',
    icon: '🎨',
  },
  {
    title: 'Construction',
    description: 'Reliable construction services for residential and commercial projects in Kenya',
    icon: '🏗️',
  },
  {
    title: 'Renovations',
    description: 'Transform your home or office with elegant renovation solutions using premium materials',
    icon: '🔨',
  },
  {
    title: 'Home Maintenance and Repairs',
    description: 'Comprehensive home maintenance and repair services to keep your property in perfect condition',
    icon: '🔧',
  },
  {
    title: 'Landscaping',
    description: 'Design, plant and maintain stunning landscapes that elevate outdoor living spaces',
    icon: '🌿',
  },
  {
    title: 'Rental Sales and Property Management',
    description: 'Complete property management services including rental sales, tenant management and property maintenance',
    icon: '🔑',
  },
]

const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '15+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Design Awards' },
]

const heroImages = [
  '/BEDROOMS/MASTER%20BED_1%20-%20Photo.png',
  '/BEDROOMS/MASTER%20BED_2%20-%20Photo.png',
  '/BEDROOMS/MASTER%20BED_3%20-%20Photo.png',
  '/BEDROOMS/MASTER%20BED_4%20-%20Photo.png',
  '/BEDROOMS/MASTER%20BED_5%20-%20Photo.png',
]

const featuredProjects = [
  {
    title: 'Spa Retreat Ensuite',
    category: 'Bathrooms',
    image: '/BATHROOMS/bathroom_1%20-%20Photo.png',
  },
  {
    title: 'Contemporary Master Suite',
    category: 'Bedrooms',
    image: '/BEDROOMS/master%20bedroom_1%20-%20Photo.png',
  },
  {
    title: 'Gourmet Entertainer Kitchen',
    category: 'Kitchen & Dining',
    image: '/KITCHEN%20and%20DINING/KITCHEN_5%20-%20Photo.png',
  },
]

const signatureSpaces = [
  {
    title: 'Sanctuary Bathrooms',
    description: 'Marble-clad oases with bespoke vanities and warm lighting.',
    image: '/BATHROOMS/bathroom_2%20-%20Photo.png',
  },
  {
    title: 'Curated Bedrooms',
    description: 'Layered textures and couture built-ins for restful suites.',
    image: '/BEDROOMS/GUEST%20BEDROOM_2%20-%20Photo.png',
  },
  {
    title: 'Statement Foyers',
    description: 'Grand entrances with sculptural lighting and art moments.',
    image: '/FOYERS/FOYER%20REV_1%20-%20Photo.png',
  },
  {
    title: 'Elevated Dining',
    description: 'Tailored for conversation, from bespoke banquettes to wine walls.',
    image: '/KITCHEN%20and%20DINING/KITCHEN_8%20-%20Photo.png',
  },
  {
    title: 'Corporate Luxury',
    description: 'Lehigh reception concepts that merge hospitality and brand.',
    image: '/LEHIGH/RECEPTION%20FINAL_7%20-%20Photo.png',
  },
  {
    title: 'Executive Offices',
    description: 'Boardroom timber, brass, and panoramic glazing for focus.',
    image: '/OFFICE/office%20and%20bbq_1%20-%20Photo.png',
  },
  {
    title: 'Outdoor Living',
    description: 'Pools, pergolas, and lounges that glow after dusk.',
    image: '/OUTDOOR/updated_5%20-%20Photo.png',
  },
  {
    title: 'Sacred Spaces',
    description: 'Prayer rooms with serene palettes and intricate detailing.',
    image: '/PRAYER%20ROOM/prayer%20room_2%20-%20Photo.png',
  },
]

const collageImages = {
  primary: '/BEDROOMS/MASTER%20BED_3%20-%20Photo.png',
  secondary: '/KITCHEN%20and%20DINING/pano_1%20-%20Photo.png',
  accent: '/OUTDOOR/jacuzzi%20rev_2%20-%20Photo.png',
}

// Auto-scrolling spaces component
function AutoScrollSpaces({ spaces }: { spaces: typeof signatureSpaces }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (!scrollRef.current || isPaused) return

    const scrollContainer = scrollRef.current
    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const scroll = () => {
      if (scrollContainer && !isPaused) {
        scrollPosition += scrollSpeed
        scrollContainer.scrollLeft = scrollPosition

        // Reset scroll position when reaching halfway (since we duplicate the content)
        const maxScroll = scrollContainer.scrollWidth / 2
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0
          scrollContainer.scrollLeft = 0
        }

        animationFrameId = requestAnimationFrame(scroll)
      }
    }

    // Start the animation
    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPaused])

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex gap-4 pb-4 hide-scrollbar overflow-x-auto"
        style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Render spaces twice for seamless loop */}
        {[...spaces, ...spaces].map((space, index) => (
          <div key={`${space.title}-${index}`} className="flex-shrink-0 w-64 md:w-72">
            <Card className="border-0 shadow-lg hover:shadow-luxury-lg transition-all duration-500 group h-full flex flex-col overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src={space.image}
                  alt={space.title}
                  fill
                  sizes="(min-width: 768px) 288px, 256px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
                <div className="absolute bottom-3 left-3 text-white font-playfair text-lg md:text-xl">
                  {space.title}
                </div>
              </div>
              <CardContent className="flex-1 flex items-center justify-center px-4 py-4 text-center">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-balance">
                  {space.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

// Auto-scrolling services component with mobile support
function AutoScrollServices({ servicesList }: { servicesList: typeof services }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    // On mobile, allow manual scrolling only
    if (isMobile || !scrollRef.current || isPaused) return

    const scrollContainer = scrollRef.current
    let scrollPosition = 0
    const scrollSpeed = 0.4 // pixels per frame
    let animationFrameId: number

    const scroll = () => {
      if (scrollContainer && !isPaused && !isMobile) {
        scrollPosition += scrollSpeed
        scrollContainer.scrollLeft = scrollPosition

        // Reset scroll position when reaching halfway (since we duplicate the content)
        const maxScroll = scrollContainer.scrollWidth / 2
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0
          scrollContainer.scrollLeft = 0
        }

        animationFrameId = requestAnimationFrame(scroll)
      }
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPaused, isMobile])

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => !isMobile && setIsPaused(true)}
      onMouseLeave={() => !isMobile && setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume after a short delay on mobile
        setTimeout(() => setIsPaused(false), 2000)
      }}
    >
      <div
        ref={scrollRef}
        className={`flex gap-4 md:gap-6 pb-4 overflow-x-auto ${
          isMobile ? 'snap-x snap-mandatory' : 'hide-scrollbar'
        }`}
        style={{ 
          scrollBehavior: isMobile ? 'smooth' : 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Render services twice for seamless loop on desktop */}
        {isMobile 
          ? servicesList.map((service, index) => (
              <div 
                key={`${service.title}-${index}`} 
                className="flex-shrink-0 w-[85vw] sm:w-80 snap-center"
              >
                <Card className="h-full hover:shadow-luxury-lg transition-all duration-300 border-luxury group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          : [...servicesList, ...servicesList].map((service, index) => (
              <div 
                key={`${service.title}-${index}`} 
                className="flex-shrink-0 w-72 md:w-80"
              >
                <Card className="h-full hover:shadow-luxury-lg transition-all duration-300 border-luxury group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
        }
      </div>
      {/* Scroll indicator for mobile */}
      {isMobile && (
        <div className="flex justify-center mt-4 gap-2">
          {servicesList.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-primary/30"
            />
          ))}
        </div>
      )}
    </div>
  )
}

import type { PublicProduct } from '@/lib/public-api'

interface HomePageClientProps {
  projects: PublicProject[]
  products?: PublicProduct[]
}

export function HomePageClient({ projects, products }: HomePageClientProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0)
  const [currentTitleIndex, setCurrentTitleIndex] = React.useState(0)

  React.useEffect(() => {
    const imageInterval = window.setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Switch images every 5 seconds

    const titleInterval = window.setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % heroTitles.length)
    }, 4000) // Switch titles every 4 seconds

    return () => {
      window.clearInterval(imageInterval)
      window.clearInterval(titleInterval)
    }
  }, [])

  return (
    <>
      {/* Hero Section - Auto-switching images */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={image}
                alt={`Luxury master bedroom ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-20" />
        </div>
        <div className="container px-6 py-20 text-center relative z-10 text-white">
          <ScrollAnimate>
            <Badge variant="luxury" className="mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Elegant Tiles & Décor Centre Ltd
            </Badge>
          </ScrollAnimate>

          <div className="min-h-[200px] md:min-h-[280px] flex items-center justify-center mb-6">
            {heroTitles.map((title, index) => (
              <h1
                key={index}
                className={`font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-balance absolute transition-opacity duration-1000 ${
                  index === currentTitleIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {title.main}
                <br />
                <span className="text-luxury-gradient">{title.accent}</span>
              </h1>
            ))}
          </div>

          <ScrollAnimate delay={0.2}>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 text-balance">
              We design, build and elevate homes, offices and outdoor spaces with modern interior design, construction excellence and curated décor solutions.
            </p>
          </ScrollAnimate>

          <ScrollAnimate delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="luxury" 
                size="xl" 
                className="bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
                asChild
              >
                <Link href="/products">
                  Buy a Product
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="bg-white text-primary border-2 border-primary font-bold shadow-xl hover:bg-primary hover:text-white hover:shadow-2xl hover:scale-105"
                asChild
              >
                <Link href="/consultation">Book a Design Consultation</Link>
              </Button>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Products Carousel Section - Immediately after hero */}
      <ProductsCarousel products={products} />

      {/* Signature Spaces Section - Auto-scrolling */}
      <section className="pt-6 md:pt-8 pb-12 bg-muted/20">
        <div className="container px-6">
          <ScrollAnimate>
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                Spaces We Curate
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                A glimpse into the bathrooms, bedrooms, foyers, kitchens, and beyond that define Elegant Tiles & Décor.
              </p>
            </div>
          </ScrollAnimate>

          <AutoScrollSpaces spaces={signatureSpaces} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-playfair text-4xl md:text-5xl font-bold text-luxury-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section - Animated/Moving */}
      <section className="py-20">
        <div className="container px-6">
          <ScrollAnimate>
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
                What We Do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our Core Services
              </p>
            </div>
          </ScrollAnimate>

          <AutoScrollServices servicesList={services} />

          <div className="text-center mt-12">
            <Button 
              variant="luxury" 
              size="lg"
              className="bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
              asChild
            >
              <Link href="/services">
                Explore All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <ScrollAnimate>
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover elegant transformations in homes, offices, showrooms and outdoor spaces across Kenya.
              </p>
            </div>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <ScrollAnimate key={project.title} delay={index * 0.1} direction="up">
                <Link href="/work" className="group block">
                  <Card className="overflow-hidden border-luxury hover:shadow-luxury-lg transition-all duration-300">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        quality={95}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <Badge variant="luxury" className="mb-2">
                          {project.category}
                        </Badge>
                        <h3 className="font-playfair text-2xl font-bold text-white">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollAnimate>
            ))}
          </div>

          {/* Real Projects Carousel - Horizontal Scroll */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-center">
                Our Latest Projects
              </h3>
              <ProjectsCarousel projects={projects.slice(0, 10)} />
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/work">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <ScrollAnimate direction="right">
              <div>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Why Choose
                  <br />
                  <span className="text-luxury-gradient">Elegant Tiles?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We bring together decades of expertise, award-winning design,
                  and unwavering commitment to excellence.
                </p>

                <div className="space-y-4">
                  {[
                    'Experienced design team',
                    'High-quality workmanship',
                    'Transparent communication',
                    'Custom design solutions',
                    'Timely project delivery',
                    'Access to premium finishes & imported fittings',
                    'End-to-end supervision',
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="luxury" 
                  size="lg"
                  className="mt-8 bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
                  asChild
                >
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </ScrollAnimate>

            <ScrollAnimate direction="left">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-luxury-lg">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={collageImages.primary}
                      alt="Master bedroom suite by Elegant Tiles"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={collageImages.secondary}
                      alt="Chef-grade kitchen installation"
                      fill
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover"
                      quality={95}
                    />
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={collageImages.accent}
                      alt="Outdoor spa terrace"
                      fill
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover"
                      quality={95}
                    />
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let&apos;s bring your vision to life with our award-winning design
              expertise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="luxury" 
                size="xl"
                className="bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
                asChild
              >
                <Link href="/consultation">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section - Moved to bottom */}
      <ScrollAnimate>
        <section className="py-20 bg-card">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                <strong>Elegant Tiles & Décor Centre Ltd</strong> is a leading interior design, construction and landscaping company in Kenya committed to helping clients bring their vision to life.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From concept design to full implementation, we ensure every project is beautifully planned, expertly executed and delivered on time.
              </p>
              <p className="text-xl font-semibold text-primary mt-6">
                We listen – We Create – You Enjoy.
              </p>
            </div>
          </div>
        </section>
      </ScrollAnimate>
    </>
  )
}


