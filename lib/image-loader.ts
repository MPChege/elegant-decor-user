/**
 * Custom image loader for Next.js Image component
 * Handles Supabase storage URLs with better timeout handling
 */

export function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's already a Supabase URL, use it directly with optimization params
  if (src.includes('supabase.co')) {
    // For Supabase URLs, we can pass them through Next.js optimization
    // but we'll use the direct URL to avoid timeout issues
    const params = new URLSearchParams()
    params.set('url', src)
    params.set('w', width.toString())
    if (quality) {
      params.set('q', quality.toString())
    }
    return `/_next/image?${params.toString()}`
  }
  
  // For local images, use default Next.js optimization
  return src
}









