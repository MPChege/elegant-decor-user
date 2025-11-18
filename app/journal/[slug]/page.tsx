import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchPublicBlogPost } from '@/lib/public-api'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'

export const dynamic = 'force-dynamic'

interface JournalPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  return await fetchPublicBlogPost(slug)
}

export async function generateMetadata(
  { params }: JournalPostPageProps
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Article Not Found | Elegant Tiles & Décor Journal',
      description: 'The article you are looking for could not be found.',
    }
  }

  return {
    title:
      post.seo_title || `${post.title} | Elegant Tiles & Décor Journal`,
    description: post.seo_description || post.excerpt || undefined,
  }
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <LuxuryLayout>
        <section className="py-20">
          <div className="container px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The journal article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button variant="luxury" asChild>
              <Link href="/journal">Back to Journal</Link>
            </Button>
          </div>
        </section>
      </LuxuryLayout>
    )
  }

  const heroImage = getPublicMediaUrl(
    post.featured_image_key || post.featured_image || post.images?.[0]
  )

  const galleryImages = post.images ?? []

  return (
    <LuxuryLayout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroImage}
          alt={post.title}
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
              <Link href="/journal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journal
              </Link>
            </Button>
            {post.category && (
              <Badge variant="luxury" className="mb-4">
                {post.category}
              </Badge>
            )}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              {post.published_at && (
                <span>
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
              {post.read_time && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min read
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span>{post.tags.join(' • ')}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-playfair">
            {/*
              Assume content is already sanitized HTML from the admin backend.
              If markdown is used, it should be converted server-side.
            */}
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container px-6">
            <h2 className="font-playfair text-3xl font-bold mb-8 text-center">
              Project Imagery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((img, index) => (
                <div
                  key={img + index}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
                >
                  <Image
                    src={getPublicMediaUrl(img)}
                    alt={post.title}
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


