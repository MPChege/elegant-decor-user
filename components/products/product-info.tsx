'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
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
  )
}

