import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { JournalPageClient } from '@/components/journal/journal-page-client'
import { supabaseAdmin } from '@/lib/supabase'
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl'
import type { PublicBlogPost } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

async function fetchBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    // Validate Supabase config - check for production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Journal Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly! Current value:', supabaseUrl)
      console.error('[Journal Page] Make sure NEXT_PUBLIC_SUPABASE_URL is set to your production Supabase URL (e.g., https://xxxxx.supabase.co)')
      return []
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Journal Page] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL:', supabaseUrl)
      return []
    }

    console.log('[Journal Page] ✅ Fetching blog posts from Supabase:', supabaseUrl.substring(0, 40) + '...')

    // Fetch ALL blog posts (don't filter by status - show everything)
    let { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    // Check for errors
    if (error) {
      console.error('[Journal Page] ❌ Supabase error:', error)
      console.error('[Journal Page] Error details:', JSON.stringify(error, null, 2))
      return []
    }
    
    if (!data || data.length === 0) {
      console.log('[Journal Page] ⚠️ No blog posts found in database')
      return []
    }
    
    console.log(`[Journal Page] ✅ Found ${data.length} blog posts`)

    // Map to PublicBlogPost format
    return data.map((post: Record<string, unknown>) => {
      const featuredImageKey = (post.featured_image_key as string) || (post.featured_image as string) || null
      const featuredImage = featuredImageKey ? getBlogImageUrl(featuredImageKey) : null

      const imagesArray = Array.isArray(post.images) ? (post.images as string[]) : []
      const images = imagesArray
        .filter((img): img is string => Boolean(img && typeof img === 'string'))
        .map((img: string) => getBlogImageUrl(img))

      return {
        id: post.id as string,
        title: post.title as string,
        slug: post.slug as string,
        excerpt: (post.excerpt as string) || null,
        content: post.content as string,
        featured_image: featuredImage,
        featured_image_key: featuredImageKey,
        images: images,
        tags: (post.tags as string[]) || [],
        category: (post.category as string) || null,
        published: (post.status as string) === 'published' || (post.published as boolean) === true,
        published_at: (post.published_at as string) || null,
        read_time: (post.read_time as number) || null,
        seo_title: (post.seo_title as string) || null,
        seo_description: (post.seo_description as string) || null,
      }
    })
  } catch (error) {
    console.error('[Journal Page] ❌ Unexpected error fetching blog posts:', error)
    if (error instanceof Error) {
      console.error('[Journal Page] Error message:', error.message)
      console.error('[Journal Page] Error stack:', error.stack)
    }
    console.error('[Journal Page] Full error:', JSON.stringify(error, null, 2))
    return []
  }
}

export default async function JournalPage() {
  // Fetch real blog posts directly from Supabase database
  const posts = await fetchBlogPosts()

  return (
    <LuxuryLayout>
      <JournalPageClient posts={posts} />
    </LuxuryLayout>
  )
}
