import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { WorkPageClient } from '@/components/work/work-page-client'
import { supabaseAdmin } from '@/lib/supabase'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import type { Metadata } from 'next'
import type { PublicProject } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects | Elegant Tiles & Décor',
  description: 'Explore our portfolio of exceptional design projects showcasing our commitment to excellence in luxury interiors.',
}

async function fetchProjects(): Promise<PublicProject[]> {
  try {
    // Validate Supabase config - check for production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Work Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly! Current value:', supabaseUrl)
      console.error('[Work Page] Make sure NEXT_PUBLIC_SUPABASE_URL is set to your production Supabase URL (e.g., https://xxxxx.supabase.co)')
      return []
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Work Page] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL:', supabaseUrl)
      return []
    }

    console.log('[Work Page] ✅ Fetching projects from Supabase:', supabaseUrl.substring(0, 40) + '...')

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Work Page] Supabase error:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

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
    console.error('[Work Page] Error fetching projects:', error)
    return []
  }
}

export default async function WorkPage() {
  // Fetch real projects directly from Supabase database
  const projects = await fetchProjects()

  return (
    <LuxuryLayout>
      <WorkPageClient projects={projects} />
    </LuxuryLayout>
  )
}
