import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
    // Query blog post by slug directly from Supabase
    // Try both status field (admin dashboard) and published boolean (legacy schema)
    let { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    // If status field doesn't exist, try published boolean
    if (error || !data) {
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true) // Legacy schema uses published boolean
        .single()
      
      data = result.data
      error = result.error
    }
    
    if (error || !data) {
      console.error('Supabase query error:', error)
      return null
    }
    
    // Map database schema to public API format
    const post = data as Record<string, unknown>
    return {
      id: post.id as string,
      title: post.title as string,
      slug: post.slug as string,
      excerpt: (post.excerpt as string) || null,
      content: post.content as string,
      featured_image: post.featured_image ? getBlogImageUrl(post.featured_image as string) : null,
      featured_image_key: (post.featured_image as string) || null,
      images: [], // Blog posts don't have images array in DB
      tags: (post.tags as string[]) || [],
      category: (post.category as string) || null,
      published: (post.status as string) === 'published' || (post.published as boolean) === true,
      published_at: (post.published_at as string) || (post.publish_date as string) || null,
      read_time: (post.read_time as number) || null,
      seo_title: (post.seo_title as string) || null,
      seo_description: (post.seo_description as string) || null,
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
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
    notFound()
  }

  return (
    <LuxuryLayout>
      <JournalPostContent post={post} />
    </LuxuryLayout>
  )
}


