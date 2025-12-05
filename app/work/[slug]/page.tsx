import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase' // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectGallery } from '@/components/projects/project-gallery'
import type { PublicProject } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string): Promise<PublicProject | null> {
  try {
    // Clean the slug (trim whitespace)
    const cleanSlug = slug.trim()
    
    // Try with status filter first
    let data: Record<string, unknown> | null = null
    let error: unknown = null
    
    const publishedResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', cleanSlug)
      .eq('status', 'published')
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (!publishedResult.error && publishedResult.data) {
      data = publishedResult.data
      error = null
    } else {
      // If not found with status filter, try without status filter
      const result: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('slug', cleanSlug)
        .single() as { data: Record<string, unknown> | null; error: unknown }
      
      if (!result.error && result.data) {
        data = result.data
        error = null
      } else {
        // Try by id as fallback
        const idResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
          .from('projects')
          .select('*')
          .eq('id', cleanSlug)
          .single() as { data: Record<string, unknown> | null; error: unknown }
        
        if (!idResult.error && idResult.data) {
          data = idResult.data
          error = null
        } else {
          // Last resort: try case-insensitive slug match
          const allProjects: { data: Record<string, unknown>[] | null; error: unknown } = await supabaseAdmin
            .from('projects')
            .select('*') as { data: Record<string, unknown>[] | null; error: unknown }
          
          if (!allProjects.error && allProjects.data) {
            const matched = allProjects.data.find(
              (p: Record<string, unknown>) => 
                (p.slug as string)?.toLowerCase().trim() === cleanSlug.toLowerCase()
            )
            if (matched) {
              data = matched
              error = null
            }
          }
        }
      }
    }

    if (error || !data) {
      return null
    }

    const project = data as Record<string, unknown>
    
    // Convert image keys to full URLs (admin dashboard stores in 'media' bucket)
    const imagesArray = Array.isArray(project.images) ? (project.images as string[]) : []
    const images = imagesArray
      .filter((img): img is string => Boolean(img && typeof img === 'string'))
      .map((img: string) => getPublicMediaUrl(img, 'media'))

    // featured_image is stored as a key string in the database
    const imageKey = (project.featured_image as string) || null
    const featuredImage = imageKey
      ? getPublicMediaUrl(imageKey, 'media')
      : images[0] || null

    return {
      id: project.id as string,
      title: project.title as string,
      slug: (project.slug as string) || (project.id as string),
      description: (project.description as string) || null,
      short_description: null,
      client_name: (project.client_name as string) || null,
      location: (project.location as string) || null,
      year: (project.year as number) || null,
      completion_date: (project.completion_date as string) || null,
      featured_image: featuredImage,
      featured_image_key: imageKey,
      images: images,
      tags: (project.tags as string[]) || [],
      featured: (project.featured as boolean) || false,
      seo_title: (project.seo_title as string) || null,
      seo_description: (project.seo_description as string) || null,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
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
    notFound()
  }

  const heroImage = project.featured_image || project.images?.[0] || null
  // Combine featured image with gallery images, avoiding duplicates
  const allImages = project.images ?? []
  const featuredImageUrl = project.featured_image
  const galleryImages = featuredImageUrl && !allImages.includes(featuredImageUrl)
    ? [featuredImageUrl, ...allImages]
    : allImages

  return (
    <LuxuryLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover absolute inset-0 -z-10"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/45 to-background/95" />
        <div className="container px-6 text-white">
          <div className="max-w-3xl">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-6 text-white hover:text-white/90 hover:bg-white/10"
            >
              <Link href="/work">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
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
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="container px-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            {project.description && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-playfair">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
            {project.completion_date && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Completed: {new Date(project.completion_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container px-6">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-12 text-center">
              Project Gallery
            </h2>
            <ProjectGallery images={galleryImages} projectTitle={project.title} />
          </div>
        </section>
      )}
    </LuxuryLayout>
  )
}
