import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generation
 * Automatically includes all public routes
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.elegantdecor.co.ke'
  
  const staticRoutes = [
    '',
    '/services',
    '/work',
    '/products',
    '/journal',
    '/about',
    '/contact',
    '/approach',
    '/ai/moodboard',
    '/ai/assistant',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Add dynamic routes from database
  // const products = await getProducts()
  // const productRoutes = products.map(product => ({
  //   url: `${baseUrl}/products/${product.id}`,
  //   lastModified: product.updated_at,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  return staticRoutes
}

