const STORAGE_BASE_URL =
  'https://gqbdjkflempypooplval.storage.supabase.co/storage/v1/object/public'

/**
 * Build a public URL for a media object stored in Supabase Storage.
 * Accepts either a bare key (e.g. "blog/hero.jpg") or a full URL and returns
 * a URL that can be passed directly to Next.js <Image />.
 * 
 * @param key - The storage key/path (e.g. "blog/image.jpg" or "media/products/item.jpg")
 * @param bucket - Optional bucket name (defaults to "media")
 */
export function getPublicMediaUrl(key?: string | null, bucket: string = 'media'): string {
  if (!key) {
    // Fallback to a neutral placeholder asset bundled in /public
    return '/file.svg'
  }

  // If backend already returns a full URL, just use it as-is.
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key
  }

  const normalizedKey = key.replace(/^\/+/, '')
  return `${STORAGE_BASE_URL}/${bucket}/${normalizedKey}`
}

/**
 * Build a public URL specifically for blog/journal images.
 * Admin dashboard currently uploads blog images to the shared `media` bucket,
 * so we point there to ensure public journal images render correctly.
 */
export function getBlogImageUrl(key?: string | null): string {
  return getPublicMediaUrl(key, 'media')
}


