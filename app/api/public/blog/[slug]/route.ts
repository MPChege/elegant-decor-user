import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl';
import type { PublicBlogPost } from '@/lib/public-api';

/**
 * GET /api/public/blog/[slug]
 * Get a single published blog post by slug
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    // Query blog post by slug from Supabase
    // Try both status field (admin dashboard) and published boolean (legacy schema)
    let { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    // If status field doesn't exist, try published boolean
    if (error || !data) {
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true) // Legacy schema uses published boolean
        .single();
      
      data = result.data
      error = result.error
    }

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
        },
        { status: 404 }
      );
    }

    const post = data as Record<string, unknown>;

    // Map database format to public API format with full image URLs
    const publicPost: PublicBlogPost = {
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
    };

    return NextResponse.json({
      success: true,
      data: publicPost,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);

    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('not found') || errorMessage.includes('No rows')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || 'Failed to fetch blog post',
      },
      { status: 500 }
    );
  }
}

