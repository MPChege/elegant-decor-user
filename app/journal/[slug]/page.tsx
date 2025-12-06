import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase' // Use admin client to bypass RLS
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { JournalPostContent } from '@/components/journal/journal-post-content'
import type { PublicBlogPost } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

interface JournalPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<PublicBlogPost | null> {
  try {
    // Clean the slug (trim whitespace)
    const cleanSlug = slug.trim()
    
    // Try with status filter first
    let data: Record<string, unknown> | null = null
    let error: unknown = null
    
    const publishedResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
      .from('blog_posts')
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
        .from('blog_posts')
        .select('*')
        .eq('slug', cleanSlug)
        .single() as { data: Record<string, unknown> | null; error: unknown }
      
      if (!result.error && result.data) {
        data = result.data
        error = null
      } else {
        error = result.error
      }
    }

    if (error || !data) {
      return null
    }

    const post = data as Record<string, unknown>
    
    // Prefer featured_image_key, fallback to featured_image
    const imageKey = (post.featured_image_key as string) || (post.featured_image as string) || null
    const featuredImage = imageKey ? getBlogImageUrl(imageKey) : null

    // Handle images array from database (admin dashboard saves images array)
    const imagesArray = Array.isArray(post.images) ? (post.images as string[]) : []
    const images = imagesArray
      .filter((img): img is string => Boolean(img && typeof img === 'string'))
      .map((img: string) => getBlogImageUrl(img))

    return {
      id: post.id as string,
      title: post.title as string,
      slug: post.slug as string,
      excerpt: (post.excerpt as string) || '',
      content: (post.content as string) || '',
      featured_image: featuredImage,
      featured_image_key: imageKey,
      images: images, // Map images array from database
      tags: (post.tags as string[]) || [],
      category: (post.category as string) || null,
      published: (post.status as string) === 'published' || (post.published as boolean) === true,
      published_at: (post.published_at as string) || (post.created_at as string),
      read_time: (post.read_time as number) || null,
      seo_title: (post.seo_title as string) || null,
      seo_description: (post.seo_description as string) || null,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Article Not Found | Elegant Tiles & Décor Centre Journal',
      description: 'The article you are looking for could not be found.',
    }
  }

  return {
    title: post.seo_title || `${post.title} | Elegant Tiles & Décor Centre Journal`,
    description: post.seo_description || post.excerpt || undefined,
  }
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <LuxuryLayout>
      <JournalPostContent post={post} />
    </LuxuryLayout>
  )
}
