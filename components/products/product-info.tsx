'use client'

import { motion } from 'framer-motion'
import { Check, Package, Clock, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductActions } from '@/components/products/product-actions'
import type { PublicProduct } from '@/lib/public-api'

interface ProductInfoProps {
  product: PublicProduct
  specifications: Record<string, unknown>
}

export function ProductInfo({ product, specifications }: ProductInfoProps) {
  return (
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

      {/* Imported Product Notice - Creative Design */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Imported Product
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                This premium product is sourced from international suppliers to ensure the highest quality standards.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-primary/10">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Estimated Delivery: <span className="text-primary font-bold">2 Months</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                From order confirmation to ready for installation
              </p>
            </div>
          </div>
        </div>
      </motion.div>

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
        product={product}
      />
    </motion.div>
  )
}





