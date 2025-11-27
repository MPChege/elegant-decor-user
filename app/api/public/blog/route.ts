import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client to bypass RLS
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl';
import type { PublicBlogPost } from '@/lib/public-api';

/**
 * GET /api/public/blog
 * Get all published blog posts with pagination and filters
 * 
 * Query parameters:
 * - limit (number, default: 50)
 * - offset (number, default: 0)
 * - featured (boolean, optional) - featured=true (placeholder for future use)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured with production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Blog API] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly! Current value:', supabaseUrl)
      console.error('[Blog API] Production requires a valid Supabase URL (https://xxxxx.supabase.co)')
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Supabase URL not set',
          data: [],
        },
        { status: 500 }
      )
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Blog API] ❌ NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL:', supabaseUrl)
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Invalid Supabase URL',
          data: [],
        },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder-anon-key') {
      console.error('[Blog API] ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured!')
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Supabase key not set',
          data: [],
        },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100); // Max 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    // Note: featured filter is a placeholder - blog_posts table doesn't have featured field yet

    // Query ALL blog posts from Supabase (temporarily show all for debugging)
    // TODO: Once confirmed working, filter to status='published' OR published=true
    console.log('[Blog API] Fetching all blog posts from database...');
    
    const { data, error, count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    console.log('[Blog API] Query result:', {
      count: count || 0,
      dataLength: data?.length || 0,
      error: error?.message || null,
    });
    
    if (data && data.length > 0) {
      console.log('[Blog API] First post:', {
        id: (data[0] as Record<string, unknown>).id,
        title: (data[0] as Record<string, unknown>).title,
        status: (data[0] as Record<string, unknown>).status,
        published: (data[0] as Record<string, unknown>).published,
        featured_image: (data[0] as Record<string, unknown>).featured_image,
        featured_image_key: (data[0] as Record<string, unknown>).featured_image_key,
        images: (data[0] as Record<string, unknown>).images,
      });
    } else {
      console.log('[Blog API] ⚠️ No blog posts found in database!');
    }

    if (error) {
      throw error;
    }

    const posts = data || [];
    const total = count || posts.length;

    // Map database format to public API format with full image URLs
    // Schema has both featured_image_key and featured_image fields
    const publicPosts: PublicBlogPost[] = posts.map((post: Record<string, unknown>) => {
      // Prefer featured_image_key, fallback to featured_image
      const featuredImageKey = (post.featured_image_key as string) || (post.featured_image as string) || null
      const featuredImage = featuredImageKey ? getBlogImageUrl(featuredImageKey) : null

      // Handle images array from database (admin dashboard saves images array)
      const imagesArray = Array.isArray(post.images) ? (post.images as string[]) : []
      const images = imagesArray
        .filter((img): img is string => Boolean(img && typeof img === 'string'))
        .map((img: string) => getBlogImageUrl(img))

      return {
        id: post.id as string,
        title: post.title as string,
        slug: post.slug as string,
        excerpt: (post.excerpt as string) || null,
        content: post.content as string,
        featured_image: featuredImage,
        featured_image_key: featuredImageKey,
        images: images, // Map images array from database
        tags: (post.tags as string[]) || [],
        category: (post.category as string) || null,
        published: (post.status as string) === 'published' || (post.published as boolean) === true,
        published_at: (post.published_at as string) || null,
        read_time: (post.read_time as number) || null,
        seo_title: (post.seo_title as string) || null,
        seo_description: (post.seo_description as string) || null,
      }
    });

    return NextResponse.json({
      success: true,
      data: publicPosts,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}

