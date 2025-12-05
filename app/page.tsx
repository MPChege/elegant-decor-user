import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { supabaseAdmin } from '@/lib/supabase'
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import type { PublicProject, PublicProduct } from '@/lib/public-api'
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

    // Fetch ALL projects (don't filter by status - show everything)
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Home Page] ❌ Supabase error:', error)
      console.error('[Home Page] Error details:', JSON.stringify(error, null, 2))
      return []
    }

    if (!data || data.length === 0) {
      console.log('[Home Page] ⚠️ No projects found in database')
      return []
    }

    console.log(`[Home Page] ✅ Found ${data.length} projects`)

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

// Fetch products on server side
async function getProductsForHome(): Promise<PublicProduct[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Home Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly!')
      return []
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Home Page] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL')
      return []
    }

    console.log('[Home Page] ✅ Fetching products from Supabase')

    // Query products - try with status filter first
    const query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    
    const { data: dataWithStatus, error: statusError } = await query.eq('status', 'published')
    
    let data = dataWithStatus
    let error = statusError
    
    // If status column doesn't exist, query without it
    if (error && (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist'))) {
      console.warn('[Home Page] Status column not found, fetching all products')
      const { data: allData, error: allError } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      data = allData
      error = allError
    }
    
    if (error) {
      console.error('[Home Page] ❌ Supabase error fetching products:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      console.log('[Home Page] ⚠️ No products found in database')
      return []
    }
    
    console.log(`[Home Page] ✅ Found ${data.length} products`)

    // Map to PublicProduct format
    return data.map((product: Record<string, unknown>) => {
      const imagesArray = Array.isArray(product.images) ? (product.images as string[]) : []
      const images = imagesArray.map((img: string) => getPublicMediaUrl(img))
      const featuredImage = product.featured_image 
        ? getPublicMediaUrl(product.featured_image as string)
        : images[0] || null

      return {
        id: product.id as string,
        title: (product.title as string) || (product.name as string) || (product.id as string),
        slug: (product.slug as string) || (product.id as string),
        description: (product.description as string) || null,
        category: (product.category as string) || 'Uncategorized',
        subcategory: (product.subcategory as string) || null,
        price: product.price ? Number(product.price) : null,
        currency: (product.currency as string) || 'KES',
        featured_image: featuredImage,
        images: images,
        tags: (product.tags as string[]) || [],
        featured: Boolean(product.featured),
        in_stock: product.in_stock !== undefined ? Boolean(product.in_stock) : true,
        specifications: (product.specifications as Record<string, unknown> | null) || null,
        seo_title: (product.seo_title as string) || null,
        seo_description: (product.seo_description as string) || null,
        created_at: product.created_at as string,
        updated_at: product.updated_at as string,
      }
    })
  } catch (error) {
    console.error('[Home Page] Error fetching products:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch projects and products on server side
  const [projects, products] = await Promise.all([
    getProjectsForHome(),
    getProductsForHome()
  ])
  
  return (
    <LuxuryLayout>
      <HomePageClient projects={projects} products={products} />
    </LuxuryLayout>
  )
}
