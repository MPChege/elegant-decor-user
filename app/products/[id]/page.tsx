import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
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
    // Query product by ID or slug (try both)
    // First try by slug, then by id
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', id)
      .eq('status', 'published') // Only show published products
      .single()
    
    // If not found by slug, try by id
    if (error || !data) {
      const result = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()
      
      data = result.data
      error = result.error
    }
    
    if (error || !data) {
      console.error('Supabase query error:', error)
      return null
    }
    
    return mapProductToPublic(data)
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getProductsByCategory(category: string): Promise<PublicProduct[]> {
  try {
    // Query products by category directly from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('status', 'published') // Only show published products
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase query error:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    return data.map(mapProductToPublic)
  } catch (error) {
    console.error('Error fetching products:', error)
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

  // Fetch a few related products (simple heuristic: same category, different id)
  let related: PublicProduct[] = []
  try {
    const all = await getProductsByCategory(product.category)
    related = all
      .filter((p) => p.id !== product.id)
      .slice(0, 3)
  } catch {
    related = []
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
                      variant={item.in_stock ? 'luxury' : 'secondary'}
                      size="sm"
                      className="mt-4 w-full"
                      asChild
                      disabled={!item.in_stock}
                    >
                      <Link href={`/products/${item.slug || item.id}`}>
                        {item.in_stock ? 'View Details' : 'Out of Stock'}
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


