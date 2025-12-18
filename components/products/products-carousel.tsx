'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PublicProduct } from '@/lib/public-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductsCarouselProps {
  products?: PublicProduct[]
}

export function ProductsCarousel({ products: initialProducts }: ProductsCarouselProps) {
  const [products, setProducts] = React.useState<PublicProduct[]>(initialProducts || [])
  const [loading, setLoading] = React.useState(!initialProducts)

  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      console.log('[ProductsCarousel] Using server-provided products:', initialProducts.length)
      setProducts(initialProducts)
      setLoading(false)
    } else if (!initialProducts || initialProducts.length === 0) {
      console.log('[ProductsCarousel] No server products, fetching from API...')
      // Fetch products on client side if not provided
      fetch('/api/public/products?limit=30')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          if (data.success && data.data && data.data.length > 0) {
            console.log('[ProductsCarousel] Fetched products from API:', data.data.length)
            setProducts(data.data || [])
          } else {
            console.warn('[ProductsCarousel] No products in API response:', data)
          }
        })
        .catch((err) => {
          console.error('[ProductsCarousel] Error fetching products:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialProducts])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  // Show featured products first, then in_stock products, up to 10 total
  const displayProducts = React.useMemo(() => {
    // Sort: featured first, then in_stock, then by created_at
    const sorted = [...products].sort((a, b) => {
      // Featured products first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then in_stock
      if (a.in_stock && !b.in_stock) return -1
      if (!a.in_stock && b.in_stock) return 1
      // Then by created_at (newest first) - if available
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })
    
    // Filter to show featured OR in_stock products, then take first 10
    return sorted
      .filter((p) => p.featured || p.in_stock)
      .slice(0, 10)
  }, [products])

  const checkScrollability = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    checkScrollability()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability)
      return () => scrollElement.removeEventListener('scroll', checkScrollability)
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="container px-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className="pt-12 md:pt-16 pb-6 md:pb-8 bg-muted/20 relative">
      <div className="container px-6">
        {/* Glassmorphic Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="backdrop-blur-md bg-white/70 dark:bg-black/50 border border-white/30 dark:border-white/20 rounded-2xl px-6 py-4 shadow-2xl ring-1 ring-white/20 dark:ring-white/10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent drop-shadow-sm">
              Featured Products
            </h2>
            <p className="text-base text-foreground/80 font-medium drop-shadow-sm">
              Discover our premium collection of tiles and materials
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="hidden md:flex backdrop-blur-md bg-white/70 dark:bg-black/50 border-white/30 dark:border-white/20 shadow-2xl hover:bg-white/80 dark:hover:bg-black/60 ring-1 ring-white/20 dark:ring-white/10">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Scroll Buttons */}
        <div className="relative">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Products Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth touch-scroll -mx-4 px-4 sm:-mx-0 sm:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={checkScrollability}
          >
            {displayProducts.map((product) => {
              const specs =
                (product.specifications as Record<string, unknown> | null) ?? {}
              const size = (specs.size as string) || ''

              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px]"
                >
                  <Card className="group overflow-hidden hover:shadow-luxury-lg transition-all duration-300 border-luxury h-full flex flex-col">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {/* Badges Container - Top Left */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.featured && (
                            <Badge
                              variant="luxury"
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              Featured
                            </Badge>
                          )}
                          {product.in_stock && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0.5 bg-green-600 hover:bg-green-700 border-green-700"
                            >
                              In Stock
                            </Badge>
                          )}
                        </div>
                        
                        {/* Badges Container - Top Right */}
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                          {product.is_imported && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0.5 bg-blue-600/90 text-white border-blue-700 hover:bg-blue-700"
                            >
                              Imported
                            </Badge>
                          )}
                        </div>
                        {product.featured_image ? (
                          <Image
                            src={product.featured_image}
                            alt={product.title}
                            fill
                            sizes="(min-width: 768px) 240px, 220px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0">
                          {product.category}
                        </Badge>
                      </div>
                      <h3 className="font-playfair text-sm sm:text-base font-semibold mb-1.5 line-clamp-2">
                        {product.title}
                      </h3>
                      {size && (
                        <p className="text-xs text-muted-foreground mb-1.5">{size}</p>
                      )}
                      <div className="font-semibold text-sm sm:text-base text-primary mt-auto mb-1">
                        {product.price != null
                          ? `KSh ${product.price.toLocaleString()}${product.price_unit === 'per_sqm' ? ' per m²' : ''}`
                          : 'Pricing on request'}
                      </div>
                      {product.is_imported && (
                        <p className="text-[10px] text-muted-foreground">
                          ⏱️ 2 months delivery
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-3 sm:p-4 pt-0">
                      <Button
                        variant={(product.is_imported || product.in_stock) ? 'luxury' : 'secondary'}
                        className={`w-full font-bold tracking-wide h-9 sm:h-10 text-xs sm:text-sm touch-target ${
                          (product.is_imported || product.in_stock)
                            ? 'bg-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!product.is_imported && !product.in_stock}
                        asChild
                      >
                        <Link href={`/products/${product.slug || product.id}`}>
                          {(product.is_imported || product.in_stock) ? 'View Details' : 'Out of Stock'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

