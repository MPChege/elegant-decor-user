/**
 * Supabase Database Type Definitions
 * Auto-generated types for type-safe database operations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          category: string
          price: number
          images: string[]
          featured: boolean
          in_stock: boolean
          specifications: Json
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          category: string
          images: string[]
          featured: boolean
          client: string
          location: string
          year: number
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string
          content: string
          author: string
          featured_image: string
          published: boolean
          publish_date: string
          tags: string[]
          read_time: number
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          message: string
          type: string
          status: 'new' | 'in_progress' | 'completed'
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      newsletter_subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
      }
    }
  }
}

