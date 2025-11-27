/**
 * Supabase Client Configuration
 * Handles authentication, database, and storage operations
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// IMPORTANT:
// Do NOT fall back to placeholder credentials in production.
// Both the main site and the admin dashboard MUST point to the same Supabase project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only validate at runtime, not during build (Vercel sets env vars at runtime)
// During build, we use placeholder values to prevent build failures
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NEXT_PHASE === 'phase-development-build' ||
                    (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV === 'production')

// Validate Supabase URL is production (not localhost or placeholder)
function isValidSupabaseUrl(url: string): boolean {
  if (!url) return false
  if (url === 'https://placeholder.supabase.co') return false
  if (url.includes('localhost')) return false
  if (url.includes('127.0.0.1')) return false
  return url.startsWith('https://') && url.includes('.supabase.co')
}

// In production, we MUST have valid production URLs
const isProduction = process.env.NODE_ENV === 'production' && !isBuildTime

if (!isBuildTime) {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = '❌ Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables (use the SAME values as the admin dashboard).'
    console.error(errorMsg)
    if (isProduction) {
      throw new Error(errorMsg)
    }
  } else if (!isValidSupabaseUrl(supabaseUrl)) {
    const errorMsg = `❌ NEXT_PUBLIC_SUPABASE_URL is invalid or localhost: ${supabaseUrl}. Production requires a valid Supabase URL (https://xxxxx.supabase.co).`
    console.error(errorMsg)
    if (isProduction) {
      throw new Error(errorMsg)
    } else {
      console.warn('⚠️  Using invalid URL in development. This will fail in production.')
    }
  } else {
    console.log(`✅ Supabase configured: ${supabaseUrl.substring(0, 30)}...`)
  }
}

/**
 * Client-side Supabase client
 * Uses placeholder values during build to prevent build failures
 */
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

/**
 * Server-side Supabase client for admin operations
 * Uses service role key to bypass RLS for public form submissions
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.warn(
    '⚠️  SUPABASE_SERVICE_ROLE_KEY not set. Public form submissions (inquiries, orders) may fail due to RLS policies.'
  )
}

// Validate Supabase credentials at runtime
function validateSupabaseConfig() {
  if (typeof window === 'undefined') {
    // Server-side validation
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set or is placeholder!')
      return false
    }
    if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-anon-key') {
      console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or is placeholder!')
      return false
    }
    if (!serviceRoleKey) {
      console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set. Using anon key (may fail with RLS).')
    }
  }
  return true
}

// In production, fail if we don't have valid credentials
if (isProduction) {
  if (!supabaseUrl || !isValidSupabaseUrl(supabaseUrl)) {
    throw new Error('❌ Production requires valid NEXT_PUBLIC_SUPABASE_URL (not localhost or placeholder)')
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-anon-key') {
    throw new Error('❌ Production requires valid NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

export const supabaseAdmin = createClient<Database>(
  // In production, use actual URL; in build/dev, allow placeholder for build-time
  isProduction ? supabaseUrl : (supabaseUrl || 'https://placeholder.supabase.co'),
  // In production, require valid key; in build/dev, allow placeholder
  isProduction 
    ? (serviceRoleKey || supabaseAnonKey)
    : (serviceRoleKey || supabaseAnonKey || 'placeholder-service-key'),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  validateSupabaseConfig()
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return { url: data.publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { url: null, error: error as Error }
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error as Error }
  }
}

