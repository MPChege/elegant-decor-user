'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import type { PublicProject } from '@/lib/public-api'

interface ProjectsCarouselProps {
  projects: PublicProject[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      return () => container.removeEventListener('scroll', checkScrollability)
    }
  }, [projects])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 400
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (projects.length === 0) return null

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="rounded-full"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="rounded-full"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 pb-4 min-w-max px-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group flex-shrink-0 w-80 md:w-96"
            >
              <Card className="overflow-hidden border-luxury hover:shadow-luxury-lg transition-all duration-300 h-full">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={
                      getPublicMediaUrl(
                        project.featured_image_key || project.featured_image
                      ) || project.images?.[0] || '/file.svg'
                    }
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 384px, 320px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    {project.tags && project.tags.length > 0 && (
                      <Badge variant="luxury" className="mb-2">
                        {project.tags[0]}
                      </Badge>
                    )}
                    <h3 className="font-playfair text-2xl font-bold text-white mb-1">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-white/80">{project.location}</p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

