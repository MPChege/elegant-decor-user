import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100); // Max 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    // Note: featured filter is a placeholder - blog_posts table doesn't have featured field yet

    // Query published blog posts from Supabase
    // Try both status field (admin dashboard) and published boolean (legacy schema)
    // First try status field (admin dashboard schema)
    let { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // If status field doesn't exist or returns no results, try published boolean
    if (error || !data || data.length === 0) {
      const result = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('published', true) // Legacy schema uses published boolean
        .order('publish_date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (!result.error && result.data) {
        data = result.data
        error = null
        count = result.count
      }
    }

    if (error) {
      throw error;
    }

    const posts = data || [];
    const total = count || posts.length;

    // Map database format to public API format with full image URLs
    const publicPosts: PublicBlogPost[] = posts.map((post: Record<string, unknown>) => ({
      id: post.id as string,
      title: post.title as string,
      slug: post.slug as string,
      excerpt: (post.excerpt as string) || null,
      content: post.content as string,
      featured_image: post.featured_image ? getBlogImageUrl(post.featured_image as string) : null,
      featured_image_key: (post.featured_image as string) || null,
      images: [], // Blog posts don't have images array in DB, but we can extend this later
      tags: (post.tags as string[]) || [],
      category: (post.category as string) || null,
      published: (post.status as string) === 'published' || (post.published as boolean) === true,
      published_at: (post.published_at as string) || null,
      read_time: (post.read_time as number) || null,
      seo_title: (post.seo_title as string) || null,
      seo_description: (post.seo_description as string) || null,
    }));

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

