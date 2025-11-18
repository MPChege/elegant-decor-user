import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchPublicProject } from '@/lib/public-api'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'

export const dynamic = 'force-dynamic'

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  return await fetchPublicProject(slug)
}

export async function generateMetadata(
  { params }: WorkDetailPageProps
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found | Elegant Tiles & Décor',
      description: 'The project you are looking for could not be found.',
    }
  }

  return {
    title: `${project.title} | Elegant Tiles & Décor Projects`,
    description: project.description || undefined,
  }
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return (
      <LuxuryLayout>
        <section className="py-20">
          <div className="container px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">
              Project Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button variant="luxury" asChild>
              <Link href="/work">Back to Our Work</Link>
            </Button>
          </div>
        </section>
      </LuxuryLayout>
    )
  }

  const heroImage = getPublicMediaUrl(
    project.featured_image_key ||
      project.featured_image ||
      project.images?.[0]
  )

  const galleryImages = project.images ?? []

  return (
    <LuxuryLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroImage}
          alt={project.title}
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
            className="max-w-3xl"
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-6 text-white hover:text-white/90 hover:bg-white/10"
            >
              <Link href="/work">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Our Work
              </Link>
            </Button>
            <Badge variant="luxury" className="mb-4">
              {project.client_name || 'Featured Project'}
            </Badge>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              {project.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
              )}
              {project.year && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {project.year}
                </span>
              )}
              {project.tags && project.tags.length > 0 && (
                <span>{project.tags.join(' • ')}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="container px-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            {project.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container px-6">
            <h2 className="font-playfair text-3xl font-bold mb-8 text-center">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((img, index) => (
                <div
                  key={img + index}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
                >
                  <Image
                    src={getPublicMediaUrl(img)}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </LuxuryLayout>
  )
}


