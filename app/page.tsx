import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { supabaseAdmin } from '@/lib/supabase'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import type { PublicProject } from '@/lib/public-api'
import { HomePageClient } from '@/components/home/home-page-client'

// Fetch projects on server side
async function getProjectsForHome(): Promise<PublicProject[]> {
  try {
    // Validate Supabase config - check for actual production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Home Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly! Current value:', supabaseUrl)
      console.error('[Home Page] Make sure NEXT_PUBLIC_SUPABASE_URL is set to your production Supabase URL (e.g., https://xxxxx.supabase.co)')
      return []
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Home Page] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL:', supabaseUrl)
      return []
    }

    console.log('[Home Page] ✅ Fetching projects from Supabase:', supabaseUrl.substring(0, 40) + '...')

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Home Page] Supabase error:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.log('[Home Page] No projects found in database')
      return []
    }

    console.log(`[Home Page] Found ${data.length} projects`)

    // Map to PublicProject format
    return data.map((project: Record<string, unknown>) => {
      const imagesArray = Array.isArray(project.images) ? (project.images as string[]) : []
      const images = imagesArray
        .filter((img): img is string => Boolean(img && typeof img === 'string'))
        .map((img: string) => getPublicMediaUrl(img, 'media'))

      const featuredImageKey = (project.featured_image as string) || null
      const featuredImage = featuredImageKey
        ? getPublicMediaUrl(featuredImageKey, 'media')
        : images[0] || null

      return {
        id: project.id as string,
        title: project.title as string,
        slug: (project.slug as string) || (project.id as string),
        description: (project.description as string) || null,
        short_description: null,
        client_name: (project.client_name as string) || null,
        location: (project.location as string) || null,
        year: null,
        completion_date: (project.completion_date as string) || null,
        featured_image: featuredImage,
        featured_image_key: featuredImageKey,
        images: images,
        tags: (project.tags as string[]) || [],
        featured: Boolean(project.featured),
        seo_title: (project.seo_title as string) || null,
        seo_description: (project.seo_description as string) || null,
      }
    })
  } catch (error) {
    console.error('[Home Page] Error fetching projects:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch projects on server side using production Supabase URL
  const projects = await getProjectsForHome()
  
  return (
    <LuxuryLayout>
      <HomePageClient projects={projects} />
    </LuxuryLayout>
  )
}
