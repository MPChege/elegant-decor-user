import { supabaseAdmin } from '@/lib/supabase' // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ProductsPageClient } from '@/components/products/products-page-client'
import type { PublicProduct } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

async function getProducts(): Promise<PublicProduct[]> {
  try {
    // Validate Supabase config - check for production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Products Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly! Current value:', supabaseUrl)
      console.error('[Products Page] Make sure NEXT_PUBLIC_SUPABASE_URL is set to your production Supabase URL (e.g., https://xxxxx.supabase.co)')
      return []
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Products Page] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL:', supabaseUrl)
      return []
    }

    console.log('[Products Page] ✅ Fetching products from Supabase:', supabaseUrl.substring(0, 40) + '...')

    // Query products directly from Supabase
    // Try with status filter first, fallback to all products if column doesn't exist
    const query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Try to filter by status if column exists
    const { data: dataWithStatus, error: statusError } = await query.eq('status', 'published')
    
    let data = dataWithStatus
    let error = statusError
    
    // If status column doesn't exist, query without it
    if (error && (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist'))) {
      console.warn('[Products Page] Status column not found, fetching all products')
      const { data: allData, error: allError } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      data = allData
      error = allError
    }
    
    if (error) {
      console.error('[Products Page] Supabase query error:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    // Map database schema to public API format
    // Admin dashboard uses 'title' and 'slug' fields
    return data.map((product: Record<string, unknown>) => {
      const imagesArray = Array.isArray(product.images) ? (product.images as string[]) : [];
      const images = imagesArray.map((img: string) => getPublicMediaUrl(img))
      const featuredImage = product.featured_image 
        ? getPublicMediaUrl(product.featured_image as string)
        : images[0] || null

      return {
        id: product.id as string,
        title: (product.title as string) || (product.name as string) || (product.id as string), // Use title from admin dashboard
        slug: (product.slug as string) || (product.id as string), // Use slug if available
        description: (product.description as string) || null,
        category: (product.category as string) || 'Uncategorized',
        subcategory: (product.subcategory as string) || null,
        price: product.price ? Number(product.price) : null,
        currency: (product.currency as string) || 'KES',
        price_unit: (product.price_unit as 'per_sqm' | 'unit' | null) || null,
        is_imported: product.is_imported !== undefined ? Boolean(product.is_imported) : false,
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
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <LuxuryLayout>
      <ProductsPageClient products={products} />
    </LuxuryLayout>
  )
}


