import 'server-only'

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
  client_name?: string | null
  location?: string | null
  year?: number | null
  featured_image_key?: string | null
  featured_image?: string | null
  images?: string[]
  tags?: string[]
  seo_title?: string | null
  seo_description?: string | null
}

function getBaseUrl() {
  // Prefer explicit app URL so we can call our own API in server components.
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3001'
  )
}

export async function fetchPublicBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/public/blog`, {
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
    const res = await fetch(`${getBaseUrl()}/api/public/blog/${slug}`, {
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
    const res = await fetch(`${getBaseUrl()}/api/public/projects`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Failed to fetch projects:', res.status, await res.text())
      return []
    }

    const json = (await res.json()) as {
      success: boolean
      data?: PublicProject[]
    }

    if (!json.success || !json.data) return []
    return json.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function fetchPublicProject(
  slug: string
): Promise<PublicProject | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/public/projects/${slug}`, {
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


