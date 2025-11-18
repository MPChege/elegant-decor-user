'use client'

import * as React from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface ProductActionsProps {
  title: string
  category: string
  price: number | null
  inStock: boolean
}

export function ProductActions({ title, category, price, inStock }: ProductActionsProps) {
  const { toast } = useToast()

  const quoteHref = `/quote?product=${encodeURIComponent(title)}&category=${encodeURIComponent(
    category
  )}&price=${price ?? ''}`

  const handleWishlist = () => {
    toast({
      title: 'Added to Wishlist',
      description: `${title} saved to your wishlist.`,
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied!',
        description: 'Product link copied to clipboard.',
      })
    } catch {
      toast({
        title: 'Unable to copy link',
        description: 'Please copy the URL from the address bar.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex gap-4">
      <Button
        variant="luxury"
        size="lg"
        className="flex-1"
        asChild
        disabled={!inStock}
      >
        <Link href={quoteHref}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {inStock ? 'Request Quote' : 'Out of Stock'}
        </Link>
      </Button>

      <Button variant="outline" size="lg" type="button" onClick={handleWishlist}>
        <Heart className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="lg" type="button" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}


