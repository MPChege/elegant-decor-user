import 'server-only'

export interface PublicProduct {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  subcategory: string | null
  price: number | null
  currency: string
  featured_image: string | null
  images: string[]
  tags: string[]
  featured: boolean
  in_stock: boolean
  specifications: Record<string, unknown> | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface PublicBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_key?: string | null
  featured_image?: string | null
  images?: string[]
  tags?: string[]
  category?: string | null
  published: boolean
  published_at?: string | null
  read_time?: number | null
  seo_title?: string | null
  seo_description?: string | null
}

export interface PublicProject {
  id: string
  title: string
  slug: string
  description: string | null
  short_description?: string | null
  client_name?: string | null
  location?: string | null
  year?: number | null
  completion_date?: string | null
  featured_image_key?: string | null
  featured_image?: string | null
  images?: string[]
  tags?: string[]
  featured?: boolean
  seo_title?: string | null
  seo_description?: string | null
}

function getBaseUrl() {
  // In production (Vercel), use the deployment URL
  // In development, use localhost
  // Prefer explicit app URL env var, then site URL, then auto-detect
  
  // For server-side fetch calls, use relative URLs when possible
  // This works in both development and production
  if (typeof window === 'undefined') {
    // Server-side: Use environment variable or construct from Vercel URL
    const vercelUrl = process.env.VERCEL_URL
    if (vercelUrl) {
      return `https://${vercelUrl}`
    }
    
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
    
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL
    }
    
    // Fallback: Use relative URL (works in Next.js server components)
    // When calling from server components, relative URLs work automatically
    return ''
  }
  
  // Client-side: Use current origin
  return window.location.origin
}

export interface ProductsResponse {
  success: boolean
  data: PublicProduct[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}

export interface ProductResponse {
  success: boolean
  data: PublicProduct
}

export async function fetchPublicProducts(filters?: {
  limit?: number
  offset?: number
  category?: string
  featured?: boolean
  in_stock?: boolean
}): Promise<PublicProduct[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.limit) params.set('limit', filters.limit.toString())
    if (filters?.offset) params.set('offset', filters.offset.toString())
    if (filters?.category) params.set('category', filters.category)
    if (filters?.featured) params.set('featured', 'true')
    if (filters?.in_stock) params.set('in_stock', 'true')

    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/products?${params}` : `/api/public/products?${params}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Failed to fetch products:', res.status, errorText)
      
      // Try to parse error details if available
      try {
        const errorJson = JSON.parse(errorText)
        console.error('Error details:', errorJson)
      } catch {
        // Not JSON, just log the text
      }
      
      return []
    }

    const json = (await res.json()) as ProductsResponse

    if (!json.success || !json.data) return []
    return json.data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function fetchPublicProduct(
  slug: string
): Promise<PublicProduct | null> {
  try {
    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/products/${slug}` : `/api/public/products/${slug}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      console.error('Failed to fetch product:', res.status, await res.text())
      return null
    }

    const json = (await res.json()) as ProductResponse

    if (!json.success || !json.data) return null
    return json.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function fetchPublicBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/blog` : `/api/public/blog`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Failed to fetch blog posts:', res.status, await res.text())
      return []
    }

    const json = (await res.json()) as {
      success: boolean
      data?: PublicBlogPost[]
    }

    if (!json.success || !json.data) return []
    return json.data
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function fetchPublicBlogPost(
  slug: string
): Promise<PublicBlogPost | null> {
  try {
    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/blog/${slug}` : `/api/public/blog/${slug}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      console.error('Failed to fetch blog post:', res.status, await res.text())
      return null
    }

    const json = (await res.json()) as {
      success: boolean
      data?: PublicBlogPost
    }

    if (!json.success || !json.data) return null
    return json.data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function fetchPublicProjects(): Promise<PublicProject[]> {
  try {
    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/projects` : `/api/public/projects`
    console.log('[fetchPublicProjects] Fetching from:', url)
    
    const res = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('[fetchPublicProjects] Failed to fetch projects:', res.status, errorText)
      return []
    }

    const json = (await res.json()) as {
      success: boolean
      data?: PublicProject[]
    }

    console.log('[fetchPublicProjects] Response:', {
      success: json.success,
      dataLength: json.data?.length || 0,
    })

    if (!json.success || !json.data) return []
    return json.data
  } catch (error) {
    console.error('[fetchPublicProjects] Error fetching projects:', error)
    return []
  }
}

export async function fetchPublicProject(
  slug: string
): Promise<PublicProject | null> {
  try {
    const baseUrl = getBaseUrl()
    const url = baseUrl ? `${baseUrl}/api/public/projects/${slug}` : `/api/public/projects/${slug}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      console.error('Failed to fetch project:', res.status, await res.text())
      return null
    }

    const json = (await res.json()) as {
      success: boolean
      data?: PublicProject
    }

    if (!json.success || !json.data) return null
    return json.data
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}


