'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Filter, Grid3x3, List } from 'lucide-react'
import type { Product } from '@elegant/shared/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const heroBackground = '/BATHROOMS/bathroom_1%20-%20Photo.png'

const categories = [
  'All',
  'Ceramic',
  'Porcelain',
  'Marble',
  'Granite',
  'Natural Stone',
  'Luxury',
]

interface ProductsPageClientProps {
  products: Product[]
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our <span className="text-luxury-gradient">Products</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85">
              Premium tiles and materials from the world&apos;s finest manufacturers.
            </p>
          </motion.div>
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
      <section className="py-8 bg-card">
        <div className="container px-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground flex-shrink-0">
              Category:
            </span>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'luxury' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container px-6">
          <div className="mb-6 text-muted-foreground">
            Showing {filteredProducts.length} products
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">No products available.</p>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {filteredProducts.map((product, index) => {
                const specs =
                  (product.specifications as Record<string, unknown> | null) ?? {}
                const size = (specs.size as string) || ''
                const finish = (specs.finish as string) || ''

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                  >
                    <Card className="group overflow-hidden hover:shadow-luxury-lg transition-all duration-300 border-luxury h-full">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        {product.featured && (
                          <Badge
                            variant="luxury"
                            className="absolute top-4 left-4 z-10"
                          >
                            Featured
                          </Badge>
                        )}
                        {!product.in_stock && (
                          <Badge
                            variant="secondary"
                            className="absolute top-4 right-4 z-10"
                          >
                            Out of Stock
                          </Badge>
                        )}
                        {/* Placeholder gradient (images come from detail view) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-playfair text-xl font-semibold mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{size}</span>
                          <span>{finish}</span>
                        </div>
                        <div className="font-semibold text-lg text-primary">
                          {product.price != null
                            ? `KSh ${product.price.toLocaleString()}/sqm`
                            : 'Pricing on request'}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button
                          variant={product.in_stock ? 'luxury' : 'secondary'}
                          className={`w-full font-bold tracking-wide ${
                            product.in_stock
                              ? 'bg-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-primary'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                          disabled={!product.in_stock}
                          asChild
                        >
                          <Link href={`/products/${product.slug}`}>
                            {product.in_stock ? 'View Details' : 'Out of Stock'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}


