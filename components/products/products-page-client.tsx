'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Grid3x3, List, Package } from 'lucide-react'
import type { PublicProduct } from '@/lib/public-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const heroBackground = '/BATHROOMS/bathroom_1%20-%20Photo.png'

interface ProductsPageClientProps {
  products: PublicProduct[]
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  // Dynamically get categories from products
  const availableCategories = React.useMemo(() => {
    const cats = new Set<string>()
    products.forEach((product) => {
      if (product.category) {
        cats.add(product.category)
      }
    })
    return ['All', ...Array.from(cats).sort()]
  }, [products])

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || 
        product.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        product.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchQuery])

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Premium bathroom tile installation"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/45 to-background/95" />
        <div className="container px-6 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our <span className="text-luxury-gradient">Products</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-6">
              Premium tiles and materials from the world&apos;s finest manufacturers.
            </p>
            {/* Products Notice */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Package className="h-5 w-5 text-white" />
              <span className="text-sm md:text-base font-medium">
                Premium products • Some imported, some locally implemented
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Information Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-b border-border">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-card border-2 border-primary/20 shadow-lg">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-3">
                  Premium Products
                </h2>
                <p className="text-muted-foreground mb-4">
                  We offer a mix of imported and locally implemented products. Some items are sourced internationally for premium quality, while others are crafted locally. Imported items typically have a 2-month delivery time.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-medium">Imported & Local Options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="py-8 border-y border-border bg-muted/30">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'luxury' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'luxury' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 sm:py-8 bg-card">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar touch-scroll -mx-4 px-4 sm:-mx-0 sm:px-0">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
              Category:
            </span>
            <div className="flex gap-2">
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'luxury' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0 h-9 sm:h-10 text-xs sm:text-sm touch-target"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="mb-4 sm:mb-6 text-sm text-muted-foreground">
            Showing {filteredProducts.length} products
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">No products available.</p>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5'
                  : 'space-y-4 sm:space-y-6'
              }
            >
              {filteredProducts.map((product) => {
                return (
                  <div key={product.id}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border h-full flex flex-col">
                      <Link href={`/products/${product.slug || product.id}`} className="flex-1 flex flex-col">
                        <div className="aspect-square relative overflow-hidden bg-muted">
                          {product.featured && (
                            <Badge
                              variant="luxury"
                              className="absolute top-1 left-1 z-10 text-[10px] px-1.5 py-0.5"
                            >
                              Featured
                            </Badge>
                          )}
                          {!product.in_stock && (
                            <Badge
                              variant="secondary"
                              className="absolute top-1 right-1 z-10 text-[10px] px-1.5 py-0.5"
                            >
                              Out
                            </Badge>
                          )}
                          {product.featured_image ? (
                            <Image
                              src={product.featured_image}
                              alt={product.title}
                              fill
                              sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                              <span className="text-muted-foreground text-[10px]">No Image</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-2 sm:p-3 flex-1 flex flex-col">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 w-fit">
                              {product.category}
                            </Badge>
                          </div>
                          <h3 className="font-playfair text-xs sm:text-sm font-semibold mb-1.5 line-clamp-2 flex-1">
                            {product.title}
                          </h3>
                          <div className="font-semibold text-xs sm:text-sm text-primary mb-1">
                            {product.price != null
                              ? `KSh ${product.price.toLocaleString()}${product.price_unit === 'per_sqm' ? ' per m²' : ''}`
                              : 'Price on request'}
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="p-2 sm:p-3 pt-0">
                        <Button
                          variant={(product.is_imported || product.in_stock) ? 'luxury' : 'secondary'}
                          size="sm"
                          className={`w-full text-[10px] sm:text-xs h-7 sm:h-8 font-semibold ${
                            (product.is_imported || product.in_stock)
                              ? 'bg-primary text-white hover:scale-105'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                          disabled={!product.is_imported && !product.in_stock}
                          asChild
                        >
                          <Link href={`/products/${product.slug || product.id}`}>
                            {(product.is_imported || product.in_stock) ? 'View' : 'Out'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}


