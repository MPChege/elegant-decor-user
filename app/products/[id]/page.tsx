import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { productsAPI } from '@elegant/shared/lib/api'
import type { Product } from '@elegant/shared/types/database.types'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductActions } from '@/components/products/product-actions'

export const dynamic = 'force-dynamic'

interface ProductDetailPageProps {
  // In Next.js 15, params are passed as a Promise in the type system
  params: Promise<{ id: string }>
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await productsAPI.getBySlug(slug)
    return product
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  const { id } = await params
  const product = await getProductBySlug(id)

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
  const product = await getProductBySlug(id)

  if (!product) {
    notFound()
  }

  const specifications =
    (product.specifications as Record<string, unknown> | null) ?? {}

  // Fetch a few related products (simple heuristic: same category, different id)
  let related: Product[] = []
  try {
    const all = await productsAPI.getPublished()
    related = all
      .filter((p) => p.id !== product.id && p.category === product.category)
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
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="luxury" className="mb-4">
                {product.category}
              </Badge>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-primary">
                  {product.price != null
                    ? `KSh ${product.price.toLocaleString()}`
                    : 'Pricing on request'}
                </div>
                <Badge variant={product.in_stock ? 'default' : 'secondary'}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              {product.description && (
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
              )}

              {/* Features / Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <div className="space-y-2">
                    {product.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Specifications */}
              {Object.keys(specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="font-medium">
                          {String(value ?? '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Actions */}
              <ProductActions
                title={product.title}
                category={product.category}
                price={product.price}
                inStock={product.in_stock}
              />
            </motion.div>
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
                  className="hover:shadow-luxury-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <div className="text-primary font-semibold">
                      {item.price != null
                        ? `KSh ${item.price.toLocaleString()}/sqm`
                        : 'Pricing on request'}
                    </div>
                    <Button
                      variant={item.in_stock ? 'luxury' : 'secondary'}
                      size="sm"
                      className="mt-4 w-full"
                      asChild
                      disabled={!item.in_stock}
                    >
                      <Link href={`/products/${item.slug}`}>
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


