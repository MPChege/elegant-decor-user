'use client'

import * as React from 'react'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OrderRequestForm } from '@/components/forms/OrderRequestForm'
import type { PublicProduct } from '@/lib/public-api'

interface ProductActionsProps {
  title: string
  category: string
  price: number | null
  inStock: boolean
  product?: PublicProduct
}

export function ProductActions({ title, inStock, product }: ProductActionsProps) {
  // Imported products are always orderable (even if in_stock is false) because they can be ordered with delivery time
  const isOrderable = product?.is_imported ? true : inStock
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = React.useState(false)

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

  const handleSuccess = () => {
    setDialogOpen(false)
    toast({
      title: 'Request Submitted!',
      description: 'We will get back to you shortly.',
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="luxury"
            size="lg"
            className="flex-1"
            disabled={!isOrderable}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOrderable ? 'Buy / Inquire' : 'Out of Stock'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Quote / Inquiry</DialogTitle>
            <DialogDescription>
              Fill out the form below and we&apos;ll get back to you with pricing and availability.
            </DialogDescription>
          </DialogHeader>
          <OrderRequestForm 
            product={product} 
            onSuccess={handleSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <Button variant="outline" size="lg" type="button" onClick={handleWishlist}>
          <Heart className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="lg" type="button" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


