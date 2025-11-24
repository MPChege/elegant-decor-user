import { supabase } from '@/lib/supabase'
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { JournalPageClient } from '@/components/journal/journal-page-client'
import type { PublicBlogPost } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

async function getBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    // Query blog posts directly from Supabase
    // Try both status field (admin dashboard) and published boolean (legacy schema)
    // First try status field (admin dashboard schema)
    const { data: statusData, error: statusError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
    
    let data = statusData
    let error = statusError
    
    // If status field doesn't exist or returns no results, try published boolean
    if (error || !data || data.length === 0) {
      const { data: publishedData, error: publishedError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true) // Legacy schema uses published boolean
        .order('publish_date', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (!publishedError && publishedData) {
        data = publishedData
        error = null
      }
    }
    
    if (error) {
      console.error('Supabase query error:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      console.log('No blog posts found in database')
      // Debug: Check what's actually in the database
      const { data: allPosts } = await supabase
        .from('blog_posts')
        .select('id, title, status, published, slug')
        .limit(5)
      console.log('Sample blog posts in DB (first 5):', allPosts)
      return []
    }
    
    console.log(`Found ${data.length} published blog posts`)
    
    // Map database schema to public API format
    return data.map((post: Record<string, unknown>) => ({
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
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function JournalPage() {
  const posts = await getBlogPosts()

  return (
    <LuxuryLayout>
      <JournalPageClient posts={posts} />
    </LuxuryLayout>
  )
}


