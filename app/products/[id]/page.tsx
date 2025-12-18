import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase' // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductInfo } from '@/components/products/product-info'
import type { PublicProduct } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

interface ProductDetailPageProps {
  // In Next.js 15, params are passed as a Promise in the type system
  params: Promise<{ id: string }>
}

function mapProductToPublic(product: Record<string, unknown>): PublicProduct {
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
}

async function getProductById(id: string): Promise<PublicProduct | null> {
  try {
    // Clean the id/slug (trim whitespace)
    const cleanId = id.trim()
    
    // Query product by ID or slug - try without status first (more reliable)
    let data: Record<string, unknown> | null = null
    
    // First try by slug
    const slugResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', cleanId)
      .single() as { data: Record<string, unknown> | null; error: unknown }
    
    if (!slugResult.error && slugResult.data) {
      data = slugResult.data
    } else {
      // If not found by slug, try by id
      const idResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', cleanId)
        .single() as { data: Record<string, unknown> | null; error: unknown }
      
      if (!idResult.error && idResult.data) {
        data = idResult.data
      } else {
        // Last resort: try with OR query (limit 1)
        const orResult: { data: Record<string, unknown>[] | null; error: unknown } = await supabaseAdmin
          .from('products')
          .select('*')
          .or(`slug.eq.${cleanId},id.eq.${cleanId}`)
          .limit(1) as { data: Record<string, unknown>[] | null; error: unknown }
        
        if (!orResult.error && orResult.data && Array.isArray(orResult.data) && orResult.data.length > 0) {
          data = orResult.data[0]
        } else {
          console.error('[Product Detail] Product not found:', cleanId)
          return null
        }
      }
    }
    
    if (!data) {
      return null
    }
    
    return mapProductToPublic(data)
  } catch (error) {
    console.error('[Product Detail] Error fetching product:', error)
    return null
  }
}

async function getProductsByCategory(category: string, excludeId?: string): Promise<PublicProduct[]> {
  try {
    // Query products by category - try without status filter first (more reliable)
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(10) // Limit to prevent large queries
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    // Try query without status filter (status column might not exist)
    const { data, error } = await query
    
    if (error) {
      // If error, log but don't fail - return empty array
      console.error('[Related Products] Query error:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    return data.map(mapProductToPublic)
  } catch (error) {
    console.error('[Related Products] Error fetching products:', error)
    return []
  }
}

async function getAllProducts(excludeId?: string, limit: number = 10): Promise<PublicProduct[]> {
  try {
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    // Query without status filter (status column might not exist)
    const { data, error } = await query
    
    if (error) {
      console.error('[Related Products] Error fetching all products:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    return data.map(mapProductToPublic)
  } catch (error) {
    console.error('[Related Products] Error fetching all products:', error)
    return []
  }
}

export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: 'Product Not Found | Elegant Tiles & Décor Centre',
      description: 'The product you are looking for could not be found.',
    }
  }

  return {
    title:
      product.seo_title || `${product.title} | Elegant Tiles & Décor Centre`,
    description: product.seo_description || product.description || undefined,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const specifications =
    (product.specifications as Record<string, unknown> | null) ?? {}

  // Fetch related products: same category first, then fallback to other products
  let related: PublicProduct[] = []
  try {
    // First, try to get products from the same category
    const sameCategory = await getProductsByCategory(product.category, product.id)
    related = sameCategory.slice(0, 3)
    
    // If we don't have enough products from the same category, fill with other products
    if (related.length < 3) {
      const otherProducts = await getAllProducts(product.id, 10)
      // Filter out products we already have
      const additionalProducts = otherProducts
        .filter((p) => !related.some((r) => r.id === p.id))
        .slice(0, 3 - related.length)
      related = [...related, ...additionalProducts]
    }
    
    console.log(`[Related Products] Found ${related.length} related products for ${product.title}`)
  } catch (error) {
    console.error('[Related Products] Error fetching related products:', error)
    // Fallback: try to get any products
    try {
      related = (await getAllProducts(product.id, 3)).slice(0, 3)
    } catch {
      related = []
    }
  }

  return (
    <LuxuryLayout>
      {/* Back Button */}
      <div className="container px-6 py-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/products">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
          </Link>
        </Button>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <ProductGallery images={product.images || []} />

            {/* Product Info */}
            <ProductInfo product={product} specifications={specifications} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <h2 className="font-playfair text-3xl font-bold mb-8">
            Related Products
          </h2>
          {related.length === 0 ? (
            <p className="text-muted-foreground">No related products available.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((item) => (
              <Card
                  key={item.id}
                className="hover:shadow-luxury-lg transition-all duration-300 overflow-hidden"
              >
                <Link href={`/products/${item.slug || item.id}`}>
                  <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                    {item.featured_image && (
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                </Link>
                <CardContent className="p-6">
                  <h3 className="font-playfair text-xl font-semibold mb-2">
                      {item.title}
                  </h3>
                  <div className="text-primary font-semibold">
                      {item.price != null
                        ? `KSh ${item.price.toLocaleString()}${item.currency ? ` ${item.currency}` : ''}`
                        : 'Pricing on request'}
                  </div>
                    <Button
                      variant={(item.is_imported || item.in_stock) ? 'luxury' : 'secondary'}
                      size="sm"
                      className="mt-4 w-full"
                      asChild
                      disabled={!item.is_imported && !item.in_stock}
                    >
                      <Link href={`/products/${item.slug || item.id}`}>
                        {(item.is_imported || item.in_stock) ? 'View Details' : 'Out of Stock'}
                      </Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>
    </LuxuryLayout>
  )
}


