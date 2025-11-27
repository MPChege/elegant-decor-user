import { supabaseAdmin } from '@/lib/supabase' // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ProductsPageClient } from '@/components/products/products-page-client'
import type { PublicProduct } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

async function getProducts(): Promise<PublicProduct[]> {
  try {
    // Validate Supabase config
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.error('[Products Page] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured!')
      return []
    }

    // Query products directly from Supabase
    // Filter by status = 'published' (admin dashboard uses this field)
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'published') // Only show published products
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase query error:', error)
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


