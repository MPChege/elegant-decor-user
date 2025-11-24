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
    if (!initialProducts) {
      // Fetch products on client side if not provided
      fetch('/api/public/products?limit=10&featured=true')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.data || [])
          }
        })
        .catch((err) => {
          console.error('Error fetching products:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [initialProducts])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  // Show only featured products or first 10 products
  const displayProducts = products
    .filter((p) => p.featured || p.in_stock)
    .slice(0, 10)

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
    <section className="py-20 bg-muted/20 relative">
      <div className="container px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our premium collection of tiles and materials
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="hidden md:flex">
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
                  className="flex-shrink-0 w-[260px] xs:w-[280px] sm:w-[300px] md:w-[350px]"
                >
                  <Card className="group overflow-hidden hover:shadow-luxury-lg transition-all duration-300 border-luxury h-full flex flex-col">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {product.featured && (
                          <Badge
                            variant="luxury"
                            className="absolute top-4 left-4 z-10"
                          >
                            Featured
                          </Badge>
                        )}
                        {product.featured_image ? (
                          <Image
                            src={product.featured_image}
                            alt={product.title}
                            fill
                            sizes="(min-width: 768px) 350px, 300px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                      <Badge variant="outline" className="mb-2 w-fit text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      {size && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">{size}</p>
                      )}
                      <div className="font-semibold text-base sm:text-lg text-primary mt-auto">
                        {product.price != null
                          ? `KSh ${product.price.toLocaleString()}/sqm`
                          : 'Pricing on request'}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 sm:p-6 pt-0">
                      <Button
                        variant={product.in_stock ? 'luxury' : 'secondary'}
                        className={`w-full font-bold tracking-wide h-11 sm:h-12 touch-target ${
                          product.in_stock
                            ? 'bg-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!product.in_stock}
                        asChild
                      >
                        <Link href={`/products/${product.slug || product.id}`}>
                          {product.in_stock ? 'View Details' : 'Out of Stock'}
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

