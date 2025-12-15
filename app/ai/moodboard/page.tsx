'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Download, Loader2 } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Moodboard Builder
 * Upload an image and get a color palette with matching products
 */
interface MatchingProduct {
  id: string
  name: string
  category: string
  image?: string
  price?: number
}

export default function MoodboardBuilderPage() {
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedPalette, setGeneratedPalette] = React.useState<string[]>([])
  const [matchingProducts, setMatchingProducts] = React.useState<MatchingProduct[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        generateMoodboard()
      }
      reader.readAsDataURL(file)
    }
  }

  const generateMoodboard = async () => {
    setIsGenerating(true)
    
    // Process image
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Generate palette
    setGeneratedPalette([
      '#8B4513',
      '#DEB887',
      '#F5DEB3',
      '#FFFAF0',
      '#D2691E',
      '#A0522D',
    ])
    
    // Mock matching products
    setMatchingProducts([
      { id: '1', name: 'Walnut Ceramic Tile', category: 'Ceramic' },
      { id: '2', name: 'Beige Marble', category: 'Marble' },
      { id: '3', name: 'Cream Porcelain', category: 'Porcelain' },
    ])
    
    setIsGenerating(false)
  }

  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="luxury" className="mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Design Tool
            </Badge>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Moodboard <span className="text-luxury-gradient">Builder</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Upload an inspiration image to generate a color palette
              with matching product recommendations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            {!uploadedImage ? (
              <Card className="border-dashed border-2 hover:border-primary transition-colors">
                <CardContent className="p-12">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">
                        Upload Your Inspiration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Drop an image or click to browse
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Uploaded Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Inspiration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                      {uploadedImage && (
                        <Image
                          src={uploadedImage}
                          alt="Uploaded inspiration"
                          fill
                          sizes="(min-width: 1024px) 45vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setUploadedImage(null)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Image
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Results */}
                <div className="space-y-6">
                  {/* Color Palette */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating Palette...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 text-primary" />
                            Generated Palette
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generatedPalette.length > 0 && (
                        <>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {generatedPalette.map((color, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg shadow-md"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Palette
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Matching Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Matching Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {matchingProducts.length > 0 ? (
                        <div className="space-y-3">
                          {matchingProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                            >
                              <div className="w-12 h-12 rounded bg-muted" />
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.category}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No matching products found
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

