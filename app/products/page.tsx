import { productsAPI } from '@elegant/shared/lib/api'
import type { Product } from '@elegant/shared/types/database.types'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { ProductsPageClient } from '@/components/products/products-page-client'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  let products: Product[] = []

  try {
    products = await productsAPI.getPublished()
  } catch {
    products = []
  }

  return (
    <LuxuryLayout>
      <ProductsPageClient products={products} />
    </LuxuryLayout>
  )
}


