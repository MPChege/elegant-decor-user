'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0)

  const hasImages = images && images.length > 0
  const mainImage = hasImages ? images[selectedImage] : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 mb-4 overflow-hidden relative">
        {mainImage && (
          <Image
            src={mainImage}
            alt="Product image"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {hasImages
          ? images.map((img, index) => (
              <button
                key={img + index}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden bg-muted hover:border-primary transition-all ${
                  selectedImage === index ? 'border-2 border-primary' : ''
                }`}
              >
                <Image
                  src={img}
                  alt="Product thumbnail"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))
          : [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-muted hover:border-primary transition-all"
              />
            ))}
      </div>
    </motion.div>
  )
}


