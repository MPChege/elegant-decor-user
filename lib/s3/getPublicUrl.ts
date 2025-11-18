const MEDIA_BASE_URL =
  'https://gqbdjkflempypooplval.storage.supabase.co/storage/v1/object/public/media'

/**
 * Build a public URL for a media object stored in the Supabase `media` bucket.
 * Accepts either a bare key (e.g. "blog/hero.jpg") or a full URL and returns
 * a URL that can be passed directly to Next.js <Image />.
 */
export function getPublicMediaUrl(key?: string | null): string {
  if (!key) {
    // Fallback to a neutral placeholder asset bundled in /public
    return '/file.svg'
  }

  // If backend already returns a full URL, just use it as-is.
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key
  }

  const normalizedKey = key.replace(/^\/+/, '')
  return `${MEDIA_BASE_URL}/${normalizedKey}`
}


