'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import type { PublicProject } from '@/lib/public-api'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'

const heroBackground = '/OUTDOOR/updated_3%20-%20Photo.png'

interface WorkPageClientProps {
  projects: PublicProject[]
}

export function WorkPageClient({ projects }: WorkPageClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    projects.forEach((project) => {
      if (project.tags && project.tags.length > 0) {
        project.tags.forEach((tag) => cats.add(tag))
      }
      if (project.description) {
        // optional: ignore
      }
    })
    // In portfolio context it's more typical to filter by a semantic category field;
    // if backend provides one in tags (e.g. "Residential"), we reuse that here.
    return ['All', ...Array.from(cats)]
  }, [projects])

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) =>
          (project.tags ?? []).includes(selectedCategory)
        )

  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Elegant outdoor lounge project"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/45 to-background/95" />
        <div className="container px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our <span className="text-luxury-gradient">Work</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85">
              A portfolio of exceptional design projects that showcase our
              commitment to excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-y border-border">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Filter by tag:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'luxury' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container px-6">
          {filteredProjects.length === 0 ? (
            <p className="text-muted-foreground">
              No projects found. Please check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <Link href={`/work/${project.slug}`}>
                    <Card className="group overflow-hidden border-luxury hover:shadow-luxury-lg transition-all duration-300 cursor-pointer">
                      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                        <Image
                          src={getPublicMediaUrl(
                            project.featured_image_key ||
                              project.featured_image ||
                              project.images?.[0]
                          )}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent z-10" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <Badge variant="luxury" className="mb-3">
                            {project.client_name || 'Project'}
                          </Badge>
                          <h3 className="font-playfair text-2xl font-bold mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.location && `${project.location} • `}
                            {project.year ?? ''}
                          </p>
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </LuxuryLayout>
  )
}


