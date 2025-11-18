import { NextRequest, NextResponse } from 'next/server';
import { blogAPI } from '@elegant/shared/lib/api';
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
    const post = await blogAPI.getBySlug(slug);

    // Map database format to public API format
    const publicPost: PublicBlogPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      featured_image_key: post.featured_image, // Use featured_image as key if it's a path
      images: [], // Blog posts don't have images array in DB, but we can extend this later
      tags: post.tags || [],
      category: post.category || null,
      published: post.published,
      published_at: post.published_at || post.publish_date || null,
      read_time: post.read_time,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
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

