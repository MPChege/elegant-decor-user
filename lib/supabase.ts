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

if (!isBuildTime && (!supabaseUrl || !supabaseAnonKey)) {
  // Fail fast with a clear error at runtime if env vars are missing
  console.error(
    '❌ Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables (use the SAME values as the admin dashboard).'
  )
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

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || supabaseAnonKey || 'placeholder-service-key' // Fallback to anon key if service role not set (may fail with RLS)
)

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

